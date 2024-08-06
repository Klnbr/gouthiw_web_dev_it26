import React, { Component, useState } from 'react'
import './Navbar.css'
import { MenuItems } from '../MenuItems';
import { useAuth } from '../../middleware/Auth';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
     const navigate = useNavigate();
     const { userData, logout } = useAuth();
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
               {userData ? (
                    <div className='nav--username' onClick={toggleDropdown}>
                         <p>{userData.firstname} {userData.lastname}</p>
                         <i class="fa-solid fa-angle-down"></i>
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
     )
}

export default Navbar;
