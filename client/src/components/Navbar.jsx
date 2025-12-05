import { Link } from 'react-router-dom';
import { ChefHat, User } from 'lucide-react';

const Navbar = () => (
  <header className="fixed top-0 left-0 w-full bg-vp-card/95 backdrop-blur-sm shadow-xl p-4 z-10">
    <div className="flex justify-between items-center max-w-7xl mx-auto">
      
      {/* Logo/Title */}
      {/* Using vp-primary, vp-secondary for colorful-text appearance */}
      <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-colorful-gradient">
        <ChefHat className="text-vp-secondary h-7 w-7" />
        <span>VitalPlate</span>
      </Link>
      
      {/* Login/Register Buttons */}
      <nav className="flex space-x-4">
        <Link 
          to="/login" 
          className="flex items-center space-x-2 px-4 py-2 text-vp-text-light/80 font-semibold rounded-full hover:bg-vp-background/50 transition duration-300 transform hover:scale-105"
        >
          <User size={18} />
          <span>Login</span>
        </Link>
        <Link 
          to="/register" 
          className="px-4 py-2 bg-vp-primary text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          Register
        </Link>
      </nav>
    </div>
  </header>
);

export default Navbar;