import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';
import Navbar from '../../components/Navbar/Navbar'
import { useAuth } from '../../middleware/Auth';
import { notification } from 'antd';

function Report() {
     const navigate = useNavigate();
     const location = useLocation();
     const { triviaData } = location.state || {};
     const { nutrData } = useAuth();

     const [note, setNote] = useState("")

     const handleReport = async () => {
          try {
               const reportData = {
                    triv_id: triviaData._id,
                    nutr_id: nutrData._id,
                    note: note,
                    recipientRole: "admin"
               };
          
               console.log("Report Data:", reportData);
               
               const response = await axios.post(`http://localhost:5500/report`, reportData);
               console.log("Response from server:", response);
               
               if (response.status === 201) {
                    alert("ส่งรายงานสำเร็จ");
                    navigate('/report-history');
               }
          } catch (error) {
               alert("เพิ่มเข้าไม่สำเร็จ");
               console.log("error creating trivia", error);
               if (error.response) {
                    console.log("Error response data:", error.response.data);
               }
          }
     };
     
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
                                   หัวข้อ: {triviaData.head}{" "} <br />
                                   ผู้เขียน: {triviaData.creator.firstname} {triviaData.creator.lastname}
                              </div>
                              <br />
                              <div className='form--input'>
                                   <label htmlFor='menu-type'>
                                        หมายเหตุ
                                   </label>
                                   <TextArea className='form--inputbox' rows='6' value={note} onChange={(e) => setNote(e.target.value)} />
                              </div>
                              
                              <div className='form-group form-bt'>
                                   <button type='button' className='btn-addtv' onClick={handleReport}>ส่งรายงาน</button>
                                   {/* <button type='button' className='btn-cancel' onClick={() => navigate('/trivias')}>ยกเลิก</button> */}
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default Report