import React from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { MinusCircleIcon } from '@heroicons/react/24/outline';
import MealCard from './MealCard'; 

export function DraggableRecipe({ id, recipe, onRemove }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 100, 
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} 
        className="relative cursor-grab"
    >
        <MealCard recipe={recipe} />
        {/* Remove button for removing a meal from the planner slot */}
        <button 
            onClick={() => onRemove(recipe.id)} 
            className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700 transition"
        >
            <MinusCircleIcon className="w-4 h-4 bg-vp-card rounded-full" />
        </button>
    </div>
  );
}

export function DroppableSlot({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
        ref={setNodeRef} 
        className={`min-h-[70px] p-2 rounded border border-dashed transition duration-200 
                    ${isOver ? 'bg-vp-primary/20 border-vp-primary' : 'bg-vp-background/50 border-vp-card'} 
                    flex flex-col gap-2`}
    >
      {children}
    </div>
  );
}