import React, { useState } from 'react';
import './SideBar.css';
import { Link, useLocation } from 'react-router-dom';
import { MenuItems } from './MenuItems';
import SidebarLogo from '../../images/logo_temporary.png';
import SidebarBottom from '../../images/bottom_nav2.png';

function SideBar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true); // State to manage sidebar toggle

    const handleToggle = () => {
        setIsOpen(!isOpen); // Toggle the sidebar open/close state
    };

    return (
        <div className={`side-bar--container ${isOpen ? '' : 'collapsed'}`}>
            <div className='side-bar--content'>

                {/* <p className='app-logo'>GOUTHIW</p> */}
                {/* <img className='side-bar--logo' alt='' src={SidebarLogo} /> */}

                <div className='logo'>GOUTHIW</div>


                {/* Toggle button for mobile view */}
                <div className='menu-icons' onClick={handleToggle}>
                    <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                <div className={`side-bar--menu ${isOpen ? '' : 'hidden'}`}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li
                                className={location.pathname === item.url ? 'side-bar--focus' : 'side-bar--links'}
                                key={index}
                            >
                                <Link className='side-bar--item' to={item.url}>
                                    <i className={item.icon}></i>
                                    <span className='side-bar--title'>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </div>
            </div>
            <img className='side-bar--btm' alt='' src={SidebarBottom} />
        </div>
    );
}

export default SideBar;
