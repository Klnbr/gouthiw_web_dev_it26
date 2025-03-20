import React, { useEffect, useState } from 'react'
import SideBar from "../../components/SideBar/SideBar";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from 'react-router-dom';
import '../../components/adminHome.css'
import axios from 'axios';

function AdminHome() {
     const navigate = useNavigate();
     const [data, setData] = useState([])
     const [user, setUser] = useState([])
     const [nutr, setNutr] = useState([])
     const [newRegis, setNewRegis] = useState([])

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const resUser = await axios.get("http://localhost:5500/users", { timeout: 1000 });
                    setUser(resUser.data)
                    const usersData = resUser.data.map((user) => ({
                         id: user._id,
                         name: user.name,
                         email: user.email,
                         role: "ผู้ป่วยโรคเกาต์",
                         createdAt: user.createdAt
                    }))
                    
                    const resNutr = await axios.get("http://localhost:5500/nutrs", { timeout: 1000 });
                    setNutr(resNutr.data)
                    const nutrsData = resNutr.data.map((nutr) => ({
                         id: nutr._id,
                         name: `${nutr.firstname} ${nutr.lastname}`,
                         email: nutr.email,
                         role: "นักโภชนาการ",
                         createdAt: nutr.createdAt,
                    }));

                    const dataJoined = [ ...usersData, ...nutrsData ].sort(
                         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );

                    setData(dataJoined);


                    const newRegisData = dataJoined.filter((t) => {
                         const date = new Date(t.createdAt);
                         const monthFromData = date.getMonth();
                         const currentMonth = new Date().getMonth();
                         return monthFromData === currentMonth;
                    });
                    setNewRegis(newRegisData);
                       
               } catch (error) {
                    console.log("ไม่สามารถโหลดข้อมูลได้", error.message)
               }
          }
          fetchData()
     }, [])

     const dashItem = [
          {
               title: "บัญชีผู้ใช้ทั้งหมด",
               icon: "fa-solid fa-users",
               color: "#FFA13F",
               count: data.length
          },
          {
               title: "บัญชีผู้ป่วยโรคเกาต์",
               icon: "fa-solid fa-user",
               color: "#FF4B3F",
               count: user.length
          },
          {
               title: "บัญชีนักโภชนาการ",
               icon: "fa-solid fa-user-nurse",
               color: "#1BA0FF",
               count: nutr.length
          },
          {
               title: "บัญชีผู้ใช้ใหม่เดือนนี้",
               icon: "fa-solid fa-chart-line",
               color: "#7F1BFF",
               count: newRegis.length
          },
     ]

     const handleMoreInfo = async (itemId, role) => {
          try {
               navigate('/admin/information', { state: { itemId, role } });
          } catch (error) {
               console.log('เกิดข้อผิดพลาดในการแสดงข้อมูล', error.message);
          }
     }
     
     return (
          <>
               <div className="container">
                    <Navbar />
                    <div className='sidebar-content-wrapper'>
                         <SideBar />
                         <div className="content--admin">
                              <div className="head-content--home">
                                   <img
                                   loading="lazy"
                                        className="image-home"
                                        src="https://www.naturemade.com/cdn/shop/articles/healthy-foods-to-eat.jpg?v=1611988563"
                                        alt="head-image"
                                        />
                              </div>
                              <div className='dash--4'>
                                   {dashItem.map((item, index) => {
                                        return (
                                             <div className='dash--info' key={index} style={{ backgroundColor: item.color}}>
                                                  <p>{item.title}</p>
                                                  <div className='dash--flex'>
                                                       <i className={item.icon}></i>
                                                       <span>{item.count}</span>
                                                  </div>
                                             </div>
                                        )
                                   })}
                              </div>
                              <div className='dash--search-wrapper'>
                                   <div className='dash--search'>
                                        <i className="fa-solid fa-magnifying-glass dash--search-icon"></i>
                                        <input
                                             type='text'
                                             placeholder='ค้นหาที่นี่'
                                             className='dash--search-input'
                                        />
                                   </div>
                                   <div className='dash--filter'>
                                        <i className="fa-solid fa-filter dash--search-icon"></i>
                                        <p>ตัวกรอง</p>
                                   </div>
                              </div>
                              <table className='dash--table'>
                                   <thead>
                                        <tr>
                                             <th>ชื่อ-นามสกุล</th>
                                             <th>อีเมล</th>
                                             <th>สถานะ</th>
                                             <th colSpan={2}>วันที่สร้างบัญชี</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {data.map((item, index) => (
                                             <tr key={index} >
                                                  <td>{item.name}</td>
                                                  <td>{item.email}</td>
                                                  <td>{item.role}</td>
                                                  <td>{new Date(item.createdAt).toLocaleDateString("th-TH")}</td>
                                                  <td 
                                                       className='info-btn' 
                                                       onClick={() => handleMoreInfo(item.id, item.role === "ผู้ป่วยโรคเกาต์" ? 0 : 1)} 
                                                       key={item._id}>
                                                       <i className="fa-solid fa-circle-info"></i>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default AdminHome