import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useAuth } from '../../middleware/Auth';
import {  useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotiContainer from './NotiContainer';


function Navbar() {
    const navigate = useNavigate();
    const { nutrData, logout } = useAuth();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [setNotifications] = useState([]);
    const [notiCount, setNotiCount] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:5500/report/notifications/${nutrData._id}`);
                setNotifications(response.data);

                const unreadCount = response.data.filter(noti => !noti.isRead).length;
                setNotiCount(unreadCount);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
      
        fetchNotifications();
    }, [nutrData, setNotiCount]);
    
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
                {/* <div className='nav--noti'/> */}
            </div>
            <div className='flex'>
                {nutrData ? (
                    <>
                        <div className='noti--content'>
                            {notiCount > 0 && 
                                <div className='nav--noti'/>
                            }
                            <i className="fa-regular fa-bell" onClick={toggleNotifications}></i>
                        </div>
                        {notificationVisible && (
                            <div className="notification-popup">
                                <h3>การแจ้งเตือน</h3>
                                <NotiContainer setNotiCount={setNotiCount} />
                            </div>
                        )}
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
                                    }}>โปรไฟล์ของฉัน</button>
                                    <button onClick={handleLogout}>ออกจากระบบ</button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className='nav-btn'>
                        <button className='nav--signin' onClick={() => navigate('/signin')}>เข้าสู่ระบบ</button>
                        <button className='nav--signup' onClick={() => navigate('/signup')}>ลงทะเบียน</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
