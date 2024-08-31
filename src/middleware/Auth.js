import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
     const navigate = useNavigate();

     const [token, setToken] = useState(null);
     const [nutrData, setNutrData] = useState(null);
     const [isAuthenticated, setIsAuthenticated] = useState(false);
     const storedData = JSON.parse(localStorage.getItem('nutr_data'))

     useEffect(() => {
          if (storedData) {
               const { nutrToken, nutr } = storedData;
               setToken(nutrToken);
               setNutrData(nutr);
               setIsAuthenticated(true);
          }
     }, [])

     const login = (newToken, newData) => {
          localStorage.setItem(
               'nutr_data', 
               JSON.stringify({ nutrToken: newToken, nutr: newData })
          );

          setToken(newToken);
          setNutrData(newData);
          setIsAuthenticated(true);
     }

     const logout = () => {
          localStorage.removeItem('nutr_data');
          setToken(null);
          setNutrData(null);
          setIsAuthenticated(false);
          navigate('/signin');
     }

     return (
          <AuthContext.Provider value={{token, isAuthenticated, login, logout, nutrData}}>
               {children}
          </AuthContext.Provider>
     )
}

export default AuthProvider