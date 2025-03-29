import React, { useState, useEffect } from 'react';
import './NotiContainer.css';
import '../../components/Detail.css';
import { useAuth } from '../../middleware/Auth';
import {  useNavigate} from 'react-router-dom';
import axios from 'axios';
const NotiContainer = () => {
    const navigate = useNavigate();
    const { nutrData } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true); // ตัวอย่าง ID ของ nutr
      
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/report/notifications/${nutrData._id}`);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
      
        fetchNotifications();
    }, [nutrData]);

    const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // เรียงจากใหม่ไปเก่า
    );
    
    const latestNotifications = sortedNotifications.slice(0, 5);


    const adminItemPress = async (reportId, notiId) => {
        try {
            const responseDetail = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/report-detail/trivia/${reportId}`);
            const reportData = responseDetail.data;
            
            if ( reportData.status === null ) {
                const updateStatus = { status: 0 };

                await axios.put(`https://gouthiw-web-dev-it26.onrender.com/report/${reportId}/status`, updateStatus);

                const notiData = {
                    report_id: reportData._id,
                    triv_id: reportData.triv_id,
                    title: reportData.triviaDetails.head,
                    note: reportData.note,
                    status: 0,
                    nutr_id: reportData.nutr_id,
                    reminderDate: null,  
                };
                
                await axios.post("https://gouthiw-web-dev-it26.onrender.com/report/trivia/notification", notiData);

                await axios.put(`https://gouthiw-web-dev-it26.onrender.com/report/notifications/${notiId}/read`, { isRead: true, role: "admin" });
            }

            if (!reportData || !reportData._id) {
                alert("ข้อมูลรายงานไม่ถูกต้องหรือไม่พบ ID");
                return;
            }
            

            if (responseDetail.status === 200) {
                navigate("/admin/report-trivia-detail", { state: { reportData } });
            }
        } catch (error) {
            console.error("Error fetching report data:", error.message);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }
    };

    const handleItemPress = async (reportId, notiId) => {
        try {
            const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/report-detail/trivia/${reportId}`);
            const reportData = response.data;

            await axios.put(`https://gouthiw-web-dev-it26.onrender.com/report/notifications/${notiId}/read`, { isRead: true, role: "reporter" });

            if (!reportData || !reportData._id) {
                alert("ข้อมูลรายงานไม่ถูกต้องหรือไม่พบ ID");
                return;
            }

            if (response.status === 200) {
                navigate("/report-history/detail", { state: { reportData } });
            }
        } catch (error) {
            console.error("Error fetching report data:", error.message);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }
    };

    const handleItemPressTrivia = async (trivId, notiId) => {
        try {
            const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/trivia/${trivId}`);
            const triviaData = response.data;

            await axios.put(`https://gouthiw-web-dev-it26.onrender.com/report/notifications/${notiId}/read`, { isRead: true, role: "reported" });

            if (!triviaData || !triviaData._id) {
                alert("ข้อมูลรายงานไม่ถูกต้องหรือไม่พบ ID");
                return;
            }

            if (response.status === 200) {
                navigate("/trivia-detail", { state: { triviaData } });
            }
        } catch (error) {
            console.error("Error fetching report data:", error.message);
            alert("เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน");
        }
    };

    const timeTHFormat = {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    };
      
    if (loading) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const calculateTimeAgo = (createdAt) => {
        const currentTime = new Date();
        const postTime = new Date(createdAt);
        const timeDiff = Math.abs(currentTime - postTime) / 36e5;  // คำนวณต่างเป็นชั่วโมง
        
        if (timeDiff < 1) {
            return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
        } else if (timeDiff < 24) {
            return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
        } else {
            return postTime.toLocaleString("th-TH", timeTHFormat);
        }
   };
      
    return (
        <div>
            <ul>
                {notifications.length === 0 && <p className='no-notification'>ไม่มีการแจ้งเตือน</p>}
                {latestNotifications.map((notification) => (
                    <div>
                        {notification.role === "reporter" && (
                            <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                                <div className='notification-status' onClick={() => handleItemPress(notification.report_id, notification._id)}>
                                    <p className='notification-content'>
                                        <span className='notification-message'>{notification.message}:</span> 
                                        {
                                            notification.status_report === 0 ? 'รอการตรวจสอบ' : 
                                            notification.status_report === 1 ? 'แจ้งแก้ไขไปที่เจ้าของเกร็ดความรู้' : 
                                            notification.status_report === 2 ? 'ถูกปฏิเสธ' : 'เกร็ดความรู้ของคุณถูกลบโดยผู้ดูแลระบบ'
                                        }
                                    </p>
                                    <p className='notification-date'>{calculateTimeAgo(notification.createdAt)}</p>
                                </div>
                            </li>
                        )}

                        {notification.role === "reported" && (
                            <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                                <div className='notification-status' onClick={() => handleItemPressTrivia(notification.triv_id, notification._id)}>
                                    <p className='notification-content'>
                                        <span className='notification-message'>{notification.message}</span>: 
                                        {
                                            notification.status_report === 1 ? 'คุณถูกแจ้งให้แก้ไขเนื้อหาเกร็ดความรู้' : 'เกร็ดความรู้ของคุณถูกลบโดยผู้ดูแลระบบ'
                                        }
                                    </p>
                                    <p className='notification-date'>{calculateTimeAgo(notification.createdAt)}</p>
                                </div>
                            </li>
                        )}

                        {/* น่าจะเรียบร้อยละ */}
                        {notification.role === "admin" && (
                            <li key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                                <div className='notification-status' onClick={() => adminItemPress(notification.report_id, notification._id)}>
                                    <p className='notification-content'>
                                        <span className='notification-message'>{notification.message}</span>: 
                                            {/* {
                                                notification.status_report === 0 ? 'คุณถูกแจ้งให้แก้ไขเนื้อหาเกร็ดความรู้' : 
                                                notification.status_report === 2 ? 'ไม่พบการละเมิด' : 'หี'
                                            } */}
                                    </p>
                                    <p className='notification-date'>{calculateTimeAgo(notification.createdAt)}</p>
                                </div>
                            </li>
                        )}
                    </div>
                    
                ))}
            </ul>
            {/* <div className='see-all-noti'>
                <p>ดูแจ้งเตือนทั้งหมด</p>
            </div> */}
        </div>
    );
};
      
export default NotiContainer;