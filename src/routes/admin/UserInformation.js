import React, { useState, useEffect } from "react";
import { useAuth } from "../../middleware/Auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import '../../components/profile.css'

function UserInformation() {
       const navigate = useNavigate();
         const { nutrData } = useAuth();
     
         const [menusUser, setMenusUser] = useState([]);
     
         const [dropdownVisible, setDropdownVisible] = useState(null);
     
         const toggleDropdown = (menuId) => {
             setDropdownVisible(dropdownVisible === menuId ? null : menuId);
         };
         const [ setUser] = useState("");

         useEffect(() => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
                return;
            }
             const fetchUserData = async () => {
                 try {
                      const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/users", { timeout: 1000 });
                      setUser(response.data);
                 } catch (error) {
                      console.log("Error fetching menus data", error.message)
                 }
            }
     
             const fetchMenuDataUser = async () => {
                  try {
                       const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/menus/auth/${nutrData._id}`, { timeout: 1000 });
                       console.log(response.data)
                       setMenusUser(response.data);
     
                  } catch (error) {
                     console.log("Error fetching menus data", error.message)
                  }
             }
             fetchMenuDataUser();
             fetchUserData();
         }, [nutrData, navigate]);
     
         const renderItem = (item) => (
             <div className='menu-card' key={item._id}>
                 <i className="fa-solid fa-ellipsis-vertical" onClick={() => toggleDropdown(item._id)}></i>
                 {dropdownVisible === item._id && (
                     <div className='dropdown-menu-card'>
                         <button onClick={() => handleItemPress(item._id)}>แก้ไข</button>
                         <button onClick={() => handleDelete(item._id)}>ลบ</button>
                     </div>
                 )}
                 <img className='menu-pic' alt={`รูปภาพของ ${item.menuName}`} src={item.image} loading="lazy"/>
                 <h1>{item.menuName}</h1>
                 <div className='layout'>
                     <p className='purine'>พิวรีน: {item.purine_total}</p>
                     <p className='uric'>กรดยูริก: {item.uric_total}</p>
                 </div>
             </div>
         );
     
         const handleItemPress = async (itemId) => {
             try {
                  const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/menu/${itemId}`);
                  const menuData = response.data;
     
                  navigate('/menu', { state: { menuData } });
             } catch (error) {
                  console.log('Error fetching menu data', error.message);
             }
        }; 
     
         const handleDelete = async (itemId) => {
             try {
                  const response = await axios.delete(`https://gouthiw-web-dev-it26.onrender.com/menu/${itemId}`);
                  if (response.status === 200) {
                       alert("ลบสำเร็จ");
                       navigate('/menus');
                  }
             } catch (error) {
                  console.log('Error fetching menu data', error.message);
             }
         };
     
         return (
          <>
              <div className="container">
                  <Navbar />
                  <div className="content-no-sidebar">
                      <button className="btn-goback" onClick={() => navigate(-1)}>
                          <i className="fa-solid fa-angle-left"></i>
                      </button>
                      <div className="profile-image-background">
                          <img
                              src={nutrData.image_background}
                              alt={`${nutrData.image_background}`}
                              loading="lazy"
                              />
                      </div>
                      <div className="profile-layout">
                          <div className="profile-info">
                                  <img
                                      className="profile-image"
                                      src={nutrData.image_profile}
                                      alt={`${nutrData.firstname} ${nutrData.lastname}`}
                                      loading="lazy"
                                      /> 
                              <p className="name">{nutrData.firstname} {nutrData.lastname}</p>
  
                              <div className="profile-info-layout">
                                  <p>อีเมล:</p>
                                  <p className="email">{nutrData.email}</p>
                              </div>
  
                              <hr className="hr-line-90"/>
                              <div className="profile-info-layout">
                                  <p>เลขใบประกอบวิชาชีพ:</p>
                                  <p className="email">{nutrData.license_number}</p>
                              </div>
  
                              <hr className="hr-line-90"/>
                              <div className="profile-info-layout">
                                  <p>เบอร์โทรศัพท์:</p>
                                  <p className="email">{nutrData.tel}</p>
                              </div>
                              <hr className="hr-line-90"/>
  
                              <button className="profile-btn" onClick={() => navigate('/profile-edit')}>
                                  แก้ไขข้อมูลส่วนตัว
                                  <i className="fa-regular fa-pen-to-square"></i>
                              </button>
                          </div>
  
                          <div className="profile-context">
                              <p>{nutrData.firstname} {nutrData.lastname}</p>
                              <p className="info">{nutrData.email}</p>   
                              
                          </div>
                      </div>  
  
                      <div className="profile-content">
                          <p className="head">เมนูอาหารของคุณ</p>
                          <div>
                              <p></p>
                          </div>
                          <div className='profile-menu-content'>
                              {menusUser.length > 5 && (
                                  <>
                                      <a href="/">ดูทั้งหมด</a> 
                                  </>
                              )}
                              {menusUser.length > 0 ? (
                                  <>
                                      {menusUser.map(item => renderItem(item))}
                                  </> 
                              ) : (
                                  <p>ยังไม่มีเมนูอาหารของคุณ</p>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </>
      );
}

export default UserInformation