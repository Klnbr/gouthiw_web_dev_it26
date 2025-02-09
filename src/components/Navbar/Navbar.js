import React, { useState, useEffect } from 'react';
import './Navbar.css';
import '../../components/Detail.css';
import { useAuth } from '../../middleware/Auth';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const navigate = useNavigate();
    const { nutrData, logout } = useAuth();

    const [reportsTrivia, setReportsTrivia] = useState([]);
    const [reportsTopic, setReportsTopic] = useState([]);
    
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false); // เพิ่ม state สำหรับการแสดง/ซ่อนการแจ้งเตือน
    const [notifications, setNotifications] = useState([]); // สมมติว่าเรามีข้อมูลการแจ้งเตือน

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("http://localhost:5500/report/notifications"); // ✅ ใช้เส้นทางที่ถูกต้อง
                console.log("Notifications:", response.data); // ตรวจสอบข้อมูลที่ได้จาก API
                
                // กรองการแจ้งเตือน
                const filteredNotifications = response.data.filter(notification => {
                    // กรองผู้ใช้ที่มี role === 0
                    if (nutrData?.role === '0') {
                        return notification.status !== 0; // ไม่ให้แสดง notification ที่ status === 0
                    }
                    return true; // ให้แสดงการแจ้งเตือนทั้งหมดสำหรับผู้ใช้ที่ไม่ใช่ role === 0
                });

                setNotifications(filteredNotifications); // อัพเดตข้อมูลการแจ้งเตือน
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [nutrData]); // เมื่อ nutrData เปลี่ยนจะเรียกใช้ effect ใหม่

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleNotifications = () => {
        setNotificationVisible(!notificationVisible); // สลับการแสดง/ซ่อนการแจ้งเตือน
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusText = (notification) => {
        if (nutrData?.role === '1') {
            return "มีการแจ้งเตือนการรายงานใหม่";
        }

        switch (notification.status) {
            case 2:
                return "การรายงานของคุณถูกดำเนินการลบแล้ว";
            case 1:
                return "การรายงานของคุณกำลังดำเนินการ";
            case 0:
                return "แจ้งเตือนการรายงานใหม่";
            default:
                return "มีการแจ้งเตือนใหม่";
        }
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
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <div key={index} className="notification-item">
                                    <p className="status-text">{getStatusText(notification)}</p>
                                </div>
                            ))
                        ) : (
                            <p>ไม่มีการแจ้งเตือนใหม่</p>
                        )}
                    </div>
                )}

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
    );
}

export default Navbar;
