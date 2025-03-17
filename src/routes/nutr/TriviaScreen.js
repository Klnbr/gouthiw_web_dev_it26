import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import { Input, Select } from "antd";
import '../../App.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../middleware/Auth';
import axios from 'axios';
import '../../components/trivia.css'

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
     const [selectedDisplay, setSelectedDisplay] = useState("เพิ่มเข้าล่าสุด");

       const [currentPage, setCurrentPage] = useState(1);
          const itemsPerPage = 4;

     const [activeButton, setActiveButton] = useState('ทั้งหมด');

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

     const filteredTrivs = trivs.filter(triv => 
          (selectedType === "ทั้งหมด" || triv.trivia_type === selectedType) &&
          triv.head.includes(searchTriv)
     );

     // การกรองตามลำดับการแสดง
     const filterDisplay = selectedDisplay === "เพิ่มเข้าล่าสุด"
          ? filteredTrivs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงตามวันที่ล่าสุด
          : selectedDisplay === "last_update"
          ? filteredTrivs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // เรียงตามวันที่อัปเดตล่าสุด
          : filteredTrivs;

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

     const calculateTimeRemaining = (reminderDate) => {
          const currentTime = new Date();
          const targetTime = new Date(reminderDate);
          const timeDiff = targetTime - currentTime; // หาจำนวนมิลลิวินาทีที่เหลือ
      
          if (timeDiff <= 0) {
              return "ถึงกำหนดแล้ว";
          }
      
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
          if (days > 0) {
              return `เหลือเวลาแก้ไขอีก ${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
          } else {
              return `เหลือเวลาแก้ไขอีก ${hours} ชั่วโมง ${minutes} นาที`;
          }
     };

     const stripHTML = (html) => {
          const div = document.createElement('div');
          div.innerHTML = html;
          return div.textContent || div.innerText || '';
     };

     const paginate = (pageNumber) => setCurrentPage(pageNumber);

     const renderItem = (item) => (
          <div className='trivia-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='trivia-pic' alt={`รูปภาพของ ${item.head}`} src={item.image} />
               <div className='trivia-info'>
                    <h1>{item.head}</h1>
                    <p className='trivia-date'>อัพเดตล่าสุด {calculateTimeAgo(item.updatedAt)}</p>
                    <div className='trivia-des'>
                         <p>{stripHTML(item.content)}</p>
                    </div>
               </div>
               {item.edit_deadline && (
                    <div className='trivia-deadline'>
                         <p>{calculateTimeRemaining(item.edit_deadline)}</p>
                    </div>
               )}
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

     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = filterDisplay.slice(indexOfFirstItem, indexOfLastItem);

     const totalPages = Math.ceil(filterDisplay.length / itemsPerPage);

     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='sidebar-content-wrapper'>
                         <SideBar/>
                         <div className='content'>
                              <div className='main-content'>
                                   <div className='trivia-content'>
                                        <div className='display-flex'>
                                             <p className='breadcumb'>
                                                  <span className='press-to-back'>หน้าหลัก</span>
                                                  <span className='gray-color'> &#62;</span> เกร็ดความรู้
                                             </p>
                                             <div className='divider' />
                                             <button className='add-trivia-btn' onClick={() => navigate('/trivia')}>
                                                  <i className="fa-solid fa-plus"> เพิ่มเกร็ดความรู้</i>
                                             </button> 
                                        </div>

                                        <h1 className='head-content'>เกร็ดความรู้</h1>
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

                                                  <div className='trivia-select-wrapper'>
                                                       <i className="fa-solid fa-filter trivia-search-icon"></i>
                                                       <Select 
                                                            className='trivia-search-select'
                                                            value={selectedType} 
                                                            onChange={(value) => setSelectedType(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                                            options={[
                                                                 { value: "ทั้งหมด", label: "ทั้งหมด" },
                                                                 { value: "อาหาร", label: "อาหาร" },
                                                                 { value: "โรค", label: "เกี่ยวกับโรค" },
                                                                 { value: "ออกกำลังกาย", label: "ออกกำลังกาย" },
                                                                 { value: "อื่น ๆ", label: "อื่น ๆ" },
                                                            ]}
                                                       />
                                                  </div>

                                                  <div className='trivia-select-wrapper'>
                                                       <i className="fa-solid fa-sort trivia-search-icon"></i>
                                                       <Select 
                                                            className='trivia-search-select'
                                                            value={selectedDisplay} 
                                                            onChange={(value) => setSelectedDisplay(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                                            options={[
                                                                 { value: "last_add", label: "เพิ่มเข้าล่าสุด" },
                                                                 { value: "last_update", label: "อัปเดตล่าสุด" }
                                                            ]}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className='above-table'>
                                        <p>รวมทั้งหมด {trivs.length} เกร็ดความรู้</p>
                                        <div className='switch-btn'>
                                             <button 
                                                  onClick={() => setActiveButton('ทั้งหมด')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ทั้งหมด' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ทั้งหมด' ? 'white' : 'black'
                                                  }}>ทั้งหมด</button>
                                             <button 
                                                  onClick={() => setActiveButton('ของฉัน')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ของฉัน' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ของฉัน' ? 'white' : 'black'
                                                  }}>ของฉัน</button>
                                        </div>
                                   </div>
                                   
                                   <div className='trivia-render'>
                                        {activeButton === 'ทั้งหมด' ? (
                                             currentItems.length > 0 ? (
                                                  currentItems.map(item => renderItem(item))
                                             ) : (
                                                  <h2>ยังไม่มีข้อมูลเกร็ดความรู้</h2>
                                             )
                                        ) : (
                                             trivsUser.length > 0 ? (
                                                  trivsUser.map(item => renderItem(item))
                                             ) : (
                                                  <h2>ยังไม่มีข้อมูลเกร็ดความรู้</h2>
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

export default TriviaScreen
