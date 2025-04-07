import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import "../../App.css";
import "../../components/report.css";
import { useLocation, useNavigate } from "react-router-dom";
import ReadMore from "../../components/Readmore";
import axios from "axios";
import apiAddress from "../IP";

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
  const [ setReports] = useState([]);
  const { reportData } = location.state || {}; // ดึงค่าจาก state
  const [status, setStatus] = useState(reportData?.status || 0);

  console.log("reportData:", reportData);

  const statusMap = {
    0: "รอตรวจสอบ",
    1: "ลบออกจากระบบ",
    2: "ปฏิเสธรายงาน",
  };

  const getStatusColor = (status) => {
    const numericStatus = Number(status); // แปลงเป็นตัวเลข
    switch (numericStatus) {
      case 0:
        return "#6c757d"; // เขียว
      case 1:
        return "#dc3545"; // เหลือง
      case 2:
        return "#ffc107"; // แดง
      default:
        return "#6c757d"; // เทา
    }
  };

  const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการตรวจสอบ";
  
  const handleStatusChange = (newStatusNumber) => {
    if (Number(newStatusNumber) === status) return;
    setStatus(Number(newStatusNumber));
  };

  const updateStatus = async () => {
    try {
      if (status === 0) {
        return;
      } else if (status === 1) {
        handleItemDelete(reportData._id)
      } else if (status === 2) {
        const confirm = window.confirm("คุณต้องการปฏิเสธรายการนี้ใช่หรือไม่?");
        if (!confirm) return;

        const updateStatus = {
          topic_id: reportData.topic_id,
          status: status
        };

        const response = await axios.put(
          `${apiAddress}/report/${reportData._id}/topic/status`,
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
              const notiData = {
                  report_id: reportData._id,
                  topic_id: reportData.topic_id,
                  title: reportData.topicDetails.title,
                  note: reportData.note,
                  status: status,
                  user_id: reportData.user_id
              };

              console.log("notiData:", notiData);
  
              const response = await axios.post(`${apiAddress}/report/topic/notification`, notiData);
              
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
      const response = await axios.delete(`${apiAddress}/report-detail/${reportId}`);
      if (response.status === 200) {
        alert("ลบสำเร็จ");
        const updatedResponse = await axios.get(`${apiAddress}/report/topics` , reportData);
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
                      <option value={0} disabled hidden>รอตรวจสอบ</option>
                      <option value={1}>ลบออกจากระบบ</option>
                      <option value={2}>ปฏิเสธรายงาน</option>
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
export default  ReportTopicDetail;

