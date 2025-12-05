import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { MagnifyingGlassIcon, BellIcon, Cog8ToothIcon, UserIcon } from '@heroicons/react/24/outline';
import axios from 'axios'; 
import { useAuth } from '../context/AuthContext';
import Planner from '../components/Planner';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'; 
import { DraggableRecipe } from '../components/DragDropPlanner';

const API_BASE_URL = 'http://localhost:5000'; 

const DashboardNavbar = ({ children, onLogout }) => (
    <nav className="sticky top-0 z-20 w-full p-4 shadow-xl bg-vp-card/90 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link to="/dashboard" className="text-2xl font-bold text-colorful-gradient">
                VitalPlate
            </Link>
            <div className="flex items-center space-x-4">
                {children}
                {/* Logout Button */}
                <button 
                    onClick={onLogout} 
                    className="px-4 py-2 text-sm font-semibold rounded-full bg-vp-accent/20 text-vp-accent hover:bg-vp-accent/40 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    </nav>
);

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initialSearchTerm = user?.condition.join(', ') || 'healthy';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [plannerKey, setPlannerKey] = useState(0);

  const sensors = useSensors(
        useSensor(PointerSensor)
  );

  // --- RECIPE FETCHING LOGIC ---
  const fetchRecipes = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const dietFilters = user?.clinicalMetrics.join(',') || '';
      
      const response = await axios.get(`${API_BASE_URL}/api/spoonacular/recipes`, {
        params: { 
          query: query,
          number: 12, 
          addRecipeInformation: true,
          diet: dietFilters, 
          instructionsRequired: true
        },
      });
      setRecipes(response.data.results || []);
      setPlannerKey(k => k + 1); 
    } catch (err) {
      console.error('Frontend Fetch Error:', err);
      setError('Could not fetch recipes. Check the server or API key usage.'); 
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(initialSearchTerm);
  }, [user, initialSearchTerm]); 

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchRecipes(searchTerm.trim());
    }
  };
  
  // --- DND CONTEXT HANDLING ---
  function handleDragEnd(event) {
      const { active, over } = event;

      if (over?.id && active?.data?.current?.recipe) {
          console.log(`Dropped recipe ${active.id} onto slot ${over.id}`);
          alert(`Meal ${active.id} added to ${over.id.mealType} on ${over.id.day}`);
      }
  }

  const RecipeCard = ({ recipe }) => (
    <div 
        className="p-3 transition duration-300 rounded-lg shadow-xl bg-vp-card hover:shadow-vp-secondary/30 transform hover:-translate-y-1"
    >
        <DraggableRecipe 
            id={`recipe-${recipe.id}`} 
            recipe={recipe} 
            data={{ recipe: recipe }} 
        />
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/'); 
  }

  return (
    <div className="min-h-screen bg-vp-background">
      {/* Navigation, Profile and Logout */}
      <DashboardNavbar onLogout={handleLogout}>
        <div className="flex items-center space-x-4">
          {/* Notifications Placeholder */}
          <button className="p-2 transition duration-200 rounded-full text-vp-text-light/70 hover:text-vp-accent hover:bg-vp-background">
            <BellIcon className="w-6 h-6" /> 
          </button>
          {/* Settings Placeholder */}
          <button onClick={() => setShowSettings(!showSettings)} className="p-2 transition duration-200 rounded-full text-vp-text-light/70 hover:text-vp-accent hover:bg-vp-background">
            <Cog8ToothIcon className="w-6 h-6" />
          </button>
          {/* Profile Account (User Initial) */}
          <div className="w-10 h-10 rounded-full bg-vp-primary/50 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.[0].toUpperCase() || <UserIcon className="w-5 h-5" />}
          </div> 
        </div>
      </DashboardNavbar>
      
      {/* Settings Modal Placeholder */}
      {showSettings && (
          <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center">
              <div className="bg-vp-card p-6 rounded-xl w-96 text-vp-text-light">
                  <h3 className="text-xl font-bold mb-4">Settings (To be implemented)</h3>
                  <p>Currently logged in as: **{user?.name}**</p>
                  <p className="text-sm mt-2">Future options: Update profile, clinical metrics, and preferences.</p>
                  <button onClick={() => setShowSettings(false)} className="mt-4 px-4 py-2 bg-vp-primary rounded">Close</button>
              </div>
          </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-colorful-gradient mb-6">
          Personalized Dashboard
        </h1>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Column 1: Weekly Planner and Grocery List */}
            <div className="lg:col-span-8 space-y-6">
                <Planner key={plannerKey} initialRecipes={recipes} />
            </div>

            {/* Column 2: Recipe Search and Draggable Recipes */}
            <div className="lg:col-span-4 space-y-6">
                 {/* Search Bar for Spoonacular */}
                <form onSubmit={handleSearch} className="mb-4 sticky top-24 z-10">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for recipes..."
                            className="w-full py-3 pl-12 pr-4 rounded-xl bg-vp-card border border-vp-card/80 focus:border-vp-secondary text-vp-text-light text-lg"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vp-text-light/60 hover:text-vp-secondary" aria-label="Search">
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </button>
                    </div>
                </form>

                <h2 className="text-2xl font-semibold text-vp-text-light">Suggested Recipes</h2>
                
                {loading && (<p className="text-lg text-center text-vp-secondary/80 mt-8">Fetching personalized meals...</p>)}
                
                {error && (<div className="p-4 text-red-400 bg-red-900/50 border border-red-800 rounded-lg">Error: {error}</div>)}

                {!loading && !error && recipes.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 max-h-[80vh] overflow-y-auto">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                )}
                
                {!loading && !error && recipes.length === 0 && (
                    <p className="text-lg text-center text-vp-text-light/70 mt-8">No recipes found. Try a different search.</p>
                )}
            </div>
        </div>
        </DndContext>
        
      </div>
    </div>
  );
}

export default Dashboard;