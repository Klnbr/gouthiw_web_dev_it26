import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../middleware/Auth';
import { Input, Select } from "antd";
import axios from 'axios';
import '../../../src/components/menu.css'

function MenuScreenAdmin() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();

     const [menus, setMenus] = useState([]);
     const [menusUser, setMenusUser] = useState([]);

     const [searchMenu, setSearchMenu] = useState('');
     const [selectedType, setSelectedType] = useState('ทั้งหมด');
     const [selectedDisplay, setSelectedDisplay] = useState("เพิ่มเข้าล่าสุด");

     const [dropdownVisible, setDropdownVisible] = useState(null);

     const [activeButton, setActiveButton] = useState('ทั้งหมด');

     useEffect(() => {
          const fetchMenuData = async () => {
               try {
                    const response = await axios.get("https://gouthiw-health.onrender.com/menus", { timeout: 1000 });
                    setMenus(response.data);
               } catch (error) {
                    console.log("Error fetching menus data", error.message)
               }
          }
          const fetchMenuDataUser = async () => {
               try {
                    const response = await axios.get(`https://gouthiw-health.onrender.com/menus/auth/${nutrData._id}`, { timeout: 1000 });
                    console.log(response.data)
                    setMenusUser(response.data);

               } catch (error) {
                    console.log("Error fetching menus data", error.message)
               }
          }
          fetchMenuData();
          if (nutrData) {
               fetchMenuDataUser();
          }
     }, [nutrData])

     const filteredMenus = menus.filter(menu =>
          (selectedType === "ทั้งหมด" || menu.category === selectedType) &&
          menu.menuName.includes(searchMenu)
     );

     // การกรองตามลำดับการแสดง
     const filterDisplay = selectedDisplay === "เพิ่มเข้าล่าสุด"
          ? filteredMenus.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงตามวันที่ล่าสุด
          : selectedDisplay === "top_purine"
          ? filteredMenus.sort((a, b) => b.purine_total - a.purine_total) // เรียงจากมากไปน้อย
          : filteredMenus.sort((a, b) => a.purine_total - b.purine_total); // เรียงจากน้อยไปมาก

     const handleItemPress = async (itemId) => {
          try {
               console.log("Item ID:", itemId);
               const response = await axios.get(`https://gouthiw-health.onrender.com/menu/${itemId}`);
               const menuData = response.data;

               console.log("Fetched Menu Data:", menuData);
               navigate('/admin/menu-detail', { state: { menuData } });
          } catch (error) {
               console.log('Error fetching menu data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='menu-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='menu-pic' alt={`รูปภาพของ ${item.menuName}`} src={item.image} loading="lazy"/>
               <h1>{item.menuName}</h1>
               <div className='layout'>
                    <p className='purine'>พิวรีน: {item.purine_total}</p>
                   
               </div>
          </div>
     );

     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='sidebar-content-wrapper'>
                         <SideBar/>
                         <div className='content'>
                              <div className='main-content'>
                                   <div className='menu-content'>
                                        <div className='display-flex'>
                                             <p className='breadcumb'>
                                                  <span className='press-to-back'>หน้าหลัก</span>
                                                  <span className='gray-color'> &#62;</span> เมนูอาหาร
                                             </p>
                                             <div className='divider' />
                                             <button className='add-menu-btn' onClick={() => navigate('/menu')}>
                                                  <i className="fa-solid fa-plus"> เพิ่มอาหารของคุณ</i>
                                             </button> 
                                        </div>
                                        
                                        <h1 className='head-content'>เมนูอาหาร</h1>

                                        {/* search engine */}
                                        <div className='menu-manage'>
                                             <div className='menu-search'>
                                                  <div className='menu-search-wrapper'>
                                                       <i className="fa-solid fa-magnifying-glass menu-search-icon"></i>
                                                       <input 
                                                            type='text'
                                                            placeholder='ค้นหาวัตถุดิบที่นี่' 
                                                            onChange={(e) => setSearchMenu(e.target.value)} 
                                                            className='menu-search-input' />
                                                  </div>

                                                  <div className='menu-select-wrapper'>
                                                       <i className="fa-solid fa-filter menu-search-icon"></i>
                                                       <Select 
                                                            className='menu-search-select'
                                                            value={selectedType} 
                                                            onChange={(value) => setSelectedType(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                                            options={[
                                                                 { value: "ทั้งหมด", label: "ทั้งหมด" },
                                                                 { value: "ผัด", label: "ผัด" },
                                                                 { value: "แกง", label: "แกง" },
                                                                 { value: "ทอด", label: "ทอด" },
                                                                 { value: "ตุ๋น", label: "ตุ๋น" },
                                                            ]}
                                                       />
                                                  </div>

                                                  <div className='menu-select-wrapper'>
                                                       <i className="fa-solid fa-sort menu-search-icon"></i>
                                                       <Select 
                                                            className='menu-search-select'
                                                            value={selectedDisplay} 
                                                            onChange={(value) => setSelectedDisplay(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                                            options={[
                                                                 { value: "last_add", label: "เพิ่มเข้าล่าสุด" },
                                                                 { value: "top_purine", label: "ค่าพิวรีน มาก -> น้อย" },
                                                                 { value: "low_purine", label: "ค่าพิวรีน น้อย -> มาก" }
                                                            ]}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* switch role */}
                                   <div className='above-table'>
                                        <p>รวมทั้งหมด {activeButton === 'ทั้งหมด' ? menus.length : menusUser.length} เมนูอาหาร</p>
                                        <div className='switch-btn'>
                                             <button 
                                                  onClick={() => setActiveButton('ทั้งหมด')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ทั้งหมด' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ทั้งหมด' ? 'white' : 'black'
                                                  }}>ทั้งหมด</button>
                                             <button 
                                                  onClick={() => {setActiveButton('ของฉัน')}}
                                                  style={{
                                                       backgroundColor: activeButton === 'ของฉัน' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ของฉัน' ? 'white' : 'black'
                                                  }}>ของฉัน</button>
                                        </div>
                                   </div>

                                   {/* data rendering */}
                                   <div className='menu-render'>
                                        {activeButton === 'ทั้งหมด' ? (
                                             filterDisplay.length > 0 ? (
                                                  filterDisplay.map(item => renderItem(item))
                                             ) : (
                                                  <h2>ยังไม่มีข้อมูลอาหาร</h2>
                                             )
                                        ) : (
                                             menusUser.length > 0 ? (
                                                  menusUser.map(item => renderItem(item))
                                             ) : (
                                                  <h2>ยังไม่มีข้อมูลอาหารของคุณ</h2>
                                             )
                                        )}
                                   </div>
                              </div>
                         </div>                         
                    </div>
                    
               </div>
          </>
     )
}

export default MenuScreenAdmin
