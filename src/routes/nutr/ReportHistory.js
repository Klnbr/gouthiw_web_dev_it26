import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import axios from 'axios';
import { useAuth } from '../../middleware/Auth';
import { useNavigate } from 'react-router-dom';
import '../../App.css'

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
     const [itemsPerPage] = useState(5); // Adjust based on how many items you want per page

     const statusMap = {
          0: "อยู่ระหว่างการตรวจสอบ",
          1: "ดำเนินการเรียบร้อย",
          2: "ปฏิเสธรายงาน",
     };

     const getStatusText = (status) => statusMap[status] || "อยู่ระหว่างการตรวจสอบ";
     
     const getStatusColor = (status) => {
          const numericStatus = Number(status);
          switch (numericStatus) {
               case 1: return "#28a745"; 
               case 0: return "#ffc107"; 
               case 2: return "#dc3545"; 
               default: return "#6c757d"; 
          }
     };

     useEffect(() => {
          const fetchReportData = async () => {
               try {
                    const response = await axios.get(`http://localhost:5500/reports/${nutrData._id}`, { timeout: 10000 });
                    setReports(response.data);
               } catch (error) {
                    console.log("Error fetching report data", error.message)
               }
          }
          fetchReportData();
     }, [nutrData]);

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://localhost:5500/report-detail/${itemId}`);
               const reportData = response.data;
               console.log("reportData sent: ", reportData);
               navigate('/report-history/detail', { state: { reportData } });
          } catch (error) {
               console.log('Error fetching report data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='report-card-history' onClick={() => handleItemPress(item._id)} key={item._id}>
               <div className='trivia-info'>
                    <h1>{item.triviaDetails.head}</h1>
                    <p className='trivia-date'>รายงานเมื่อ {calculateTimeAgo(item.createdAt)}</p>
                    <div className='trivia-des'>
                         <p>{item.note}</p>
                    </div>
                    <div className='detail-rp'>
                         <p>ผู้รายงาน:{item.nutrDetails.firstname} {item.nutrDetails.lastname}</p>
                         <p>สถานะการรายงาน: {getStatusText(item.status)}</p>
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
                         <div className='above-table'>
                              <p>รวมทั้งหมด {reports.length} การรายงาน</p>
                         </div>
                         <div className='trivia-render'>
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
     );
}

export default ReportHistory;
