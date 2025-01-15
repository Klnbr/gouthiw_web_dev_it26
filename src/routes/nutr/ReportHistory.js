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

     const [reports, setReports] = useState([])

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
     }, [nutrData])

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://localhost:5500/report-detail/${itemId}`);
               const reportData = response.data;
               console.log("reportData sent: ", reportData)
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
                   <p>ผู้รายงาน:{item.nutrDetails.firstname} {item.nutrDetails.lastname}</p> <br />
                   <p>สถานะการรายงาน: {getStatusText(item.status)}</p>
                   </div>
               </div>
               
          </div>
     );

     const calculateTimeAgo = (createdAt) => {
          const currentTime = new Date();
          const postTime = new Date(createdAt);
          const timeDiff = Math.abs(currentTime - postTime) / 36e5;  // คำนวณต่างเป็นชั่วโมง

          if (timeDiff < 1) {
               return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
          } else if (timeDiff < 24) {
               return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
          } else {
               return postTime.toLocaleString("th-TH", optionsDMY);
          }
     };

     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='sidebar-content-wrapper'>
                         <SideBar />
                         <div className='content'>
                              <div className='above-table'>
                                   <p>รวมทั้งหมด {reports.length} การรายงาน</p>
                              </div>
                              <div className='trivia-render'>
                                   {reports.length > 0 ? (
                                        reports.map(item => renderItem(item))
                                   ) : (
                                        <h2>ยังไม่มีประวัติการรายงาน</h2>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default ReportHistory