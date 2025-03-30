import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import {  Select } from "antd";
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

function TopicScreen() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();
     const [loading, setLoading] = useState(true);  // เพิ่มสถานะการโหลด
     const [error, setError] = useState(null);  // เพิ่มสถานะ error
     const [searchTopic, setSearchTopic] = useState('');
     const [selectedDisplay, setSelectedDisplay] = useState("ใหม่ล่าสุด");

     const [topics, setTopics] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 4;  // จำนวนหัวข้อที่จะแสดงต่อหน้า

     useEffect(() => {
          const token = localStorage.getItem("authToken");
          if (!token) {
              navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
              return;
          }
        const fetchTopicData = async () => {
               try {
                    const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/topics", { timeout: 1000 });
                    setTopics(response.data);
                    setLoading(false);  
               } catch (error) {
                    console.log("Error fetching topics data", error.message)
                    setError("ไม่สามารถดึงข้อมูลกระทู้ได้");  
                    setLoading(false);
               }
          }
          
          fetchTopicData();
     }, [nutrData,navigate])

     const filteredTopics = topics.filter(topic => 
          topic.title.includes(searchTopic)
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

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/topic/${itemId}`);
               const topicData = response.data;
               navigate('/topic-answer', { state: { topicData } });
          } catch (error) {
               console.log('Error fetching topic data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='topic-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <div className='topic-info'>
                    <h2>{item.title}</h2>
                    <p>สร้างเมื่อ: {calculateTimeAgo(item.createdAt)}</p>
               </div>
               <div className='topic-user'>
                    <div className='flex'>
                         <i className="fa-solid fa-user"></i>
                         <p>{item.userDetails?.username}</p>
                    </div>
                    <div className='flex'>
                         <i className="fa-solid fa-reply"></i>
                         <p>การตอบกลับ ({item.answer?.length})</p>
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
                                   <div className='topic-content'>
                                        <div className='display-flex'>
                                             <p className='breadcumb'>
                                                  <span className='press-to-back'>หน้าหลัก</span>
                                                  <span className='gray-color'> &#62;</span> กระทู้
                                             </p>
                                             <div className='divider' />
                                        </div>

                                        <h1 className='head-content'>กระทู้</h1>
                                        <div className='topic-manage'>
                                             <div className='topic-search'>
                                                  <div className='topic-search-wrapper'>
                                                       <i className="fa-solid fa-magnifying-glass topic-search-icon"></i>
                                                       <input 
                                                            type='text'
                                                            placeholder='ค้นหากระทู้ที่นี่' 
                                                            onChange={(e) => setSearchTopic(e.target.value)} 
                                                            className='topic-search-input' />
                                                  </div>

                                                  <div className='topic-select-wrapper'>
                                                       <i className="fa-solid fa-sort topic-search-icon"></i>
                                                       <Select 
                                                            className='topic-search-select'
                                                            value={selectedDisplay} 
                                                            onChange={(value) => setSelectedDisplay(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                                            options={[
                                                                 { value: "newest", label: "ใหม่ล่าสุด" },
                                                                 { value: "oldest", label: "เก่าสุด" }
                                                            ]}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className='above-table'>
                                        <p>รวมทั้งหมด {topics.length} กระทู้</p>
                                   </div>
                                   <div className='topic-list'>
                                        
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
                                   </div>
                                   
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

export default TopicScreen;
