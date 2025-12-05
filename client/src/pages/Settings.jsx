import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ChevronLeft, User, Heart, AlertTriangle, Save } from 'lucide-react';

const Settings = () => {
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState('');

    const [settingsData, setSettingsData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        condition: 'Hypertension',
        maxSodium: 2300,
        hba1c: null, 
        isDarkTheme: true,
        allowExternalAPI: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettingsData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        setStatusMessage('Settings saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <div className="min-h-screen bg-primary-bg p-8 pt-20">
            <header className="fixed top-0 left-0 w-full bg-secondary-bg shadow-lg p-4 z-10 flex items-center space-x-4 border-b border-slate-700">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 transition duration-300 transform hover:scale-110">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold colorful-text">Settings</h1>
            </header>

            <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-8">
                
                {statusMessage && (
                    <div className="p-4 bg-accent-green/20 text-accent-green rounded-xl flex items-center space-x-2 animate-fadeInUp">
                        <CheckCircle size={20} />
                        <span>{statusMessage}</span>
                    </div>
                )}

                {/* Account Settings */}
                <div className="dark-card">
                    <h2 className="text-xl font-semibold border-b border-slate-700 pb-2 mb-4 flex items-center gap-2 text-slate-50"><User size={20} /> Account Profile</h2>
                    <div className="space-y-4">
                        <input name="name" value={settingsData.name} onChange={handleChange} placeholder="Name" className="input-field" disabled />
                        <input name="email" value={settingsData.email} onChange={handleChange} placeholder="Email" className="input-field" disabled />
                    </div>
                </div>

                {/* Clinical Constraints */}
                <div className="dark-card">
                    <h2 className="text-xl font-semibold border-b border-slate-700 pb-2 mb-4 flex items-center gap-2 text-slate-50"><Heart size={20} /> Clinical Constraints</h2>
                    <p className="text-sm text-slate-400 mb-4">These values dictate your meal safety limits.</p>
                    
                    {settingsData.condition === 'Hypertension' && (
                        <div className="space-y-4">
                            <label className="block text-slate-300">Max Daily Sodium (mg)</label>
                            <input name="maxSodium" type="number" value={settingsData.maxSodium} onChange={handleChange} className="input-field" />
                            <p className="text-xs text-accent-red flex items-center gap-2"><AlertTriangle size={14} /> Changing this value affects all safety warnings.</p>
                        </div>
                    )}
                    
                    {settingsData.condition === 'Diabetes' && (
                        <div className="space-y-4">
                            <label className="block text-slate-300">Latest HbA1c Reading</label>
                            <input name="hba1c" type="number" step="0.1" value={settingsData.hba1c || ''} onChange={handleChange} className="input-field" placeholder="e.g., 6.5" />
                        </div>
                    )}
                </div>

                {/* System Settings */}
                <div className="dark-card">
                    <h2 className="text-xl font-semibold border-b border-slate-700 pb-2 mb-4 flex items-center gap-2 text-slate-50"><SettingsIcon size={20} /> System Preferences</h2>
                    <div className="flex justify-between items-center py-2">
                        <label className="text-slate-300">Allow External Recipes (Spoonacular)</label>
                        <input name="allowExternalAPI" type="checkbox" checked={settingsData.allowExternalAPI} onChange={handleChange} className="h-6 w-6 text-accent-blue rounded border-slate-600 focus:ring-accent-blue" />
                    </div>
                </div>

                <button type="submit" className="btn-primary flex items-center justify-center space-x-2 transform hover:scale-[1.005] transition-transform">
                    <Save size={20} />
                    <span>Save Changes</span>
                </button>
            </form>
        </div>
    );
};

export default Settings;