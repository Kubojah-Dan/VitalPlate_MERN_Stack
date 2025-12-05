import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:5000';
const SPOONACULAR_ENDPOINT = '/api/spoonacular/recipes';

const MOCK_RECIPES = [
  "https://placehold.co/300x200/4f46e5/ffffff?text=Personalized+Diet",
  "https://placehold.co/300x200/10b981/ffffff?text=Clinical+Precision",
  "https://placehold.co/300x200/f97316/ffffff?text=Heart+Health",
  "https://placehold.co/300x200/94a3b8/ffffff?text=Low+Sodium"
];

const AnimatedRecipeCard = ({ imageUrl, index }) => (
  <div
    className="w-40 h-32 md:w-56 md:h-44 rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 ease-out border-4 border-vp-secondary opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${index * 0.2}s` }}
  >
    <div
      className="h-full w-full flex items-center justify-center text-sm font-bold text-white"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {imageUrl.includes('text')
        ? imageUrl.split('?text=')[1].replace(/\+/g, ' ')
        : 'Delicious Meal'}
    </div>
  </div>
);

const LandingPage = () => {
  const [recipes, setRecipes] = useState(MOCK_RECIPES);

  useEffect(() => {
    const fetchExternalRecipes = async () => {
      try {
        const res = await axios.get(`${API_URL}${SPOONACULAR_ENDPOINT}`, {
          params: {
            query: 'healthy',
            number: 4,
            limitLicense: true,
          },
        });

        if (res.data.results?.length > 0) {
          const apiImages = res.data.results.slice(0, 4).map((r) => r.image);
          setRecipes(apiImages);
        }
      } catch (error) {
        console.warn("Failed to fetch Spoonacular recipes. Using mock data.");
      }
    };

    fetchExternalRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-vp-background text-vp-text-light p-8 flex flex-col items-center">
      <Navbar />

      <main className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl pt-32 space-y-12 md:space-y-0">

        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Unlock <span className="text-vp-secondary">Your Best Health</span>, Bite by Bite.
          </h1>

          {/* Paragraph → fixed */}
          <p
            className="text-xl text-vp-text-light/80 font-light max-w-md mx-auto md:mx-0 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            VitalPlate crafts meals based on your clinical constraints, not just calories.
            Precision nutrition, made simple.
          </p>

          {/* Buttons → fixed */}
          <div
            className="flex justify-center md:justify-start space-x-4 pt-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <Link
              to="/register"
              className="bg-vp-secondary text-vp-background px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-emerald-500 transition duration-300 transform hover:scale-105"
            >
              Start Your Journey
            </Link>

            <Link
              to="/login"
              className="border border-vp-primary text-vp-primary px-6 py-3 rounded-full font-bold hover:bg-vp-primary/20 transition duration-300 transform hover:scale-105"
            >
              I Have an Account
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: GRID */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="grid grid-cols-2 gap-4 md:gap-6 relative">
            {recipes.map((url, index) => (
              <AnimatedRecipeCard key={index} imageUrl={url} index={index} />
            ))}

            {/* Soft glow */}
            <div className="absolute inset-0 bg-vp-card/50 rounded-xl pointer-events-none transform scale-105 opacity-30 animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

