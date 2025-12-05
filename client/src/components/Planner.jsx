import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'; 
import { DroppableSlot, DraggableRecipe } from './DragDropPlanner';
import MealCard from './MealCard';
import { motion } from 'framer-motion';

const defaultDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const API_BASE_URL = 'http://localhost:5000'; 

const calculateTotalNutrition = (plan) => {
    let totals = { calories: 0, sodium: 0, carbs: 0, protein: 0 };
    
    Object.values(plan).forEach(day => {
        Object.values(day).forEach(meal => {
            if (meal?.recipe) {
                const nutrients = meal.recipe.nutrition?.nutrients || [];
                totals.calories += nutrients.find(n => n.name === 'Calories')?.amount || meal.recipe.calories || 0;
                totals.sodium += nutrients.find(n => n.name === 'Sodium')?.amount || meal.recipe.sodium || 0;
                totals.carbs += nutrients.find(n => n.name === 'Carbohydrates')?.amount || meal.recipe.carbs || 0;
                totals.protein += nutrients.find(n => n.name === 'Protein')?.amount || meal.recipe.protein || 0;
            }
        });
    });
    return totals;
};

// Grocery List
const GroceryList = ({ plan }) => {
    const list = {};
    
    Object.values(plan).forEach(day => {
        Object.values(day).forEach(meal => {
            if (meal?.recipe) {
                (meal.recipe.tags || []).forEach(tag => {
                    list[tag] = (list[tag] || 0) + 1;
                });
            }
        });
    });

    return (
        <div className="p-4 bg-vp-card rounded-xl shadow-lg border border-vp-card/50">
            <h3 className="text-xl font-bold text-vp-accent mb-3">🛒 Weekly Grocery Summary</h3>
            {Object.keys(list).length === 0 ? (
                <p className="text-vp-text-light/70">Drag recipes onto the planner to generate a list.</p>
            ) : (
                <ul className="space-y-1 text-sm text-vp-text-light">
                    {Object.entries(list).map(([tag, count]) => (
                        <li key={tag} className="flex justify-between border-b border-vp-background/50 pb-1">
                            <span>{tag} meal(s) tagged</span>
                            <span className="font-semibold text-vp-secondary">{count}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default function Planner({ initialRecipes }) {
    const [plan, setPlan] = useState(() => {
        // Initialize blank plan on load
        const blank = {};
        defaultDays.forEach(d => blank[d] = {});
        return blank;
    }); 
    
    const [activeId, setActiveId] = useState(null);

    const totals = calculateTotalNutrition(plan);

    const handleRemoveMeal = (day, mealType) => {
        setPlan(prevPlan => ({
            ...prevPlan,
            [day]: {
                ...prevPlan[day],
                [mealType]: null,
            }
        }));
    };
    
    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null); // Clear active item after drop/end

        if (active.id.startsWith('recipe-') && over?.id && over.id.day) {
            const recipeId = active.id.replace('recipe-', '');
            
            // Find the recipe object from the full list
            const droppedRecipe = initialRecipes.find(r => r.id.toString() === recipeId); 

            if (droppedRecipe) {
                setPlan(prevPlan => ({
                    ...prevPlan,
                    [over.id.day]: {
                        ...prevPlan[over.id.day],
                        [over.id.mealType]: {
                            recipe: droppedRecipe,
                        }
                    }
                }));
            }
        }
    };
    

    return (
        <div className="space-y-6">
            {/* Weekly Totals Summary */}
            <div className="p-4 bg-vp-card rounded-xl shadow-lg border border-vp-card/50">
                <h3 className="text-xl font-bold text-colorful-gradient mb-3">Weekly Totals (Estimated)</h3>
                <div className="grid grid-cols-4 gap-4 text-center text-vp-text-light">
                    <div><div className="text-2xl font-bold text-vp-secondary">{Math.round(totals.calories)}</div><div className="text-xs">kcal</div></div>
                    <div><div className="text-2xl font-bold text-vp-secondary">{Math.round(totals.protein)}</div><div className="text-xs">Protein (g)</div></div>
                    <div><div className="text-2xl font-bold text-vp-secondary">{Math.round(totals.carbs)}</div><div className="text-xs">Carbs (g)</div></div>
                    <div><div className="text-2xl font-bold text-vp-secondary">{Math.round(totals.sodium)}</div><div className="text-xs">Sodium (mg)</div></div>
                </div>
            </div>

            {/* Weekly Planner Grid */}
            <div className="p-4 bg-vp-card rounded-xl shadow-lg border border-vp-card/50">
                <h2 className="text-2xl font-bold text-vp-text-light mb-4">Meal Planner</h2>
                <div className="grid grid-cols-7 gap-3 overflow-x-auto">
                    {defaultDays.map(day => (
                        <div key={day} className="bg-vp-background/50 rounded-lg p-2 shadow-inner min-w-[150px]">
                            <h3 className="capitalize font-semibold mb-3 text-vp-primary border-b border-vp-card pb-1">{day}</h3>
                            <div className="space-y-3">
                                {mealTypes.map(mealType => (
                                    <motion.div key={mealType} className="rounded-lg">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <strong className="text-vp-text-light/80">{mealType}</strong>
                                        </div>
                                        {/* Droppable Slot for Planner */}
                                        <DroppableSlot id={{ day, mealType }}> 
                                            {plan?.[day]?.[mealType]?.recipe ? (
                                                <DraggableRecipe 
                                                    id={`plan-${day}-${mealType}`}
                                                    recipe={plan[day][mealType].recipe}
                                                    onRemove={() => handleRemoveMeal(day, mealType)}
                                                />
                                            ) : (
                                                <div className="text-xs text-vp-text-light/50 text-center py-2">Drop a recipe here.</div>
                                            )}
                                        </DroppableSlot>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Grocery List */}
            <GroceryList plan={plan} />
            
        </div>
    );
}