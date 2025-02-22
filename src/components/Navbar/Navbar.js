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
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // ดึงข้อมูลการแจ้งเตือนจาก API
                const response = await axios.get("http://localhost:5500/report/notifications");
    
             
                // กรองการแจ้งเตือน
                const filteredNotifications = response.data.filter(notification => {
                    if (nutrData?.role === '0') {
                        return notification.status !== 0; // ไม่ให้แสดง notification ที่ status === 0
                    }
                    return true;
                });
    
               
                setNotifications(filteredNotifications); // อัพเดตข้อมูลการแจ้งเตือน
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
    
        fetchNotifications();
    }, [nutrData]);
    

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

    const handleItemPress = async (itemId, type) => {
        try {
          const response = await axios.get(`http://localhost:5500/report-detail/${type}/${itemId}`);
          const reportData = response.data;
      
          if (!reportData || !reportData._id) {
            alert("ข้อมูลรายงานไม่ถูกต้องหรือไม่พบ ID");
            return;
          }
      
          if (type === "trivia") {
            
            navigate("/admin/report-trivia-detail", { state: { reportData } });
          } else if (type === "topic") {
          
            navigate("/admin/report-topic-detail", { state: { reportData } });
          } else {
            alert("ประเภทของรายงานไม่ถูกต้อง");
          }
        } catch (error) {
          console.error("Error fetching report data:", error.message);
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }
      };

    const getStatusText = (notification) => {
        console.log("Notification:", notification);
        // console.log("triv_id Data:", notification.triv_id);
        
        let reportName = "ไม่ระบุ";
    
        // ตรวจสอบว่าเป็น triv_id หรือ content_id และกำหนด reportName
        if (notification.triv_id?.head) {
            reportName = notification.triv_id.head;
            return `แจ้งเตือนการรายงานใหม่: [เกร็ดความรู้] ${reportName}`;
        } else if (notification.content_id?.title) {
            reportName = notification.content_id.title;
            return `แจ้งเตือนการรายงานใหม่: [กระทู้] ${reportName}`;
        }
        
        // ถ้าไม่มี triv_id หรือ content_id ให้ใช้ค่า reportName ที่ตั้งไว้
        if (nutrData?.role === '1') {
            return `แจ้งเตือนการรายงานใหม่: ${reportName}`;
        }
        
        switch (notification.status) {
            case 2:
                return `การรายงานของคุณถูกดำเนินการลบแล้ว: ${reportName}`;
            case 1:
                return `การรายงานของคุณกำลังดำเนินการ: ${reportName}`;
            case 0:
                return `แจ้งเตือนการรายงานใหม่: ${reportName}`;
            default:
                return `มีการแจ้งเตือนใหม่: ${reportName}`;
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
            <>
                {notifications.slice(0, 6).map((notification, index) => (
                    <div key={index} className="notification-item" onClick={() => {
                        const type = notification.triv_id ? "trivia" : "topic"; 
                        handleItemPress(notification._id, type);
                    }}>
                        <p className="status-text">{getStatusText(notification)}</p>
                    </div>
                ))}
               
                    <p className="view-all-btn" onClick={() => navigate('/admin/noti')}>
                        ดูการแจ้งเตือนทั้งหมด
                    </p>
               
            </>
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
