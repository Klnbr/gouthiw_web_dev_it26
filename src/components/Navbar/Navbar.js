import React, { Component, useState } from 'react'
import './Navbar.css'
import { useAuth } from '../../middleware/Auth';
import { Link, useNavigate } from 'react-router-dom';
import LogoGouthiw from '../../images/gouthiw-logo.png';

function Navbar() {
     const navigate = useNavigate();
     const { nutrData, logout } = useAuth();
     const [dropdownVisible, setDropdownVisible] = useState(false);

     const toggleDropdown = () => {
          setDropdownVisible(!dropdownVisible);
     };

     const handleLogout = () => {
          logout();
          navigate('/');
     };

     return (
          <div className='nav--container'>
               <div className='nav--logo'>

                    <p>GOUTHIW</p>

                    {/* <div className='logo'>GOUTHIW</div> */}
                    
               </div>
               <div className='flex'>
                    <i className="fa-regular fa-bell"></i>
                    {nutrData ? (
                         <div className='nav--username' onClick={toggleDropdown}>
                              <p>{nutrData.firstname} {nutrData.lastname}</p>
                              <i className="fa-solid fa-angle-down"></i>
                              {dropdownVisible && (
                                   <div className='dropdown-menu'>
                                        <button onClick={() => navigate('/profile')}>My profile</button>
                                        <button onClick={handleLogout}>Log out</button>
                                   </div>
                              )}
                         </div>    
                    ) : (
                         <div className='nav-btn'>
                              <button className='nav--signin' onClick={() => navigate('/signin')}>Signin</button>
                              <button className='nav--signup' onClick={() => navigate('/signup')}>Signup</button>
                         </div>
                    )}
               </div>
          </div>
     )
}

export default Navbar;
