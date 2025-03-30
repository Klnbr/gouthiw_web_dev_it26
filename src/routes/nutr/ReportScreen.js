import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';
import Navbar from '../../components/Navbar/Navbar'
import { useAuth } from '../../middleware/Auth';
import ReadMore from "../../components/Readmore";

function Report() {
     const navigate = useNavigate();
     const location = useLocation();
     const { triviaData } = location.state || {};
     const { nutrData } = useAuth();

     const [note, setNote] = useState("")

     useEffect(() => {
          const token = localStorage.getItem("authToken");
          if (!token) {
              navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
              return;
          }
     }, [navigate]);

     const handleReport = async () => {
          try {
               const reportData = {
                    triv_id: triviaData._id,
                    nutr_id: nutrData._id,
                    note: note,
                    recipientRole: "admin"
               };
          
               console.log("Report Data:", reportData);
               
               const response = await axios.post(`https://gouthiw-web-dev-it26.onrender.com/report`, reportData);
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
                         <div className='form-report'>
                              <h2>รายงาน</h2>
                              <div className="report-details">
                                   <div className="rp-dt">
                                        <b>เกร็ดความรู้ที่ถูกรายงาน: </b>
                                        <div className="tv-rp">
                                             <h4>{triviaData.head}</h4>
                                             <p>ผู้เขียน: {triviaData.creator.firstname} {triviaData.creator.lastname}</p>
                                             <hr className="hr-line" />
                                             <div className="img-rp">
                                                  <img
                                                       className="img-tv"
                                                       src={triviaData.image}
                                                       alt={triviaData.head}
                                                       loading="lazy"
                                                  />
                                             </div>
                                             <ReadMore
                                                  text={triviaData.content}
                                                  dangerouslySetInnerHTML={{
                                                  __html: triviaData.content,
                                                  }}
                                             />
                                        </div>
                                   </div>
                              </div>

                              <div className="rp-dt">
                                   <label htmlFor='menu-type'>
                                        หมายเหตุ
                                   </label>
                                   <TextArea rows='6' value={note} onChange={(e) => setNote(e.target.value)} />
                              </div>
                              
                              <div className='form-group form-bt'>
                                   <button type='button' className='btn-addtv' onClick={handleReport}>ส่งรายงาน</button>
                                
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default Report