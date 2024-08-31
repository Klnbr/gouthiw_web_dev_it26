import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { useAuth } from '../middleware/Auth';
import { Input } from "antd";

function AnswerTopic() {
     const { nutrData } = useAuth();
     const { TextArea } = Input;

     return (
          <>
               <div className='container'>
                    <SideBar />
                    <div className='content'>
                         <div className='nav'>
                              <Navbar />
                         </div>
                         <div className='main-content'>
                              <div className='topic-detail-card'>
                                   <div className='topic-detail-content'>
                                        <h1>กินอะไรแล้วหายเป็นเกาต์ได้บ้างคะ</h1>
                                        <p>2 ชั่วโมงที่แล้ว</p>
                                   </div>
                                   <hr className='hr-line' />
                                   <div className='topic-detail'>
                                        <p>อยากทราบว่านอกจากยาแล้วมีอะไรที่กินแล้วหายเป็นเกาต์ได้บ้างคะ</p>
                                   </div>
                                   <div className='topic-user'>
                                        <i className="fa-solid fa-user"></i>
                                        <p>นางสาวอัญธิมา ผาละบุตร</p>
                                   </div>
                              </div>

                              <hr className='hr-line-80' />

                              <div className='topic-answer-card'>
                                   <TextArea 
                                             className='form--inputbox' 
                                             placeholder='กรอกคำตอบของคุณที่นี่' 
                                             rows={8} />
                                   <div className='topic-btn'>
                                        <div className='topic-user'>
                                             <i className="fa-solid fa-user-nurse"></i>
                                             <p>{nutrData.firstname} {nutrData.lastname}</p>
                                        </div>
                                        <button>ตอบกระทู้</button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default AnswerTopic