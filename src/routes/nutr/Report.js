import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';
import Navbar from '../../components/Navbar/Navbar'
import { useAuth } from '../../middleware/Auth';

function Report() {
     const navigate = useNavigate();
     const location = useLocation();
     const { triviaData } = location.state || {};
     const { nutrData } = useAuth();

     const [note, setNote] = useState("")
     
     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='content-no-sidebar'>
                         <button className="btn-goback" onClick={() => navigate(-1)}>
                              <i className="fa-solid fa-angle-left"></i>
                         </button>
                         <div className='form-trivia'>
                              <h2>รายงาน</h2>
                              <div>
                                   หัวข้อ: {triviaData.head}
                                   ผู้เขียน: {triviaData.creator.firstname} {triviaData.creator.lastname}
                              </div>
                              <div className='form--input'>
                                   <label htmlFor='menu-type'>
                                        หมายเหตุ
                                   </label>
                                   <TextArea className='form--inputbox' rows='6' value={note} onChange={(e) => setNote(e.target.value)} />
                              </div>
                              
                              <div className='form-group form-bt'>
                                   <button type='button' className='btn-addtv'>ส่งรายงาน</button>
                                   {/* <button type='button' className='btn-cancel' onClick={() => navigate('/trivias')}>ยกเลิก</button> */}
                              </div>
                         </div>
                    </div>
               </div>
               
          </>
     )
}

export default Report