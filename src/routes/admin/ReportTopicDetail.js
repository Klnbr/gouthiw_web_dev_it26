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
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const timeDiff = Math.abs(currentTime - postTime) / 36e5; // คำนวณต่างเป็นชั่วโมง
  
    if (timeDiff < 1) {
      return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
    } else if (timeDiff < 24) {
      return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
    } else {
      return postTime.toLocaleString("th-TH", optionsDMY);
    }
  };

function ReportTopicDetail() {
 const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const { reportData } = location.state || {}; // ดึงค่าจาก state
  const [status, setStatus] = useState(reportData?.status || 0);
  const [reportstopic, setReportstopic] = useState([]);
  const [reportsTopic, setReportsTopic] = useState([]);

  const statusMap = {
    0: "อยู่ระหว่างการตรวจสอบ",
    1: "ดำเนินการเรียบร้อย",
    2: "ปฏิเสธรายงาน",
  };

  const getStatusColor = (status) => {
    const numericStatus = Number(status); // แปลงเป็นตัวเลข
    switch (numericStatus) {
      case 1:
        return "#28a745"; // เขียว
      case 0:
        return "#ffc107"; // เหลือง
      case 2:
        return "#dc3545"; // แดง
      default:
        return "#6c757d"; // เทา
    }
  };

  const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการตรวจสอบ";
  
  const handleStatusChange = (newStatusNumber) => {
    if (Number(newStatusNumber) === status) return;
  
    // การยืนยันก่อนเปลี่ยนสถานะ
    const confirmChange = window.confirm("คุณต้องการเปลี่ยนสถานะใช่หรือไม่?");
    if (confirmChange) {
      setStatus(Number(newStatusNumber));  // เปลี่ยนสถานะใน UI
      updateStatus(Number(newStatusNumber));  // อัพเดตสถานะในฐานข้อมูล
    } else {
      // ถ้าไม่ยืนยันให้กลับไปสถานะเดิม
      setStatus(status); 
    }
  };
  

  const updateStatus = async (newStatus) => {
    try {
      const updatedReportData = {
        ...reportData,
        status: newStatus,
        isDeleted: false,
      };
      const response = await axios.put(
        `http://localhost:5500/report/${reportData._id}/status`,
        updatedReportData
      );
      if (response.status === 200) {
        alert("อัพเดตสถานะสำเร็จ!");
      }
    } catch (error) {
      alert("อัพเดตสถานะไม่สำเร็จ");
    }
  };

  const handleItemDelete = async (reportId) => {
    const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5500/report-detail/${reportId}`);
      if (response.status === 200) {
        alert("ลบสำเร็จ");
        const updatedResponse = await axios.get("http://localhost:5500/report/topics" , reportData);
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
                  <h3>[รายงาน] กระทู้ | {reportData.topicDetails.title}</h3>
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
                      src={reportData.userDetails.image_profile}
                      alt={`${reportData.userDetails.firstname} ${reportData.userDetails.lastname}`}
                    />
                    <div className="report-info">
                      <p>
                        {reportData.userDetails.name}
                      </p>
                      <p>{reportData.userDetails.email}</p>
                    </div>
                  </div>
                  <p className="report-date">
                    {calculateTimeAgo(reportData.createdAt)}
                  </p>
                </div>

                <div className="report-details">
                  <div className="rp-dt">
                    <b>กระทู้ที่ถูกรายงาน: </b>
                    <div className="tv-rp">
                      <h4>{reportData.topicDetails.title}</h4>
                      <hr className="hr-line-90" />
                      <div className="img-rp">
                        <img
                        loading="lazy"
                          className="img-tv"
                          src={reportData.topicDetails.image}
                          alt={reportData.topicDetails.head}
                        />
                      </div>
                      <ReadMore
                        text={reportData.topicDetails.content}
                        dangerouslySetInnerHTML={{
                          __html: reportData.topicDetails.content,
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
                <div className="action-buttons">
                  <div className="status-update">
                    <label htmlFor="status">สถานะ:</label>
                    <select
                      id="status"
                      onChange={(e) => handleStatusChange(e.target.value)}
                      value={status}
                    >
                      <option value={0}>อยู่ระหว่างการตรวจสอบ</option>
                      <option value={1}>ดำเนินการเรียบร้อย</option>
                      <option value={2}>ปฏิเสธรายงาน</option>
                    </select>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleItemDelete(reportData._id)}
                  >
                    ลบกระทู้
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
export default  ReportTopicDetail;

