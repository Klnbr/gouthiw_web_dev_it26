import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import "../../App.css";
import "../../components/report.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReadMore from "../../components/Readmore";
import axios from "axios";

const optionsDMY = {
  timeZone: "Asia/Bangkok", // แก้ไข timezone
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

function ReportDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reports, setReports] = useState([])
  const { reportData } = location.state || {}; // ดึงค่าจาก state
  const [status, setStatus] = useState(reportData.status || 0);

  const statusMap = {
    0: "อยู่ระหว่างการตรวจสอบ",
    1: "ดำเนินการเรียบร้อย",
    2: "ปฏิเสธรายงาน",
  };

  const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการตรวจสอบ";

  const getStatusColor = (status) => {
    const numericStatus = Number(status); // แปลงเป็นตัวเลข
    console.log("Status received:", numericStatus); // ตรวจสอบค่า
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

  const handleStatusChange = (newStatusNumber) => {
    if (Number(newStatusNumber) === status) return; // ตรวจสอบหากสถานะยังคงเดิม
    setStatus(Number(newStatusNumber)); // อัปเดตสถานะใน state
    updateStatus(Number(newStatusNumber)); // อัปเดตสถานะในฐานข้อมูล
  };

  const updateStatus = async (newStatus) => {
    try {
      const updatedReportData = {
        ...reportData,
        status: newStatus,
        isDeleted: false,
      };
      console.log("Updated Report Data:", updatedReportData);
      const response = await axios.put(
        `http://localhost:5500/reports/${reportData._id}/status`, // ใช้ `_id` ของรายงานที่กำลังแก้ไข
        updatedReportData
      );

      if (response.status === 200) {
        alert("อัพเดตสถานะสำเร็จ!");
        console.log("Response from server:", response.data);
      }
    } catch (error) {
      alert("อัพเดตสถานะไม่สำเร็จ");
      console.error("Error updating report:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  const handleItemDelete = async (reportId) => {
    const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
    if (!confirmDelete) {
      return; // ถ้าไม่ยืนยัน จะไม่ทำการลบ
    }

    try {
      const response = await axios.delete(`http://localhost:5500/report-detail/${reportId}`);

      if (response.status === 200) {
        alert("ลบสำเร็จ");
      
        const response = await axios.get("http://localhost:5500/reports", { timeout: 10000 });
        setReports(response.data);
        navigate('/admin/report-detail', { state: { reportData } });
      }
    } catch (error) {
      console.log('Error deleting report', error);
    }
  };

  return (
    <>
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
                      <p className="status-text">{getStatusText(status)}</p>
                    </div>

                  </div>
                  <hr className="hr-line-100" />
                  <div className="report-flex">
                    <div className="report-details">
                      <img
                        src={reportData.nutrDetails.image_profile}
                        alt={`${reportData.nutrDetails.firstname} ${reportData.nutrDetails.lastname}`}
                      />
                      <div className="report-info">
                        <p>
                          {reportData.nutrDetails.firstname}{" "}
                          {reportData.nutrDetails.lastname}
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
                        <hr className="hr-line-90" />
                        <div className="img-rp">
                          <img className="img-tv"
                            src={reportData.triviaDetails.image}
                            alt={reportData.triviaDetails.head}
                          />
                        </div>

                        <ReadMore text={reportData.triviaDetails.content}
                          dangerouslySetInnerHTML={{ __html: reportData.triviaDetails.content }} />

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
                      onClick={() => handleItemDelete(reportData._id)} // Correctly passing reportData._id
                    >
                      ลบเกร็ดความรู้
                    </button>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportDetail;
