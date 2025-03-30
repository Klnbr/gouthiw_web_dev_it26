import React, { useState, useEffect } from "react";
import { useAuth } from "../../middleware/Auth";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import axios from "axios";
import "../../components/profile.css"

function EditProfile() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();

     const [ setUser] = useState("");
     const [firstname, setFirstname] = useState("");
     const [lastname, setLastname] = useState("");
     const [license_number, setLicense_number] = useState("");
     const [tel, setTel] = useState("");
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");

     useEffect(() => {
          const token = localStorage.getItem("authToken");
          if (!token) {
              navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
              return;
          }
          const fetchUserData = async () => {
               try {
                    const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/nutrs", { timeout: 1000 });
                    setUser(response.data);
               } catch (error) {
                    console.log("Error fetching menus data", error.message);
               }
          };

          if (nutrData) {
               console.log("nutrData: ", nutrData);
               setFirstname(nutrData.firstname);
               setLastname(nutrData.lastname);
               setLicense_number(nutrData.license_number);
               setTel(nutrData.tel);
               setEmail(nutrData.email);
               setPassword(nutrData.password);
          }

          fetchUserData();
     }, [nutrData, navigate]);

   

     const handleUpdateProfile = async () => {
          if (!nutrData || !nutrData._id) {
               alert("User ID is not available.");
               return;
          }
     
          try {
               const updateData = {
                    firstname,
                    lastname,
                    license_number,
                    tel,
                    email,
                    ...(password ? { password } : {}),
               };
     
               console.log("Updated User Data:", updateData);
     
               const response = await axios.put(
                    `https://gouthiw-web-dev-it26.onrender.com/nutrs/${nutrData._id}`, updateData
               );
     
               console.log("User updated", response.data);
     
               if (response.status === 200) {
                    alert("แก้ไขสำเร็จ");
                    
                    // อัปเดต state ของ user ที่ React ใช้แสดงผล
                    setUser((prevUser) => ({
                         ...prevUser,
                         ...updateData,
                    }));
                    
                    navigate("/profile");
               } else {
                    alert("การอัปเดตไม่สำเร็จ");
               }
          } catch (error) {
               console.error("Error updating user:", error.response || error.message);
               alert("แก้ไขไม่สำเร็จ: " + (error.response?.data?.message || error.message));
          }
     };
     

     return (
          <>
               <div className="container">
                    <SideBar />
                    <div className="content">
                         <div className="nav">
                              {/* <Navbar /> */}
                         </div>
                         <div className="main-content">
                              <div className="profile-card">

                                   {nutrData && (
                                        <>
                                             <div className="profile-content--edit">
                                                  <h1>แก้ไขข้อมูลส่วนตัว</h1>
                                                  <div className="profile--edit">
                                                       <div className="profile-image--edit">
                                                            <img
                                                            loading="lazy"
                                                                 src={nutrData.image_profile}
                                                                 alt={`${nutrData.firstname} ${nutrData.lastname}`}
                                                            />
                                                            <button className="profile-image--upload">
                                                                 อัปโหลดรูปโปรไฟล์
                                                            </button>
                                                            <button className="profile-image--remove">
                                                                 นำรูปโปรไฟล์ออก
                                                            </button>
                                                       </div>

                                                       <hr className="hr-line" />
                                                  </div>

                                                  <div className="profile-data">
                                                       <div>
                                                            <p>ชื่อ:</p>
                                                            <input
                                                                 name="firstname"
                                                                 value={firstname}
                                                                 onChange={(e) => setFirstname(e.target.value)}
                                                            />
                                                       </div>
                                                       <div>
                                                            <p>นามสกุล:</p>
                                                            <input
                                                                 name="lastname"
                                                                 value={lastname}
                                                                 onChange={(e) => setLastname(e.target.value)}
                                                            />
                                                       </div>

                                                  </div>

                                                  <div className="profile-data">
                                                       <div>
                                                            <p>เลขใบประกอบวิชาชีพ:</p>
                                                            <input
                                                                 name="license_number"
                                                                 value={license_number}
                                                                 onChange={(e) => setLicense_number(e.target.value)}
                                                            />
                                                       </div>
                                                       <div>
                                                            <p>เบอร์โทรศัพท์:</p>
                                                            <input
                                                                 name="tel"
                                                                 value={tel}
                                                                 onChange={(e) => setTel(e.target.value)}
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="profile-data">
                                                       <div>
                                                            <p>อีเมล:</p>
                                                            <input
                                                                 name="email"
                                                                 value={email}
                                                                 onChange={(e) => setEmail(e.target.value)}
                                                            />
                                                       </div>
                                                       <div>
                                                            <p>รหัสผ่าน (ถ้าต้องการเปลี่ยน):</p>
                                                            <input
                                                                 name="password"
                                                                 type="password"
                                                                 value={password}
                                                                 onChange={(e) => setPassword(e.target.value)}
                                                            />
                                                       </div>

                                                  </div>
                                                  <button className="edt-profile-btn" onClick={handleUpdateProfile}>บันทึกข้อมูล</button>
                                             </div>
                                        </>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default EditProfile