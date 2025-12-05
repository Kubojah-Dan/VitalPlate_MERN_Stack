const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios'); 
const User = require('./models/User');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
  seedRecipes(); 
})
.catch(err => console.error(err));

const seedRecipes = async () => {
  const count = await Recipe.countDocuments();
  if (count === 0) {
    const recipes = [
      { title: "Oatmeal with Berries", category: "Breakfast", tags: ["Diabetic Friendly", "High Fiber"], nutrients: { calories: 300, protein: 10, carbs: 45, fats: 5, sodium: 50, fiber: 8 } },
      { title: "Grilled Chicken Salad", category: "Lunch", tags: ["Low Sodium", "Gluten Free"], nutrients: { calories: 450, protein: 40, carbs: 15, fats: 20, sodium: 150, fiber: 5 } },
      { title: "Baked Salmon & Quinoa", category: "Dinner", tags: ["Heart Healthy"], nutrients: { calories: 550, protein: 35, carbs: 40, fats: 25, sodium: 120, fiber: 6 } },
      { title: "Salty Processed Burger", category: "Dinner", tags: ["Cheat Meal"], nutrients: { calories: 800, protein: 30, carbs: 50, fats: 40, sodium: 2400, fiber: 2 } }, // Warning Trigger
    ];
    await Recipe.insertMany(recipes);
    console.log("Database Seeded with Recipes");
  }
};

// ------------------------------------
// AUTH ROUTES
// ------------------------------------

app.post('/api/register', async (req, res) => {
  try {
    const { 
        name, 
        email, 
        password, 
        age, 
        gender, 
        height, 
        weight, 
        condition,      
        clinicalMetrics 
    } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name, 
      email, 
      password: hashedPassword, 
      age,
      gender,
      height,
      weight,
      condition, 
      clinicalMetrics
    });
    
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, condition: user.condition, clinicalMetrics: user.clinicalMetrics, _id: user._id } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------
// DATA AND API ROUTES
// ------------------------------------

app.get('/api/recipes', async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

app.get('/api/plan/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json(user.weeklyPlan || []);
});

app.post('/api/plan/:userId', async (req, res) => {
  const { day, mealData } = req.body; 
  const user = await User.findById(req.params.userId);
  
  let dayPlan = user.weeklyPlan.find(d => d.day === day);
  if (!dayPlan) {
    user.weeklyPlan.push({ day, meals: [mealData] });
  } else {
    dayPlan.meals.push(mealData);
  }
  
  await user.save();
  res.json(user.weeklyPlan);
});

// Spoonacular API Proxy
app.get('/api/spoonacular/recipes', async (req, res) => {
  if (!SPOONACULAR_API_KEY) {
    return res.status(500).json({ error: 'Spoonacular API key is not configured.' });
  }

  const clientQueryParams = req.query;

  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ...clientQueryParams, 
      },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Spoonacular API Error:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).json({ 
      error: 'Failed to fetch recipes from Spoonacular',
      details: error.response?.data?.message || 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));