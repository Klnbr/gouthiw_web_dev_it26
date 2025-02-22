import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import { useAuth } from '../../middleware/Auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "antd";
import axios from 'axios';

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

 
export default function TopicDetail() {

     const navigate = useNavigate();
     const location = useLocation();
     const { topicData } = location.state || {};
     const { nutrData } = useAuth();
     
     const { TextArea } = Input;
     const [answer, setAnswer] = useState('');
     const [image, setImage] = useState(null);
 
     const handleImageChange = (e) => {
         const file = e.target.files[0];
         if (file) {
             setImage(file);
         }
     };
 
     
     const renderItem = (item) => (
      <div className='topic-answer-card' key={item._id}>
          <div className='topic-content'>
              <h1>{item.answer_detail}</h1>
              {/* แสดงรูปภาพถ้ามี */}
          <div className='topic-user'>
              <div className='flex'>
                  <i className="fa-solid fa-user-nurse"></i>
                  <p>{item.nutrDetails?.firstname} {item.nutrDetails?.lastname}</p>
              </div>
              <div className='topic-images'>
                {/* {Array.isArray(item.image) ? ( */}
                     {item.image.map((img, index) => (
                          <img key={index} src={img} alt={`รูปที่ ${index + 1}`} className='topic-img' />
                     ))}
                {/* ) : ( */}
                     {/* <img src={item.image} alt="รูปกระทู้" className='topic-img' /> */}
                {/* )} */}
           </div>
              <div className='flex'>
                  <i className="fa-solid fa-reply"></i>
                  <p>{item.answer?.length}</p>
              </div>
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
 
  
     const handleAnswer = async () => {
         if (!answer) {
             alert("กรุณาเพิ่มการตอบกลับของคุณ");
             return;
         }
 
 
         const ansData = new FormData();
         ansData.append('nutr_id', nutrData._id);
         ansData.append('answer_detail', answer);
         if (image) {
             ansData.append('answer_image', image);  // ส่งไฟล์รูปภาพไปด้วย
         }
 
         try {
             const response = await axios.put(`http://localhost:5500/topic/answer/${topicData._id}`, ansData, {
                 headers: {
                     'Content-Type': 'multipart/form-data'
                 }
             });
 
             if (response.status === 200) {
                 alert("ตอบกระทู้สำเร็จ");
                 navigate('/topics');
             }
         } catch (error) {
             alert("ตอบกระทู้ไม่สำเร็จ");
             console.log("error creating topic", error);
         }
     };

     return (
          <>
              <div className='container'>
                  <Navbar />
                  <div className='content-no-sidebar'>
                      <div className='main-content'>
                          <div className='topic-detail-card'>
                              <div className='topic-detail-content'>
                                  <h1>{topicData.title}</h1>
                                  <p>{calculateTimeAgo(topicData.createdAt)}</p>
                              </div>
                              <hr className='hr-line' />
                              <div className='topic-detail'>
                                  <p>{topicData.detail}</p>
                              </div>
                              <img className='trivia-pic' alt={`รูปภาพกระทู้`} src={topicData.image} />
                              <div className='topic-userdetail'>
                                  <i className="fa-solid fa-user"></i>
                                  <p>{topicData.userDetails?.name || "ไม่ทราบชื่อผู้ใช้"}</p>
                              </div>
                          </div>
  
                          <hr className='hr-line-80' />
  
                          <div className='topic-answer-card'>
                              <TextArea
                                  className='form--inputbox'
                                  placeholder='กรอกคำตอบของคุณที่นี่'
                                  rows={8}
                                  value={answer}
                                  onChange={(e) => setAnswer(e.target.value)}
                              />
                              {/* ฟอร์มสำหรับเลือกไฟล์รูปภาพ */}
                              <input type="file" onChange={handleImageChange} />
                              <div className='topic-btn'>
                                  <div className='topic-user'>
                                      <i className="fa-solid fa-user-nurse"></i>
                                      <p>{nutrData.firstname} {nutrData.lastname}</p>
                                  </div>
                                  <button onClick={handleAnswer}>ตอบกระทู้</button>
                              </div>
                          </div>
  
                          <div className='width-80'>
                              <p>การตอบกลับทั้งหมด</p>
                          </div>
                          {Array.isArray(topicData.answer) && topicData.answer.filter(item => item && item.answer_detail).length > 0 ? (
                              topicData.answer.map(item => renderItem(item))
                          ) : (
                              <div className='topic-answer-card'>
                                  <p>ยังไม่มีการตอบกลับ</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </>
      );
}
