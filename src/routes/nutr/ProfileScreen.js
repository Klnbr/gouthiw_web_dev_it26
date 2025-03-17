import React, { useState, useEffect } from "react";
import { useAuth } from "../../middleware/Auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import '../../components/profile.css'

function ProfileScreen() {
    const navigate = useNavigate();
    const { nutrData } = useAuth();

    const [menusUser, setMenusUser] = useState([]);

    const [dropdownVisible, setDropdownVisible] = useState(null);

    const toggleDropdown = (menuId) => {
        setDropdownVisible(dropdownVisible === menuId ? null : menuId);
    };
    const [user, setUser] = useState("");

  

      const [ingrsNutr, setIngrsNutr] = useState([]);
       const [trivsUser, setTriviaUser] = useState([]);
    const [ans, setAns] = useState([]);
    const [menus, setMenu] = useState([]);
    const [ingrs, setIngrs] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    throw new Error("No auth token found");
                }  
                
                try {
                    const response = await axios.get('http://${ipAddress}:3000/user/${userId}');
                    setUser(response.data);
    
                } catch (error) {
                    console.error("Error decoding token:", error.message);
                    throw new Error("Failed to decode token");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };
        const fetchTriviaDataUser = async () => {
            try {
                 const response = await axios.get(`http://localhost:5500/trivias/auth/${nutrData._id}`, { timeout: 10000 });
                 setTriviaUser(response.data);
            } catch (error) {
                 console.log("Error fetching trivias data", error.message)
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
        const fetchIngrNutrData = async () => {
            try {
                const response = await axios.get(`http://localhost:5500/ingrs/auth/${nutrData._id}`, { timeout: 10000 });
                setIngrsNutr(response.data);  // เก็บข้อมูลที่ดึงมา
            } catch (error) {
                console.log("Error fetching ingrs data", error.message);
            }
        };

        const fetchRepliedTopics = async () => {
            try {
                const response = await axios.get(`http://localhost:5500/topics/replied-by/${nutrData._id}`);
                setAns(response.data);  // ใช้ count จาก API ที่ตอบกลับมา
            } catch (error) {
                console.log("Error fetching replied topics:", error.message);
            }
        };
        

        fetchRepliedTopics();
        fetchIngrNutrData();
        fetchMenuDataUser();
        fetchUsers();
        fetchTriviaDataUser();
    }, [nutrData, user])

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
                    <button className="btn-goback" onClick={() => navigate("/home")}>
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

                            <hr className="hr-line-90" />
                            <div className="profile-info-layout">
                                <p>เลขใบประกอบวิชาชีพ:</p>
                                <p className="email">{nutrData.license_number}</p>
                            </div>

                            <hr className="hr-line-90" />
                            <div className="profile-info-layout">
                                <p>เบอร์โทรศัพท์:</p>
                                <p className="email">{nutrData.tel}</p>
                            </div>
                            <hr className="hr-line-90" />

                            <button className="profile-btn" onClick={() => navigate('/profile-edit')}>
                                แก้ไขข้อมูลส่วนตัว
                                <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>

                        <div className="profile-context">
                            <div className="profile-context-layout">
                                <i class="fa-solid fa-burger"></i>
                                <p  className="user-info"> เมนูอาหารของฉัน </p>
                                <p>{menusUser.length}</p>
                            </div>
                            <hr className="hr-line-100" />
                            <div className="profile-context-layout">
                                <i class="fa-solid fa-carrot"></i>
                                <p className="user-info"> วัตถุดิบของฉัน </p>
                                <p>{ingrsNutr.length} </p>

                            </div>
                            <hr className="hr-line-100" />
                            <div className="profile-context-layout">
                                <i class="fa-solid fa-book"></i>
                                <p className="user-info">เกร็ดความรู้ของฉัน</p>
                                <p>{trivsUser.length} </p>
                            </div>
                            <hr className="hr-line-100" />
                            <div className="profile-context-layout">
                                <i class="fa-solid fa-question"  ></i>
                                <p className="user-info">การตอบกลับกระทู้ของฉัน</p>
                                <p>{ans.count || 0}</p>
                            </div>
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

export default ProfileScreen;
