import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TopicScreen() {
     const navigate = useNavigate();
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
                                   <i class="fa-solid fa-angle-down"></i>
                                   <p>เรียงจากล่าสุด</p>
                              </div>
                              <div className='topic-card' onClick={() => navigate('/topic-answer')}>
                                   <div className='topic-content'>
                                        <h1>กินอะไรแล้วหายเป็นเกาต์ได้บ้างคะ</h1>
                                        <p>2 ชั่วโมงที่แล้ว</p>
                                   </div>
                                   <div className='topic-user'>
                                        <i className="fa-solid fa-user"></i>
                                        <p>นางสาวอัญธิมา ผาละบุตร</p>
                                   </div>
                              </div>
                              <div className='topic-card'>
                                   <div className='topic-content'>
                                        <h1>กินอะไรแล้วหายเป็นเกาต์ได้บ้างคะ</h1>
                                        <p>2 ชั่วโมงที่แล้ว</p>
                                   </div>
                                   <div className='topic-user'>
                                        <i className="fa-solid fa-user"></i>
                                        <p>นางสาวอัญธิมา ผาละบุตร</p>
                                   </div>
                              </div> 
                              <div className='topic-card'>
                                   <div className='topic-content'>
                                        <h1>กินอะไรแล้วหายเป็นเกาต์ได้บ้างคะ</h1>
                                        <p>2 ชั่วโมงที่แล้ว</p>
                                   </div>
                                   <div className='topic-user'>
                                        <i className="fa-solid fa-user"></i>
                                        <p>นางสาวอัญธิมา ผาละบุตร</p>
                                   </div>
                              </div>                           
                         </div>
                    </div>
               </div>
          </>
     )
}

export default TopicScreen
