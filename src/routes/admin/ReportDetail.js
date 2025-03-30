import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import "../../App.css";
import "../../components/report.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReadMore from "../../components/Readmore";
import axios from "axios";

const optionsDMY = {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "long",
    day: "numeric",
};

const calculateTimeAgo = (createdAt) => {
    const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const postTime = new Date(createdAt).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
    const timeDiff = Math.abs(currentTime - postTime) / 36e5;

    if (timeDiff < 1) {
        return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
    } else if (timeDiff < 24) {
        return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
    } else {
        return postTime.toLocaleString("th-TH", optionsDMY);
    }
};

const calculateTimeRemaining = (reminderDate) => {
    const currentTime = new Date();
    const targetTime = new Date(reminderDate);
    const timeDiff = targetTime - currentTime; // หาจำนวนมิลลิวินาทีที่เหลือ

    if (timeDiff <= 0) {
        return "ถึงกำหนดแล้ว";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `เหลืออีก ${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
    } else {
        return `เหลืออีก ${hours} ชั่วโมง ${minutes} นาที`;
    }
};


function ReportDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const [setReports] = useState([]);
    const [reportData, setReportData] = useState(location.state?.reportData || null);
    const [status, setStatus] = useState(reportData?.status || 0);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
            return;
        }

        if (!reportData) {
            const fetchReport = async () => {
                try {
                    const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/report/trivias");
                    const foundReport = response.data.find(r => r._id === location.state?.reportId) || null;
                    setReportData(foundReport);
                } catch (error) {
                    console.error("Error fetching report:", error);
                }
            };
            fetchReport();
        }
    }, [reportData, location.state?.reportId, status, navigate]);

    const timeNow = new Date();
    const timeOneDay = new Date(timeNow);
    timeOneDay.setHours(timeOneDay.getHours() + 24);

    // แปลงเวลาให้เป็นโซน Asia/Bangkok และแสดงผลในรูปแบบที่อ่านง่าย
    const deadline = new Intl.DateTimeFormat("th-TH", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(timeOneDay);


    const statusMap = {
        0: "รอตรวจสอบ",
        1: "กำลังรอการแก้ไข",
        2: "การรายงานถูกปฏิเสธ",
        3: "ลบออกจากระบบ"
    };

    const getStatusText = (status) => statusMap[status];

    const getStatusColor = (status) => {
        const numericStatus = Number(status);
        switch (numericStatus) {
            case 1:
                return "lightblue";
            case 2:
                return "pink";
            case 3:
                return "red";
            default:
                return "grey";
        }
    };

    const handleStatusChange = (newStatusNumber) => {
        if (Number(newStatusNumber) === status) return;
        setStatus(Number(newStatusNumber));
    };

    const updateStatus = async () => {
        try {
            const reminderDateObj = timeOneDay.toISOString();

            if (status === 0) {
                return;
            } else if (status === 3) {
                handleItemDelete(reportData._id)
            } else {
                const confirm = window.confirm( 
                    status === 1 ? `คุณต้องการแจ้งให้นักโภชนาการแก้ไขรายการนี้ภายใน ${deadline} ใช่หรือไม่?` :
                    status === 2 ? "คุณต้องการปฏิเสธรายการนี้ใช่หรือไม่?" : "คุณต้องการลบเกร็ดความรู้นี้ใช่หรือไม่?");
                if (!confirm) return;

                const updateStatus = {
                    triv_id: reportData.triv_id,
                    status: status,
                    reminderDate: status === 1 ? reminderDateObj : null,  
                };
                
                const response = await axios.put(
                    `https://gouthiw-web-dev-it26.onrender.com/report/${reportData._id}/trivia/status`,
                    updateStatus
                );

                if (response.status === 200) {
                    alert("อัพเดตสถานะสำเร็จ!");
                    handleNotification()
                }
            }
        } catch (error) {
            alert("อัพเดตสถานะไม่สำเร็จ");
        }
    };

    const handleNotification = async () => {
        try {
            const reminderDateObj = timeOneDay.toISOString();

            const notiData = {
                report_id: reportData._id,
                triv_id: reportData.triv_id,
                title: reportData.triviaDetails.head,
                note: reportData.note,
                status: status,
                nutr_id: reportData.nutr_id,
                reminderDate: status === 1 ? reminderDateObj : null
            };

            const response = await axios.post("https://gouthiw-web-dev-it26.onrender.com/report/trivia/notification", notiData);
            
            if (response.status === 200) {
                alert("ส่งแจ้งเตือนสําเร็จ!");
                navigate("/admin/report");
            }        
        } catch (error) {
            alert("ส่งแจ้งเตือนไม่สําเร็จ");
        }
    };

    const handleItemDelete = async (reportId) => {
        const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
        if (!confirmDelete) return;

        try {
        const response = await axios.delete(`https://gouthiw-web-dev-it26.onrender.com/report-detail/${reportId}`);
        if (response.status === 200) {
            alert("ลบสำเร็จ");
            const updatedResponse = await axios.get("https://gouthiw-web-dev-it26.onrender.com/report/trivias" , reportData);
            setReports(updatedResponse.data);
            navigate("/admin/report");
        }
        } catch (error) {
        alert("เกิดข้อผิดพลาดในการลบ");
        }
    };

    return (
        <div className="container">
            <Navbar />
            <div className="sidebar-content-wrapper">
                <SideBar />
                <div className="content-rp">
                    <div className="report-render">
                        <button className="btn-goback" onClick={() => navigate(-1)}>
                            <i className="fa-solid fa-angle-left"></i>
                        </button>
                        <div className="report-card">
                            <div className="report-info">
                                <div className="report-header">
                                    <h3>[รายงาน] เกร็ดความรู้ | {reportData.triviaDetails.head}</h3>
                                    <div
                                        className="status-bar"
                                        style={{ backgroundColor: getStatusColor(status) }}
                                    >
                                        {reportData.reminderDate ? (
                                            <p className="status-text">
                                                {calculateTimeRemaining(reportData.reminderDate)}
                                            </p>
                                        ) : (
                                            <p className="status-text">{getStatusText(status)}</p>
                                        )}
                                        
                                    </div>
                                </div>
                                <hr className="hr-line-100" />
                                <div className="report-flex">
                                    <div className="report-details">
                                        <img
                                        loading="lazy"
                                            src={reportData.nutrDetails.image_profile}
                                            alt={`${reportData.nutrDetails.firstname} ${reportData.nutrDetails.lastname}`}
                                            />
                                        <div className="report-info">
                                            <p>
                                                {reportData.nutrDetails.firstname} {reportData.nutrDetails.lastname}
                                            </p>
                                            <p>{reportData.nutrDetails.email}</p>
                                        </div>
                                    </div>
                                    <p className="report-date">
                                        {calculateTimeAgo(reportData.createdAt)}
                                    </p>
                                </div>

                                <div className="report-details">
                                    <div className="rp-dt">
                                        <b>เกร็ดความรู้ที่ถูกรายงาน: </b>
                                        <div className="tv-rp">
                                            <h4>{reportData.triviaDetails.head}</h4>
                                            <hr className="hr-line-100" />
                                            <div className="img-rp">
                                                <img
                                                loading="lazy"
                                                    className="img-tv"
                                                    src={reportData.triviaDetails.image}
                                                    alt={reportData.triviaDetails.head}
                                                    />
                                            </div>
                                            <ReadMore
                                                text={reportData.triviaDetails.content}
                                                dangerouslySetInnerHTML={{
                                                __html: reportData.triviaDetails.content,
                                                }}
                                            />
                                        </div>

                                        <div className="ps">
                                            <p>หมายเหตุ: </p>
                                            <div className="tv-rp">
                                                <p>{reportData.note || "ไม่มีรายละเอียด"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    <div className="status-update">
                                        <label htmlFor="status">สถานะ: </label>
                                        <select
                                            id="status"
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            value={status}
                                            >
                                            <option value={0} disabled hidden>รอตรวจสอบ</option>
                                            <option value={1}>แจ้งแก้ไข</option>
                                            <option value={2}>ปฏิเสธรายงาน</option>
                                            <option value={3}>ลบออกจากระบบ</option>
                                        </select>
                                    </div>
                                    <button
                                        className="btn-delete"
                                        onClick={() => updateStatus()}
                                    >
                                        เปลี่ยนสถานะ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportDetail;
