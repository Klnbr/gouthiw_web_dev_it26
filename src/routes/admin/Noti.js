import React, { useEffect, useState } from 'react';
import '../../components/ingr.css';
import '../../components/Modal.css';
import Navbar from '../../components/Navbar/Navbar';
import SideBar from '../../components/SideBar/SideBar';
import axios from 'axios';
import { useAuth } from '../../middleware/Auth';
import { useNavigate } from 'react-router-dom';

export default function Noti() {
    const navigate = useNavigate();
    const { nutrData } = useAuth();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
            return;
        }
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/report/notifications");
                console.log("Notifications from API:", response.data);
                setNotifications(response.data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [navigate]);

    const handleItemPress = async (itemId, type) => {
        try {
            const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/report-detail/${type}/${itemId}`);
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


    const renderItem = (item) => {
        const type = item.triv_id ? "trivia" : item.topic_id ? "topic" : null;
        if (!type) return null;

        return (
            <div
                className="report-card-admin"
                onClick={() => handleItemPress(item._id, type)}
                key={item._id}
            >
                <div className="trivia-info">
                    <div className="trivia-header">
                        <h1>
                            {type === "trivia" ? `[เกร็ดความรู้] ${item.triv_id.head}` : `[กระทู้] ${item.topic_id.title}`}
                        </h1>
                    </div>
                    <p className="trivia-date">รายงานเมื่อ {new Date(item.createdAt).toLocaleString()}</p>
                    {item.note && (
                        <div className="trivia-des">
                            <p>{item.note}</p>
                        </div>
                    )}
                    <div className="detail-rp">
                        <p>
                        ผู้รายงาน: {item.nutrDetails?.firstname && item.nutrDetails?.lastname
                            ? `${item.nutrDetails.firstname} ${item.nutrDetails.lastname}`
                            : item.userDetails?.name || "ไม่ระบุ"}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
        <div className='container'>
            <Navbar />
            <div className='sidebar-content-wrapper'>
            <SideBar />
            <div className='content'>
                <div className='main-content'>
                <h2>การแจ้งเตือนทั้งหมด</h2>
                <div className="report-render">
                    {notifications.length > 0 ? (
                    notifications.map((item) => renderItem(item))
                    ) : (
                    <h2>ยังไม่มีการแจ้งเตือน</h2>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}
