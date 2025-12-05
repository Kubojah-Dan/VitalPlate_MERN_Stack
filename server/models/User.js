const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true }, 
  height: { type: Number, required: true }, 
  weight: { type: Number, required: true }, 

  condition: { 
    type: [String], 
    required: true,
    default: [] 
  }, 
  
  clinicalMetrics: {
    type: [String],
    default: []
  },
  
  weeklyPlan: [{
    day: String, 
    meals: [{
      type: String, 
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      title: String,
      calories: Number,
      sodium: Number,
      carbs: Number
    }]
  }]
});

module.exports = mongoose.model('User', UserSchema);