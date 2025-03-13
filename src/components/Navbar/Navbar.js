import React, { useState, useEffect } from 'react';
import './Navbar.css';
import '../../components/Detail.css';
import { useAuth } from '../../middleware/Auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import NotiContainer from './NotiContainer';

const optionsDMY = {
    timeZone: "Asia/Bangkok",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

function Navbar() {
    const navigate = useNavigate();
    const { nutrData, logout } = useAuth();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [pendingReports, setPendingReports] = useState(0);

    // const calculateTimeAgo = (createdAt) => {
    //     const currentTime = new Date();
    //       const postTime = new Date(createdAt);
    //       const timeDiff = Math.abs(currentTime - postTime) / 36e5;

    //       if (timeDiff < 1) {
    //            return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
    //       } else if (timeDiff < 24) {
    //            return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
    //       } else {
    //            return postTime.toLocaleString("th-TH", optionsDMY);
    //       }
    //  };
    
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleNotifications = () => {
        setNotificationVisible(!notificationVisible);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    return (
        <div className='nav--container'>
            <div className='nav--logo'>
                <p>GOUTHIW</p>
            </div>
            <div className='flex'>
                <i className="fa-regular fa-bell" onClick={toggleNotifications}></i>
                {notificationVisible && (
                    <div className="notification-popup">
                        <h3>การแจ้งเตือน</h3>
                        <NotiContainer />
                    </div>
                )}

                {nutrData ? (
                    <div className='nav--username' onClick={toggleDropdown}>
                        <p>{nutrData.firstname} {nutrData.lastname}</p>
                        <i className="fa-solid fa-angle-down"></i>
                        {dropdownVisible && (
                            <div className='dropdown-menu'>
                                <button onClick={() => {
                                    if (nutrData?.role === '1') {
                                        navigate('/admin/information');  // ถ้า role เป็น '1' ไปที่หน้า /admin/noti
                                    } else {
                                        navigate('/profile');  // ถ้าไม่ใช่แอดมิน, ไปที่หน้า /noti
                                    }
                                }}>My profile</button>
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
    );
}

export default Navbar;
