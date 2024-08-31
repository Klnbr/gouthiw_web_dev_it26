import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import '.././App.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middleware/Auth';
import axios from 'axios';
import '../../src/components/trivia.css'

function TriviaScreen() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();

     const [trivs, setTrivia] = useState([]);
     const [trivsUser, setTriviaUser] = useState([]);
     const [showUserTrivias, setShowUserTrivias] = useState(false);

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

               navigate('/trivia', { state: { triviaData } });
          } catch (error) {
               console.log('Error fetching trivia data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='trivia-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='trivia-pic' alt={`รูปภาพของ ${item.head}`} src={item.image} />
               <div className='trivia-info'>
                    <h1>{item.head}</h1>
                    <div className='trivia-des'>
                         <p>{item.content}</p>
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
                              <div className='trivia-manage'>
                                   <div className='trivia-search'>
                                        <input type='text' placeholder='ค้นหาเกร็ดความรู้ที่นี่' />
                                        <button className='search-trivia-btn'>
                                             <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                   </div>
                                   <button className='add-trivia-btn' onClick={() => navigate('/trivia')}>
                                        <i className="fa-solid fa-plus"> เพิ่มเกร็ดความรู้</i>
                                   </button>
                              </div>
                              <div className='trivia-content'>
                                   {nutrData && (
                                       <div className='btn-switch'>
                                             <button 
                                                  onClick={() => setShowUserTrivias(false)}
                                                  className={!showUserTrivias ? 'btn-switch-clicked' : 'btn-switch-noclick'}>ทั้งหมด</button>
                                             <button 
                                                  onClick={() => setShowUserTrivias(true)}
                                                  className={showUserTrivias ? 'btn-switch-clicked' : 'btn-switch-noclick'}>เกร็ดความรู้ของฉัน</button>
                                        </div>
                                   )}
                                   {showUserTrivias ? (
                                        trivsUser.length > 0 ? (
                                             trivsUser.map(item => renderItem(item))
                                        ) : (
                                             <h2>ยังไม่มีข้อมูลเกร็ดความรู้</h2>
                                        )
                                   ) : (
                                        trivs.length > 0 ? (
                                             trivs.map(item => renderItem(item))
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
