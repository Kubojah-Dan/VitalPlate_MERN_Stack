import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 

const API_URL = 'http://localhost:5000/api/login';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handlePasswordValidation = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsError(false);
    if (!handlePasswordValidation(password)) {
        setIsError(true);
        setStatusMessage('Password must be 8+ characters(Include special characters).');
        return;
    }

    try {
      const response = await axios.post(API_URL, { email, password });
      
      login(response.data.user, response.data.token);
      navigate('/dashboard');

    } catch (error) {
      setIsError(true);
      setStatusMessage(error.response?.data?.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-vp-background">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-32 sm:p-6 lg:p-8"> 
        <div className="w-full max-w-md p-8 transition duration-500 rounded-xl bg-vp-card shadow-2xl border border-vp-card/50 hover:shadow-vp-primary/20 animate-fade-in-up">
          <h2 className="mb-6 text-3xl font-extrabold text-center text-colorful-gradient">
            Log In to VitalPlate
          </h2>

          {statusMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center ${isError ? "bg-red-900/50 text-red-400" : "bg-vp-secondary/50 text-vp-text-light"}`}>
              {statusMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-vp-text-light/80">
                Email Address
              </label>
              <input
                id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light"
                placeholder="you@example.com"
              />
            </div>
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-vp-text-light/80">
                Password
              </label>
              <input
                id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light"
                placeholder="••••••••"
              />
              <p className="text-xs text-vp-text-light/50 mt-1">Min 8 chars, must contain letters and numbers.</p>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-semibold text-white transition duration-300 rounded-lg bg-vp-primary hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-vp-primary/50"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-vp-text-light/70">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-vp-secondary hover:text-emerald-400">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;