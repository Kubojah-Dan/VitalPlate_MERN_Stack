import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const Notifications = () => {
    const navigate = useNavigate();
    const mockNotifications = [
        { id: 1, type: 'Alert', message: 'Sodium limit exceeded yesterday. Review Monday’s plan.', time: '2h ago' },
        { id: 2, type: 'Success', message: 'Meal prep reminder: Your ingredients for Tuesday are ready.', time: '5h ago' },
        { id: 3, type: 'Warning', message: 'It’s time to update your HbA1c reading in Settings.', time: '1d ago' },
    ];

    return (
        <div className="min-h-screen bg-primary-bg p-8 pt-20">
            <header className="fixed top-0 left-0 w-full bg-secondary-bg shadow-lg p-4 z-10 flex items-center space-x-4 border-b border-slate-700">
                <button onClick={() => navigate(-1)} className="p-2 rounded-full text-slate-300 hover:bg-slate-700 transition duration-300 transform hover:scale-110">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-3xl font-bold colorful-text">Notifications</h1>
            </header>

            <div className="max-w-3xl mx-auto space-y-6">
                {mockNotifications.map(notif => (
                    <div 
                        key={notif.id} 
                        className="dark-card flex items-start space-x-4 transition duration-300 hover:shadow-accent-blue/20 transform hover:scale-[1.01]"
                    >
                        <div className={`p-3 rounded-full ${
                            notif.type === 'Alert' ? 'bg-accent-red/20 text-accent-red' : 
                            notif.type === 'Warning' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-accent-green/20 text-accent-green'
                        }`}>
                            {notif.type === 'Alert' && <AlertTriangle size={24} />}
                            {notif.type === 'Warning' && <Bell size={24} />}
                            {notif.type === 'Success' && <CheckCircle size={24} />}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-50">{notif.message}</p>
                            <p className="text-sm text-slate-400 mt-1 flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{notif.time}</span>
                            </p>
                        </div>
                    </div>
                ))}
                {mockNotifications.length === 0 && (
                     <div className="text-center p-12 text-slate-500 border-2 border-dashed border-slate-700 rounded-xl">
                        No new notifications. All good!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;