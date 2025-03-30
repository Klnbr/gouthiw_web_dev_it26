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

function ReportDetailNutr() {
    const navigate = useNavigate();
    const location = useLocation();
    const [setReports] = useState([]);
    const [reportData, setReportData] = useState(location.state?.reportData || null);
    const [status, setStatus] = useState(reportData?.status || 0);

    // โหลดข้อมูลใหม่ถ้า reportData หายไป
    useEffect(() => {
        if (!reportData) {
        const fetchReport = async () => {
            try {
            const response = await axios.get("https://gouthiw-health.onrender.com/report/trivias");
            const foundReport = response.data.find(r => r._id === location.state?.reportId) || null;
            setReportData(foundReport);
            } catch (error) {
            console.error("Error fetching report:", error);
            }
        };
        fetchReport();
        }
    }, [reportData, location.state?.reportId]);


    const statusMap = {
        0: "รอตรวจสอบ",
        1: "กำลังรอการแก้ไข",
        2: "การรายงานถูกปฏิเสธ",
        3: "ลบออกจากระบบ"
    };

    const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการตรวจสอบ";

    const getStatusColor = (status) => {
        const numericStatus = Number(status);
        switch (numericStatus) {
            case 0:
                return "grey";
            case 1:
                return "lightblue";
            case 2:
                return "pink";
            case 3:
                return "red";
            default:
                return "#dc3545";
        }
    };

    // const handleStatusChange = (newStatusNumber) => {
    //     if (Number(newStatusNumber) === status) return;
    
    //     // การยืนยันก่อนเปลี่ยนสถานะ
    //     const confirmChange = window.confirm("คุณต้องการเปลี่ยนสถานะใช่หรือไม่?");
    //     if (confirmChange) {
    //     setStatus(Number(newStatusNumber));  // เปลี่ยนสถานะใน UI
    //     updateStatus(Number(newStatusNumber));  // อัพเดตสถานะในฐานข้อมูล
    //     } else {
    //     // ถ้าไม่ยืนยันให้กลับไปสถานะเดิม
    //     setStatus(status); 
    //     }
    // };
    

    const updateStatus = async (newStatus) => {
        try {
        const updatedReportData = {
            ...reportData,
            status: newStatus,
            isDeleted: false,
        };
        const response = await axios.put(
            `https://gouthiw-health.onrender.com/report/${reportData._id}/status`,
            updatedReportData
        );
        if (response.status === 200) {
            alert("อัพเดตสถานะสำเร็จ!");
        }
        } catch (error) {
        alert("อัพเดตสถานะไม่สำเร็จ");
        }
    };

    // const handleItemDelete = async (reportId) => {
    //     const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
    //     if (!confirmDelete) return;

    //     try {
    //     const response = await axios.delete(`https://gouthiw-health.onrender.com/report-detail/${reportId}`);
    //     if (response.status === 200) {
    //         alert("ลบสำเร็จ");
    //         const updatedResponse = await axios.get("https://gouthiw-health.onrender.com/report/trivias" , reportData);
    //         setReports(updatedResponse.data);
    //         navigate("/admin/report");
    //     }
    //     } catch (error) {
    //     alert("เกิดข้อผิดพลาดในการลบ");
    //     }
    // };

    return (
        <div className="container">
        <Navbar />
        <div className="sidebar-content-wrapper">
            <SideBar />
            <div className="content-rp">
               <button className="btn-goback" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-angle-left"></i>
                </button> 
            <div className="report-render">
                <div className="report-card">
                <div className="report-info">
                    <div className="report-header">
                    <h3>[รายงาน] เกร็ดความรู้ | {reportData.triviaDetails.head}</h3>
                    <div
                        className="status-bar"
                        style={{ backgroundColor: getStatusColor(status) }}
                    >
                        <p className="status-text">{getStatusText(status)}</p>
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
                        <hr className="hr-line" />
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
                        <div className="rp-note">
                            <p>{reportData.note || "ไม่มีรายละเอียด"}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default ReportDetailNutr;
