import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiAddress from '../routes/IP';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
     const navigate = useNavigate();
     const [token, setToken] = useState(null);
     const [nutrData, setNutrData] = useState(null);
     const [isAuthenticated, setIsAuthenticated] = useState(false);
     

     useEffect(() => {
          const storedData = JSON.parse(localStorage.getItem('nutr_data'))
          if (storedData) {
               const { nutrToken, nutr } = storedData;
               setToken(nutrToken);
               setNutrData(nutr);
               setIsAuthenticated(true);
          }
     }, [])
     

     const handleSignin = async ({ email, password }) => {
          try {
              const response = await axios.post(`${apiAddress}/signin`, { email, password });
              if (response.status === 201) {
                  login(response.data.token, response.data.nutr);
                  alert("เข้าสู่ระบบสำเร็จ");
                  if (response.data.nutr.role === '0') {
                    navigate('/home'); // ไปยังหน้า nutr
                  } else if (response.data.nutr.role === '1') {
                    navigate('/admin/home'); // ไปยังหน้า admin
                  }
              }
          } catch (error) {
              alert("เข้าสู่ระบบไม่สำเร็จ");
              console.log("error logging in", error);
              if (error.response) {
                  console.log("Error response data:", error.response.data);
              }
          }
     };

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
          <AuthContext.Provider value={{token, isAuthenticated, login, logout, nutrData, handleSignin }}>
               {children}
          </AuthContext.Provider>
     )
}

export default AuthProvider