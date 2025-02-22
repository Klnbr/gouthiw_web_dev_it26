import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "../../components/ingr.css";

const optionsDMY = {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "long",
  day: "numeric",
};

function ReportManage() {
  const navigate = useNavigate();
  const [reportsTrivia, setReportsTrivia] = useState([]);
  const [reportsTopic, setReportsTopic] = useState([]);
  const [activeButton, setActiveButton] = useState("เกร็ดความรู้");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusMap = {
    0: "อยู่ระหว่างการตรวจสอบ",
    1: "ดำเนินการเรียบร้อย",
    2: "ปฏิเสธรายงาน",
  };

  const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการตรวจสอบ";

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

  useEffect(() => {
    const fetchReportsTrivia = async () => {
      try {
        const response = await axios.get("http://localhost:5500/report/trivias");
        if (Array.isArray(response.data)) setReportsTrivia(response.data);
      } catch (error) {
        console.error("Error fetching trivia reports:", error);
      }
    };

    const fetchReportsTopic = async () => {
      try {
        const response = await axios.get("http://localhost:5500/report/topics");
        if (Array.isArray(response.data)) setReportsTopic(response.data);
      } catch (error) {
        console.error("Error fetching topic reports:", error);
      }
    };

    fetchReportsTrivia();
    fetchReportsTopic();
  }, []);

  const renderItem = (item) => {
    const type = item.triviaDetails ? "trivia" : "topic";
    if (!type) return null;

    return (
      <div
        className="report-card-admin"
        onClick={() => {
          console.log("Clicked item ID:", item._id);
          handleItemPress(item._id, type);
        }}
        key={item._id}
      >
        <div className="trivia-info">
          <div className="trivia-header">
            <h1>{type === "trivia" ? item.triviaDetails.head : item.topicDetails.title}</h1>
          </div>
          <p className="trivia-date">รายงานเมื่อ {calculateTimeAgo(item.createdAt)}</p>
          {item.note && (
            <div className="trivia-des">
              <p>{item.note}</p>
            </div>
          )}
          <div className="detail-rp">
            <p>
              ผู้รายงาน:{" "}
              {type === "trivia"
                ? `${item.nutrDetails.firstname} ${item.nutrDetails.lastname}`
                : item.userDetails.name}
            </p>
            <p>สถานะการรายงาน: {getStatusText(item.status)}</p>
          </div>
        </div>
      </div>
    );
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

  const filteredReports =
    activeButton === "เกร็ดความรู้" ? reportsTrivia : reportsTopic;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <Navbar />
      <div className="sidebar-content-wrapper">
        <SideBar />
        <div className="content">
          <div className="above-table">
            <p>รวมทั้งหมด {filteredReports.length} การรายงาน</p>
            <div className="switch-btn">
              <button
                className={activeButton === "เกร็ดความรู้" ? "active" : ""}
                onClick={() => setActiveButton("เกร็ดความรู้")}
                style={{
                  backgroundColor: activeButton === "เกร็ดความรู้" ? "#FFA13F" : "white",
                  color: activeButton === "เกร็ดความรู้" ? "white" : "black",
                }}
              >
                เกร็ดความรู้
              </button>
              <button
                className={activeButton === "กระทู้" ? "active" : ""}
                onClick={() => setActiveButton("กระทู้")}
                style={{
                  backgroundColor: activeButton === "กระทู้" ? "#FFA13F" : "white",
                  color: activeButton === "กระทู้" ? "white" : "black",
                }}
              >
                กระทู้
              </button>
            </div>
          </div>

          <div className="report-render">
            {currentItems.length > 0 ? (
              currentItems.map((item) => renderItem(item))
            ) : (
              <h2>
                {activeButton === "เกร็ดความรู้"
                  ? "ยังไม่มีการรายงานในหมวดเกร็ดความรู้"
                  : "ยังไม่มีการรายงานในหมวดกระทู้"}
              </h2>
            )}

              {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              ย้อนกลับ
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={`pagination-button ${
                  currentPage === number + 1 ? "active" : ""
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              ถัดไป
            </button>
          </div>
          
          </div>

        </div>
      </div>
    </div>
  );
}

export default ReportManage;
