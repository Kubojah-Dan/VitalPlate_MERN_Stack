import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import MultiSelectInput from '../components/MultiSelectInput'; 

const API_URL = 'http://localhost:5000/api/register';

const DEFAULT_CONDITIONS = ['Diabetes', 'Hypertension', 'IBS', 'Celiac Disease', 'High Cholesterol'];
const DEFAULT_RESTRICTIONS = ['Low Sodium', 'Gluten-Free', 'Dairy-Free', 'Vegan', 'Keto'];

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    conditions: [], 
    restrictions: [] 
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordValidation = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsError(false);

    if (!handlePasswordValidation(formData.password)) {
        setIsError(true);
        setStatusMessage('Password must be 8+ characters (Include special characters).');
        return;
    }
    
    const dataToSend = {
        ...formData,
        condition: formData.conditions, 
        clinicalMetrics: formData.restrictions,
    };
    
    try {
      await axios.post(API_URL, dataToSend);
      
      setIsError(false);
      setStatusMessage('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      setIsError(true);
      setStatusMessage(error.response?.data?.error || 'Registration failed. Check server logs.');
    }
  };

  return (
    <div className="min-h-screen bg-vp-background">
      <Navbar />
      <div className="flex items-center justify-center p-4 pt-32 sm:p-6 lg:p-8"> 
        <div className="w-full max-w-md p-8 transition duration-500 rounded-xl bg-vp-card shadow-2xl border border-vp-card/50 hover:shadow-vp-primary/20 animate-fade-in-up">
          <h2 className="mb-6 text-3xl font-extrabold text-center text-colorful-gradient">
            Create Your VitalPlate Account
          </h2>

          {/* Status Message Display */}
          {statusMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center ${isError ? "bg-red-900/50 text-red-400" : "bg-vp-secondary/50 text-vp-text-light"}`}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email */}
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-vp-text-light/80">Full Name</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-vp-text-light/80">Email Address</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light" placeholder="you@example.com" />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-vp-text-light/80">Password</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light" placeholder="••••••••" />
              <p className="text-xs text-vp-text-light/50 mt-1">Min 8 chars, must contain letters and numbers.</p>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-vp-text-light/80">Age (Years)</label>
                    <input id="age" name="age" type="number" required value={formData.age} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light" placeholder="30" min="1" />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-vp-text-light/80">Gender</label>
                    <select id="gender" name="gender" required value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light">
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* Height and Weight */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-vp-text-light/80">Height (cm)</label>
                    <input id="height" name="height" type="number" required value={formData.height} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light" placeholder="175" min="100" />
                </div>
                <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-vp-text-light/80">Weight (kg)</label>
                    <input id="weight" name="weight" type="number" required value={formData.weight} onChange={handleChange} className="w-full px-4 py-2 mt-1 rounded-lg bg-vp-background/50 border border-vp-background/80 focus:border-vp-primary text-vp-text-light" placeholder="70" min="30" />
                </div>
            </div>
            
            {/* Clinical Condition Field - MultiSelect */}
            <MultiSelectInput 
                label="Clinical Condition(s)"
                name="conditions"
                options={DEFAULT_CONDITIONS}
                selected={formData.conditions}
                onAdd={(tag) => setFormData(f => ({ ...f, conditions: [...f.conditions, tag] }))}
                onRemove={(tag) => setFormData(f => ({ ...f, conditions: f.conditions.filter(t => t !== tag) }))}
            />

            {/* Dietary Restrictions Field - MultiSelect */}
            <MultiSelectInput 
                label="Dietary Restrictions"
                name="restrictions"
                options={DEFAULT_RESTRICTIONS}
                selected={formData.restrictions}
                onAdd={(tag) => setFormData(f => ({ ...f, restrictions: [...f.restrictions, tag] }))}
                onRemove={(tag) => setFormData(f => ({ ...f, restrictions: f.restrictions.filter(t => t !== tag) }))}
            />

            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-semibold text-white transition duration-300 rounded-lg bg-vp-secondary hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-vp-secondary/50"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-vp-text-light/70">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-vp-primary hover:text-indigo-400">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
