import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('vitalUser');
    if (storedUser) setUser(JSON.parse(storedUser));
    setTimeout(() => {
      setLoading(false);
    }, 100); 
    
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('vitalToken', token);
    localStorage.setItem('vitalUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vitalToken');
    localStorage.removeItem('vitalUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Rendering children. Protection handled by App.jsx/ProtectedRoute. --- */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);