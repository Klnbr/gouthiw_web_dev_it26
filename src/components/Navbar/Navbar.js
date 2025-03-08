import React, { useState, useEffect } from 'react';
import './Navbar.css';
import '../../components/Detail.css';
import { useAuth } from '../../middleware/Auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const optionsDMY = {
    timeZone: "Asia/Bangkok",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

function Navbar() {
    const navigate = useNavigate();
    const { nutrData, logout } = useAuth();
    const location = useLocation();
    const [reportsTrivia, setReportsTrivia] = useState([]);
    const [reportsTopic, setReportsTopic] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [pendingReports, setPendingReports] = useState(0);
    const statusMap = {
        0: "อยู่ระหว่างการตรวจสอบ",
        1: "ดำเนินการเรียบร้อย",
        2: "ปฏิเสธรายงาน",
    };
    
    // useEffect(() => {
    //     const fetchNotifications = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:5500/report/notifications");
    //             const filteredNotifications = response.data.map(notification => {
    //                 // สำหรับ role === '0' จะกรองสถานะและแสดงข้อความตาม status
    //                 if (nutrData?.role === '0') {
    //                     const statusText = statusMap[notification.status] || "สถานะไม่ระบุ";
    //                     return {
    //                         ...notification,
    //                         statusText, // เพิ่ม statusText ลงในการแจ้งเตือน
    //                     };
    //                 }
    //                 return notification; // สำหรับ role อื่น ๆ ให้แสดงการแจ้งเตือนทั้งหมด
    //             });
                
    //             setNotifications(filteredNotifications);
    //         } catch (error) {
    //             console.error("Error fetching notifications:", error);
    //         }
    //     };
    //     fetchNotifications();
    // }, [nutrData]);

    useEffect(() => {
        if (!nutrData?._id) return;
    
        const fetchNotifications = async () => {
            try {
                let response;
    
                if (String(nutrData.role) === '1') {
                    response = await axios.get("http://localhost:5500/report/notifications");
                    setNotifications(response.data);
                } else if (String(nutrData.role) === '2' || String(nutrData.role) === '0') {
                    response = await axios.get(`http://localhost:5500/reports/${nutrData._id}`, { timeout: 10000 });
    
                    const filteredNotifications = response.data.map(notification => ({
                        ...notification,
                        statusText: statusMap[notification.status] || "สถานะไม่ระบุ"
                    }));
    
                    const pendingReportsCount = filteredNotifications.filter(notif => notif.status === 0).length;
    
                    console.log("Filtered Notifications:", filteredNotifications);
                    console.log("Pending Reports Count:", pendingReportsCount);
    
                    setNotifications(filteredNotifications);
                    setPendingReports(pendingReportsCount);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error.message);
            }
        };
    
        fetchNotifications();
    }, [nutrData]);

      const calculateTimeAgo = (createdAt) => {
          const currentTime = new Date();
          const postTime = new Date(createdAt);
          const timeDiff = Math.abs(currentTime - postTime) / 36e5;

          if (timeDiff < 1) {
               return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
          } else if (timeDiff < 24) {
               return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
          } else {
               return postTime.toLocaleString("th-TH", optionsDMY);
          }
     };
    
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
            if (nutrData?.role === '1') {
              navigate('/admin/report-trivia-detail', { state: { reportData } });
            } else {
              navigate('/report-trivia-detail', { state: { reportData } });
            }
          } else if (type === "topic") {
            if (nutrData?.role === '1') {
              navigate('/admin/report-topic-detail', { state: { reportData } });
            } else {
              navigate('/report-topic-detail', { state: { reportData } });
            }
          } else {
            alert("ประเภทของรายงานไม่ถูกต้อง");
          }
        } catch (error) {
          console.error("Error fetching report data:", error.message);
          alert("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }
    };

const getStatusText = (notification) => {
    console.log(notification); // ตรวจสอบค่าใน Console

    let reportName = "ไม่ระบุ";
    let reportType = "";

    if (notification?.triviaDetails?.head) {
        reportName = notification.triviaDetails.head;
        reportType = "[เกร็ดความรู้]";
    } else if (notification?.triv_id?.head) {
        reportName = notification.triv_id.head;
        reportType = "[เกร็ดความรู้]";
    } else if (notification?.content_id?.title) {
        reportName = notification.content_id.title;
        reportType = "[กระทู้]";
    }

    return (
        <div>
            <span>
                {notification?.statusText
                    ? `การรายงานของคุณ`
                    : `แจ้งเตือนการรายงานใหม่`}
            </span>{" "}
            {reportType} {reportName}
            <br />
            {notification?.createdAt && (
                <span style={{ fontSize: "14px", color: "#888", marginTop: "3px" }}>
                    {calculateTimeAgo(notification.createdAt)}
                </span>
            )}
        </div>
    );
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
                                <p className="view-all-btn" onClick={() => {
                                    if (nutrData?.role === '1') {
                                        navigate('/admin/notification');  // ถ้า role เป็น '1' ไปที่หน้า /admin/noti
                                    } else {
                                        navigate('/notification');  // ถ้าไม่ใช่แอดมิน, ไปที่หน้า /noti
                                    }
                                }}>
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
