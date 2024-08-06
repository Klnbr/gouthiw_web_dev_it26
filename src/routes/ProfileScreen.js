import React, { useState, useEffect } from "react";
import { useAuth } from "../middleware/Auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/SideBar/SideBar";
import axios from "axios";

function ProfileScreen() {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [license_number, setLicense_number] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (userData) {
      console.log("userData: ", userData);
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setLicense_number(userData.license_number);
      setTel(userData.tel);
      setEmail(userData.email);
      setPassword(userData.password);
    }
  }, [userData]);

  const handleUpdateProfile = async () => {
    if (!userData || !userData._id) {
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
        `http://localhost:5500/user/${userData._id}`,
        updateData
      );

      console.log("User updated", response.data);

      if (response.status === 200) {
        alert("แก้ไขสำเร็จ");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error updating user:", error.response || error.message);
      alert(
        "แก้ไขไม่สำเร็จ: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <>
      <div className="container">
        <SideBar />
        <div className="content">
          <div className="nav">
            <Navbar />
          </div>
          <div className="main-content">
            <div className="profile-card">
              {userData && (
                <>
                  <h1>Profile</h1>
                  <div className="profile-content">
                    <div className="profile-image">
                      <img
                        src={userData.image_profile}
                        alt={`${userData.firstname} ${userData.lastname}`}
                      />
                      <p>ชื่อ:</p>
                      <input
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                      <p>นามสกุล:</p>
                      <input
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </div>

                    <div className="profile-data">
                      <p>เลขใบประกอบวิชาชีพ:</p>
                      <input
                        name="license_number"
                        value={license_number}
                        onChange={(e) => setLicense_number(e.target.value)}
                      />

                      <p>เบอร์โทรศัพท์:</p>
                      <input
                        name="tel"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                      />

                      <p>อีเมล:</p>
                      <input
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                      <p>รหัสผ่าน (ถ้าต้องการเปลี่ยน):</p>
                      <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="edt-profile-btn"
                    onClick={handleUpdateProfile}
                  >
                    บันทึก
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileScreen;
