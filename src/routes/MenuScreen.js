import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middleware/Auth';
import axios from 'axios';
import '../../src/components/menu.css'

function MenuScreen() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();

     const [menus, setMenus] = useState([]);
     const [menusUser, setMenusUser] = useState([]);

     const [searchMenu, setSearchMenu] = useState('');

     const [dropdownVisible, setDropdownVisible] = useState(null);

     const toggleDropdown = (menuId) => {
          setDropdownVisible(dropdownVisible === menuId ? null : menuId);
     };

     useEffect(() => {
          const fetchMenuData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/menus", { timeout: 10000 });
                    setMenus(response.data);
               } catch (error) {
                    console.log("Error fetching menus data", error.message)
               }
          }
          const fetchMenuDataUser = async () => {
               try {
                    const response = await axios.get(`http://localhost:5500/menus/auth/${nutrData._id}`, { timeout: 10000 });
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
          menu.menuName.includes(searchMenu)
     );

     const handleItemPress = async (itemId) => {
          try {
               console.log("Item ID:", itemId);
               const response = await axios.get(`http://localhost:5500/menu/${itemId}`);
               const menuData = response.data;

               console.log("Fetched Menu Data:", menuData);
               navigate('/menu-detail', { state: { menuData } });
          } catch (error) {
               console.log('Error fetching menu data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='menu-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='menu-pic' alt={`รูปภาพของ ${item.menuName}`} src={item.image} />
               <h1>{item.menuName}</h1>
               <div className='layout'>
                    <p className='purine'>พิวรีน: {item.purine_total}</p>
                    <p className='uric'>กรดยูริก: {item.uric_total}</p>
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
                              <div className='menu-manage'>
                                   <div className='menu-search'>
                                        <div className='menu-search-wrapper'>
                                             <i className="fa-solid fa-magnifying-glass menu-search-icon"></i>
                                             <input 
                                                  type='text' 
                                                  placeholder='ค้นหาเมนูอาหารที่นี่' 
                                                  onChange={(e) => setSearchMenu(e.target.value)}
                                                  className='menu-search-input' />
                                        </div> 
                                   </div>
                                   <button className='add-menu-btn' onClick={() => navigate('/menu')}>
                                        <i className="fa-solid fa-plus"> เพิ่มอาหารของคุณ</i>
                                   </button>
                              </div>
                              
                              <div className='menu-content'>                              
                                   {filteredMenus.length > 0 ? (
                                        filteredMenus.map(item => renderItem(item))
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
