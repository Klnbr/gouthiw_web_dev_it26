import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../middleware/Auth';
import '../../components/topic.css'
import '../../App.css'

const optionsDMY = {
    timeZone: "Asia/Bangkok",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

const optionsTime = {
    timeZone: "Asia/Bangkok",
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

export default function TopicScreenAd() {
    const navigate = useNavigate();
    const { nutrData } = useAuth();
    const [loading, setLoading] = useState(true);  // เพิ่มสถานะการโหลด
    const [error, setError] = useState(null);  // เพิ่มสถานะ error

    const [topics, setTopics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;  // จำนวนหัวข้อที่จะแสดงต่อหน้า

    useEffect(() => {
         const fetchTopicData = async () => {
              try {
                   const response = await axios.get("http://localhost:5500/topics", { timeout: 10000 });
                   setTopics(response.data);
                   setLoading(false);  // เมื่อดึงข้อมูลสำเร็จ เปลี่ยนสถานะการโหลด
              } catch (error) {
                   console.log("Error fetching topics data", error.message)
                   setError("ไม่สามารถดึงข้อมูลกระทู้ได้");  // ตั้งค่าสถานะ error
                   setLoading(false);
              }
         }
         
         fetchTopicData();
    }, [nutrData])

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

    const handleItemPress = async (itemId) => {
         try {
              const response = await axios.get(`http://localhost:5500/topic/${itemId}`);
              const topicData = response.data;
              navigate('/admin/topic-detail', { state: { topicData } });
         } catch (error) {
              console.log('Error fetching topic data', error.message);
         }
    };

    const renderItem = (item) => (
         <div className='topic-card' onClick={() => handleItemPress(item._id)} key={item._id}>
              <div className='topic-content'>
                   <h1>{item.title}</h1>
                   <p>{calculateTimeAgo(item.createdAt)}</p>
              </div>
              <div className='topic-user'>
                   <div className='flex'>
                        <i className="fa-solid fa-user"></i>
                        <p>{item.userDetails?.name || "ไม่ทราบชื่อผู้ใช้"}</p>
                   </div>
                   <div className='flex'>
                        <i className="fa-solid fa-reply"></i>
                        <p>{item.answer?.length}</p>
                   </div>
              </div>
         </div>
    );

    // คำนวณหน้าที่จะแสดง
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = topics.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(topics.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
             <div className='container'>
                  <Navbar />
                  <div className='sidebar-content-wrapper'>
                       <SideBar />
                       <div className='content'>
                            <div className='main-content'>
                                 <div className='topic-option'>
                                      <i className="fa-solid fa-angle-down"></i>
                                      <p>เรียงจากล่าสุด</p>
                                 </div>
                                 {/* แสดงข้อความขณะโหลดหรือเมื่อมี error */}
                                 {loading ? (
                                      <h2>กำลังโหลด...</h2>
                                 ) : error ? (
                                      <h2>{error}</h2>
                                 ) : (
                                      currentItems.length > 0 ? (
                                           currentItems.map(item => renderItem(item))
                                      ) : (
                                           <h2>ยังไม่มีกระทู้</h2>
                                      )
                                 )}
                                 {/* Pagination controls */}
                                 <div className="pagination">
                                      <button
                                           onClick={() => paginate(currentPage - 1)}
                                           disabled={currentPage === 1}
                                           className="pagination-button"
                                      >
                                           ย้อนกลับ
                                      </button>
                                      {[...Array(totalPages).keys()].map(number => (
                                           <button
                                                key={number}
                                                onClick={() => paginate(number + 1)}
                                                className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
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
        </>
   )
}
