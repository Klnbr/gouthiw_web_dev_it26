import React, { useState, useEffect } from 'react';
import './SideBar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import { MenuAdmin } from './MenuAdmin';
import { useAuth } from '../../middleware/Auth';
import SidebarBottom from '../../images/bottom_nav2.png';

function SideBar() {
    const location = useLocation();
    const navigate = useNavigate(); // ใช้ useNavigate แทนการรับเป็น prop
    const { nutrData } = useAuth();
    const [isOpen, setIsOpen] = useState(true); // Sidebar Toggle State
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile Menu State
    const handleMobileToggle = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
            return;
        }
        const handleClickOutside = (event) => {
            if (!document.querySelector('.side-bar--container').contains(event.target)) {
                setIsMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navigate]);

    const menuRender = nutrData.role === '1' ? MenuAdmin : MenuItems;

    return (
        <div className={`side-bar--container ${isOpen ? '' : 'collapsed'}`}>
            <div className='side-bar--content'>
    
                <div className='logo-container' onClick={() => navigate("/home")}>
                    <div className='logo'>
                        <p >GOUTHIW</p>
                    </div>
                    <div className='logo-img'>
                        <img src="https://firebasestorage.googleapis.com/v0/b/gouthiw-246ad.appspot.com/o/logo-green-inline.png?alt=media&token=e46cda36-c4bf-4f64-a0d9-23ac448830c8" alt="Logo" loading="lazy"/>
                    </div>
                </div>

                <div className='menu-icons' onClick={handleMobileToggle}>
                    <i className={isMobileOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                <ul className={`side-bar--menu ${isMobileOpen ? 'active' : ''}`}>
                    {menuRender.map((item, index) => (
                        <li
                            className={location.pathname === item.url ? 'side-bar--focus' : 'side-bar--links'}
                            key={index}
                        >
                            <Link className='side-bar--item' to={item.url}>
                                <i className={item.icon}></i>
                                <span className='side-bar--title'>{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <img className='side-bar--btm' alt='sidebarbottom' src={SidebarBottom} loading="lazy"/>
        </div>
    );
}

export default SideBar;
