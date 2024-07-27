import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
     const navigate = useNavigate();

     const [token, setToken] = useState(null);
     const [userData, setUserData] = useState(null);
     const [isAuthenticated, setIsAuthenticated] = useState(false);
     const storedData = JSON.parse(localStorage.getItem('user_data'))

     useEffect(() => {
          if (storedData) {
               const { userToken, user } = storedData;
               setToken(userToken);
               setUserData(user);
               setIsAuthenticated(true);
          }
     }, [])

     const login = (newToken, newData) => {
          localStorage.setItem(
               'user_data', 
               JSON.stringify({ userToken: newToken, user: newData })
          );

          setToken(newToken);
          setUserData(newData);
          setIsAuthenticated(true);
     }

     const logout = () => {
          localStorage.removeItem('user_data');
          setToken(null);
          setUserData(null);
          setIsAuthenticated(false);
          navigate('/signin');
     }

     return (
          <AuthContext.Provider value={{token, isAuthenticated, login, logout, userData}}>
               {children}
          </AuthContext.Provider>
     )
}

export default AuthProvider