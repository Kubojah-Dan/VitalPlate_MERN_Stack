const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, 
  tags: [String], 
  nutrients: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    sodium: Number, 
    fiber: Number   
  }
});

module.exports = mongoose.model('Recipe', RecipeSchema);