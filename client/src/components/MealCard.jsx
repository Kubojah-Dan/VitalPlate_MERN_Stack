import React from 'react';
import { motion } from 'framer-motion';

export default function MealCard({ recipe }) {
  if (!recipe) return null;
  const calories = Math.round(
    recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 
    recipe.calories || 
    0
  );
  
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-vp-background/50 rounded shadow-md p-2 flex items-start gap-2 border border-vp-card/50">
      <img 
        src={recipe.image || 'https://placehold.co/64x64/252f41/ffffff?text=Meal'} 
        alt={recipe.title} 
        className="w-16 h-16 rounded object-cover"
      />
      <div>
        <div className="font-semibold text-vp-text-light text-sm">{recipe.title}</div>
        <div className="text-xs text-vp-secondary/80">{calories} kcal</div>
      </div>
    </motion.div>
  );
}