import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import '../../components/adminHome.css'
import ImgProfile from '../../images/homebanner.jpg'

function UserInformation() {
     const navigate = useNavigate();
     const { state } = useLocation();
     const { itemId, role } = state; // แยก itemId กับ role

     const [data, setData] = useState(null);

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const res = await axios.get(`http://localhost:5500/admin/${role}/${itemId}`);
                    setData(res.data);
               } catch (error) {
                    console.log("ไม่สามารถโหลดข้อมูลได้", error.message);
               }
          };
          fetchData();
     }, [itemId, role]);

     if (!data) {
          return <p>กำลังโหลด...</p>;
     }

     return (
          <>
               <div className="container">
                    <Navbar />
                    <div className='content--info'>
                         <div className='content--info-card'>
                              <button className="btn-goback" onClick={() => navigate(-1)}>
                                   <i className="fa-solid fa-angle-left"></i>
                              </button>
                              <div className='info-detail'>
                                   <img
                                        className="content--info-image"
                                        src={ImgProfile}
                                        alt=""
                                        />
                                   <p className='info--name'>{data.name || data.firstname + " " + data.lastname} </p>
                                   <p>สถานะ: {role === 0 ? "ผู้ป่วยโรคเกาต์" : "นักโภชนาการ"}</p>
                              </div>
                              
                              <hr className='hr-line'/>
                              
                              <div className='info-more-detail'>
                                   <div>
                                        <h1 className='info-head'>ข้อมูลบัญชี</h1>
                                        <p>อีเมล: {data.email}</p>
                                        {role === 0 ? (
                                             <>
                                                  <p>อายุ: {data.age}</p>
                                                  <p>ค่ากรดยูริกในเลือด: {data.uric || 'ไม่มีข้อมูล'}</p>
                                             </>
                                        ) : (
                                             <>
                                                  <p>โทรศัพท์: {data.tel || 'ไม่มีข้อมูล'}</p>
                                                  <p>เลขใบประกอบวิชาชีพ: {data.license_number || 'ไม่มีข้อมูล'}</p>
                                             </>
                                        )}
                                   </div>
                                   <div>
                                        <h1 className='info-head'>การใช้งานแอปพลิเคชัน</h1>
                                        <p>วันที่สร้างบัญชี: {new Date(data.createdAt).toLocaleDateString("th-TH")}</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default UserInformation