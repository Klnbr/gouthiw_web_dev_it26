import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import axios from 'axios';
import { useAuth } from '../../middleware/Auth';
import { useNavigate } from 'react-router-dom';
import '../../App.css'
import "../../components/report.css";
import { Select } from "antd";

const optionsDMY = {
     timeZone: "Asia/Bangkok",
     year: 'numeric',
     month: 'long',
     day: 'numeric',
};

function ReportHistory() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();

     const [reports, setReports] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const [itemsPerPage] = useState(5);
     const [setType] = useState(null);

     const [setSearchreport] = useState('');
     const [selectedType, setSelectedType] = useState("ทั้งหมด");
    
     const statusMap = {
          0: "รอตรวจสอบ",
          1: "กำลังรอการแก้ไข",
          2: "การรายงานถูกปฏิเสธ",
          3: "ลบออกจากระบบ"
     };

     const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการรอตรวจสอบ";

     useEffect(() => {
          const token = localStorage.getItem("authToken");
          if (!token) {
              navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
              return;
          }
          const fetchReportData = async () => {
               try {
                    const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/reports/${nutrData._id}`, { timeout: 1000 });
                    setReports(response.data);
                    if (response.data.triv_id) {
                         setType("trivia");
                    }

                    else if (response.data.topic_id) {
                         setType("topic");
                    }
               } catch (error) {
                    console.log("Error fetching report data", error.message)
               }
          }
          fetchReportData();
     }, [nutrData,navigate]);

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/report-detail/trivia/${itemId}`);
               const reportData = response.data;
               navigate('/report-history/detail', { state: { reportData } });
          } catch (error) {
               console.log('Error fetching report data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='report-card-admin' onClick={() => handleItemPress(item._id)} key={item._id}>
               <div className='report-trivia-info'>
                    <div className="report-info-1">
                         <i className="fa-solid fa-book report-info-icon"></i>
                    </div>

                    <div className="report-info-2">
                         <p className="report-info-2-head">
                              [รายงาน] เกร็ดความรู้ | หัวข้อ: {item.triviaDetails.head}
                         </p>
                         <p>
                              ผู้รายงาน: {item.nutrDetails.firstname} {item.nutrDetails.lastname}
                         </p>
                         {item.note && (
                              <p className="report-info-2-time">
                                   รายงานเมื่อ {calculateTimeAgo(item.createdAt)}
                              </p>
                         )}
                    </div>

                    <div className="report-info-3">
                        <p>
                              <span style={{ 
                                        color: "white", 
                                        backgroundColor: item.status === 1 ? "#FFC107" : item.status === 2 ? "#DC3545" : item.status === 3 ? "#28A745" :  "grey",
                                        padding: "0.3rem 0.8rem",
                                        marginLeft: "0.5rem", 
                                        borderRadius: "0.5rem"
                                   }}>{getStatusText(item.status)}
                              </span>
                         </p>
                    </div>
               </div>
          </div>
     );

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

     // Logic for pagination
     const indexOfLastReport = currentPage * itemsPerPage;
     const indexOfFirstReport = indexOfLastReport - itemsPerPage;
     const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

     const pageNumbers = [];
     for (let i = 1; i <= Math.ceil(reports.length / itemsPerPage); i++) {
          pageNumbers.push(i);
     }

     const handlePageChange = (pageNumber) => {
          setCurrentPage(pageNumber);
     };

     return (
          <div className='container'>
               <Navbar />
               <div className='sidebar-content-wrapper'>
                    <SideBar />
                    <div className='content'>
                         <div className='main-content'>
                              <div className='report-content'>
                                   <div className='display-flex'>
                                        <p className='breadcumb'>
                                             <span className='press-to-back'>หน้าหลัก</span>
                                             <span className='gray-color'> &#62;</span> ประวัติการรายงาน
                                        </p>
                                        <div className='divider' />
                                   </div>

                                   <h1 className='head-content'>ประวัติการรายงาน</h1>
                                        {/* Search and filter controls */}
                                   <div className='report-manage'>
                                        <div className='report-search'>
                                             <div className='report-search-wrapper'>
                                                  <i className="fa-solid fa-magnifying-glass report-search-icon"></i>
                                                  <input
                                                       type='text'
                                                       placeholder='ค้นหาการรายงานที่นี่'
                                                       onChange={(e) => setSearchreport(e.target.value)}
                                                       className='report-search-input' />
                                             </div>

                                             <div className='report-select-wrapper'>
                                                  <i className="fa-solid fa-filter report-search-icon"></i>
                                                  <Select
                                                       className='report-search-select'
                                                       value={selectedType}
                                                       onChange={(value) => setSelectedType(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                                       options={[
                                                            { value: 0, label: "ทั้งหมด" },
                                                            { value: 1, label: "รอตรวจสอบ" },
                                                            { value: 2, label: "รอการแก้ไข" },
                                                            { value: 3, label: "ดำเนินการเสร็จสิ้น" }
                                                       ]}
                                                  />
                                             </div>
                                        </div>
                                   </div>
                              </div>
                                   
                                   {/* Table section */}
                              <div className='above-table'>
                                        <p>รวมทั้งหมด {reports.length} การรายงาน</p>
                              </div>

                              <div className='report-render'>
                                   {currentReports.length > 0 ? (
                                        currentReports.map(item => renderItem(item))
                                   ) : (
                                        <h2>ยังไม่มีประวัติการรายงาน</h2>
                                   )}

                                   {/* Pagination Controls */}
                                   <div className="pagination">
                                        {/* Previous Button */}
                                        <button 
                                             onClick={() => handlePageChange(currentPage - 1)} 
                                             disabled={currentPage === 1}
                                             className="pagination-button"
                                        >
                                             ย้อนกลับ
                                        </button>

                                        {/* Page Numbers */}
                                        {pageNumbers.map(number => (
                                             <button
                                                  key={number}
                                                  onClick={() => handlePageChange(number)}
                                                  className={`pagination-button ${currentPage === number ? "active" : ""}`}
                                             >
                                                  {number}
                                             </button>
                                        ))}

                                        {/* Next Button */}
                                        <button 
                                             onClick={() => handlePageChange(currentPage + 1)} 
                                             disabled={currentPage === pageNumbers.length}
                                             className="pagination-button"
                                        >
                                             ถัดไป
                                        </button>
                                   </div>
                              </div>  
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default ReportHistory;
