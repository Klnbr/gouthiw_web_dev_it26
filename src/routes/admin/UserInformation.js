import React, { useState, useEffect } from "react";
import { useAuth } from "../../middleware/Auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import axios from "axios";
import '../../components/profile.css'
import ImgProfile from '../../images/homebanner.jpg'

function UserInformation() {
       const navigate = useNavigate();
         const { nutrData } = useAuth();
     
         const [menusUser, setMenusUser] = useState([]);
     
         const [dropdownVisible, setDropdownVisible] = useState(null);
     
         const toggleDropdown = (menuId) => {
             setDropdownVisible(dropdownVisible === menuId ? null : menuId);
         };
         const [user, setUser] = useState("");
     
         const [firstname, setFirstname] = useState("");
         const [lastname, setLastname] = useState("");
         const [license_number, setLicense_number] = useState("");
         const [tel, setTel] = useState("");
         const [email, setEmail] = useState("");
         const [password, setPassword] = useState("");
     
         useEffect(() => {
             const fetchUserData = async () => {
                 try {
                      const response = await axios.get("http://localhost:5500/users", { timeout: 10000 });
                      setUser(response.data);
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
             fetchMenuDataUser();
             fetchUserData();
         }, [nutrData])
     
         const renderItem = (item) => (
             <div className='menu-card' key={item._id}>
                 <i className="fa-solid fa-ellipsis-vertical" onClick={() => toggleDropdown(item._id)}></i>
                 {dropdownVisible === item._id && (
                     <div className='dropdown-menu-card'>
                         <button onClick={() => handleItemPress(item._id)}>แก้ไข</button>
                         <button onClick={() => handleDelete(item._id)}>ลบ</button>
                     </div>
                 )}
                 <img className='menu-pic' alt={`รูปภาพของ ${item.menuName}`} src={item.image} />
                 <h1>{item.menuName}</h1>
                 <div className='layout'>
                     <p className='purine'>พิวรีน: {item.purine_total}</p>
                     <p className='uric'>กรดยูริก: {item.uric_total}</p>
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
     
         const handleDelete = async (itemId) => {
             try {
                  const response = await axios.delete(`http://localhost:5500/menu/${itemId}`);
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
                              />
                      </div>
                      <div className="profile-layout">
                          <div className="profile-info">
                                  <img
                                      className="profile-image"
                                      src={nutrData.image_profile}
                                      alt={`${nutrData.firstname} ${nutrData.lastname}`}
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