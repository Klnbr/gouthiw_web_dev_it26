import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { Input, Select } from "antd";
import '.././App.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middleware/Auth';
import axios from 'axios';
import '../../src/components/trivia.css'

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

function TriviaScreen() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();

     const [trivs, setTrivia] = useState([]);
     const [trivsUser, setTriviaUser] = useState([]);
     const [showUserTrivias, setShowUserTrivias] = useState(false);

     const [searchTriv, setSearchTriv] = useState('');
     const [selectedType, setSelectedType] = useState("ทั้งหมด");

     useEffect(() => {
          const fetchTriviaData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/trivias", { timeout: 10000 });
                    setTrivia(response.data);
               } catch (error) {
                    console.log("Error fetching trivias data", error.message)
               }
          }
          const fetchTriviaDataUser = async () => {
               try {
                    const response = await axios.get(`http://localhost:5500/trivias/auth/${nutrData._id}`, { timeout: 10000 });
                    setTriviaUser(response.data);
               } catch (error) {
                    console.log("Error fetching trivias data", error.message)
               }
          }
          fetchTriviaData();
          if (nutrData) {
               fetchTriviaDataUser();
          }
     }, [nutrData])

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://localhost:5500/trivia/${itemId}`);
               const triviaData = response.data;

               console.log("triviaData: ", triviaData)
               navigate('/trivia-detail', { state: { triviaData } });
          } catch (error) {
               console.log('Error fetching trivia data', error.message);
          }
     };

     const filteredTrivs = trivs.filter(triv => 
          (selectedType === "ทั้งหมด" || triv.trivia_type === selectedType) &&
          triv.head.includes(searchTriv)
     );

     const renderItem = (item) => (
          <div className='trivia-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='trivia-pic' alt={`รูปภาพของ ${item.head}`} src={item.image} />
               <div className='trivia-info'>
                    <h1>{item.head}</h1>
                    <p className='trivia-date'>อัพเดตล่าสุด {calculateTimeAgo(item.updatedAt)}</p>
                    <div className='trivia-des'>
                         <p>{item.content}</p>
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
                    <SideBar />
                    <div className='content'>
                         <div className='nav'>
                              <Navbar />
                         </div>
                         <div className='main-content'>
                              <div className='trivia-manage'>
                                   <div className='trivia-search'>
                                        <div className='trivia-search-wrapper'>
                                             <i className="fa-solid fa-magnifying-glass trivia-search-icon"></i>
                                             <input 
                                                  type='text' 
                                                  placeholder='ค้นหาเกร็ดความรู้ที่นี่' 
                                                  onChange={(e) => setSearchTriv(e.target.value)}
                                                  className='trivia-search-input' />
                                        </div>
                                   </div>

                                   <button className='add-trivia-btn' onClick={() => navigate('/trivia')}>
                                        <i className="fa-solid fa-plus"> เพิ่มเกร็ดความรู้</i>
                                   </button>
                              </div>

                              <div className='triv-filter'>
                                   <p className='head-filter'>ประเภทเกร็ดความรู้:</p>
                                   <Select 
                                        className='triv-filter--select'
                                        value={selectedType} 
                                        onChange={(value) => setSelectedType(value)}
                                        options={[
                                             { value: "ทั้งหมด", label: "ทั้งหมด" },
                                             { value: "อาหาร", label: "อาหาร" },
                                             { value: "โรค", label: "เกี่ยวกับโรค" },
                                             { value: "ออกกำลังกาย", label: "ออกกำลังกาย" },
                                             { value: "อื่น ๆ", label: "อื่น ๆ" },
                                        ]}
                                   />
                              </div>
                              <div className='trivia-content'>
                                   {/* {nutrData && (
                                       <div className='btn-switch'>
                                             <button 
                                                  onClick={() => setShowUserTrivias(false)}
                                                  className={!showUserTrivias ? 'btn-switch-clicked' : 'btn-switch-noclick'}>ทั้งหมด</button>
                                             <button 
                                                  onClick={() => setShowUserTrivias(true)}
                                                  className={showUserTrivias ? 'btn-switch-clicked' : 'btn-switch-noclick'}>เกร็ดความรู้ของฉัน</button>
                                        </div>
                                   )} */}
                                   {showUserTrivias ? (
                                        trivsUser.length > 0 ? (
                                             trivsUser.map(item => renderItem(item))
                                        ) : (
                                             <h2>ยังไม่มีข้อมูลเกร็ดความรู้</h2>
                                        )
                                   ) : (
                                        filteredTrivs.length > 0 ? (
                                             filteredTrivs.map(item => renderItem(item))
                                        ) : (
                                             <h2>ยังไม่มีข้อมูลเกร็ดความรู้</h2>
                                        )
                                   )}
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default TriviaScreen
