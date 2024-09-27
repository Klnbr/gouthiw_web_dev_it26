import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../middleware/Auth';
import '../../src/components/topic.css'

function TopicScreen() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();
     const [loading, setLoading] = useState(true);  // เพิ่มสถานะการโหลด
     const [error, setError] = useState(null);  // เพิ่มสถานะ error

     const [topics, setTopics] = useState([]);

     useEffect(() => {
          const fetchTopicData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/topics", { timeout: 10000 });
                    setTopics(response.data);
                    setLoading(false);  // เมื่อดึงข้อมูลสำเร็จ เปลี่ยนสถานะการโหลด
               } catch (error) {
                    console.log("Error fetching trivias data", error.message)
                    setError("ไม่สามารถดึงข้อมูลกระทู้ได้");  // ตั้งค่าสถานะ error
                    setLoading(false);
               }
          }
          
          fetchTopicData();
     }, [nutrData])

     // ฟังก์ชันในการคำนวณเวลาที่โพสต์
     const calculateTimeAgo = (createdAt) => {
          const currentTime = new Date();
          const postTime = new Date(createdAt);
          const timeDiff = Math.abs(currentTime - postTime) / 36e5;  // คำนวณต่างเป็นชั่วโมง
          
          if (timeDiff < 1) {
               return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
          } else if (timeDiff < 24) {
               return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
          } else {
               return `${Math.floor(timeDiff / 24)} วันที่แล้ว`;
          }
     };

     const handleItemPress = async (itemId) => {
          try {
               console.log("Item ID:", itemId);
               const response = await axios.get(`http://localhost:5500/topic/${itemId}`);
               const topicData = response.data;

               console.log("Fetched Topic Data:", topicData);
               navigate('/topic-answer', { state: { topicData } });
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

     return (
          <>
               <div className='container'>
                    <SideBar />
                    <div className='content'>
                         <div className='nav'>
                              <Navbar />
                         </div>
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
                                   topics.length > 0 ? (
                                        topics.map(item => renderItem(item))
                                   ) : (
                                        <h2>ยังไม่มีกระทู้</h2>
                                   )
                              )}   
                         </div>
                    </div>
               </div>
          </>
     )
}

export default TopicScreen
