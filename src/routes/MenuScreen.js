import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MenuScreen() {
     const navigate = useNavigate();
     const [menus, setMenus] = useState([]);

     useEffect(() => {
          const fetchMenuData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/menus", { timeout: 10000 });
                    // console.log(response.data)
                    setMenus(response.data);
               } catch (error) {
                    console.log("Error fetching menus data", error.message)
               }
          }
          fetchMenuData();
     }, [])

     const renderItem = (item) => (
          <div className='menu-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='menu-pic' alt={`รูปภาพของ ${item.menuName}`} src={item.image} />
               <h1>{item.menuName}</h1>
               <div className='layout'>
                    <p className='purine'>พิวรีน: {item.purine}</p>
                    <p className='uric'>กรดยูริก: {item.uric}</p>
               </div>
          </div>
     );

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://localhost:5500/menu/${itemId}`);
               const menuData = response.data;

               navigate('/menu', { state: { menuData } });
          } catch (error) {
               console.log('Error fetching menu data', error.message);
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
                         <div className='menu-search'>
                              <input type='text' placeholder='ค้นหาอาหารที่นี่' />
                              <button>
                                   <i class="fa-solid fa-magnifying-glass"></i>
                              </button>
                              {/* <button>
                                   <i class="fa-solid fa-plus"></i>
                                   เพิ่มอาหาร
                              </button> */}
                         </div>
                         <div className='main-content'>
                              <div className='menu-content'>
                                   <div className='add-menu-card' onClick={() => navigate('/menu')}>
                                        <i className="fa-solid fa-plus"></i>
                                   </div>
                                   {menus.length > 0 ? (
                                        menus.map(item => renderItem(item))
                                   ) : (
                                        <h2>ยังไม่มีข้อมูลอาหาร</h2>
                                   )}
                              </div>
                              
                              
                         </div>
                    </div>
               </div>
          </>
     )
}

export default MenuScreen
