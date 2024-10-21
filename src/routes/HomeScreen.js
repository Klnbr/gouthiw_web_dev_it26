import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/SideBar/SideBar";
import "../App.css";
import { useAuth } from "../middleware/Auth";
import { useNavigate } from "react-router-dom";
import HomeBanner from "../images/homebanner.jpg";
import axios from "axios";

function HomeScreen() {
    const navigate = useNavigate();
    const { nutrData, logout } = useAuth();
    const [menus, setMenus] = useState([]);
    const [ingrs, setIngrs] = useState([]);
    const [trivs, setTrivs] = useState([]);
    const [topics, setTopics] = useState([]);

    console.log("menus: ", menus);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res_menus = await axios.get("http://localhost:5500/menus", {
                    timeout: 10000,
                });
                const res_ingrs = await axios.get("http://localhost:5500/ingrs", {
                    timeout: 10000,
                });
                const res_trivs = await axios.get("http://localhost:5500/trivias", {
                    timeout: 10000,
                });
                const res_topics = await axios.get("http://localhost:5500/topics", {
                    timeout: 10000,
                });
                setMenus(res_menus.data);
                setIngrs(res_ingrs.data);
                setTrivs(res_trivs.data);
                setTopics(res_topics.data);
            } catch (error) {
                console.log("Error fetching data", error.message);
            }
        };
        fetchData();
    });

    return (
        <>
            <div className="container">
                <Navbar />
                <div className='sidebar-content-wrapper'>
                    <SideBar />
                    <div className="content">
                        <div className="head-content--home">
                            <img
                                className="image-home"
                                src="https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/01/25180542/shutterstock_1545283778-1.jpg"
                                alt="head image"
                                />
                            <div className="text-over-image">
                                สร้างเมนูอาหารที่ปลอดภัย
                                <br />
                                ต่อผู้ป่วยโรคเกาต์
                            </div>
                            <p className="text-descript-over-image">
                                เนื่องจากโรคเกาต์เป็นโรคที่ต้องใส่ใจในการควบคุมสารอาหารบางชนิด เช่น พิวรีน ซึ่งเป็นสารอาหารที่รับประทานเข้าไปแล้วถูกแปลงเป็นกรดยูริก 
                                เมื่อมีกรดยูริกในเลือดมากเกินไปจนร่างกายขับออกไม่ทัน จะทำให้กรดนั้นจับตัวเป็นก้อนตามข้อต่างๆของร่างกาย ผู้ป่วยจึงควรหลีกเลี่ยงอาหารที่มีค่าพิวรีนสูง 
                                เพื่อควบคุมอาการของโรค 
                            </p>
                            <div className="btn-over-image">
                                <button>สร้างเมนูของคุณ</button>
                            </div>
                        </div>

                        <p className="home-text-description">
                            เนื่องจากโรคเกาต์เป็นโรคที่ต้องใส่ใจในการควบคุมสารอาหารบางชนิด เช่น พิวรีน ซึ่งเป็นสารอาหารที่รับประทานเข้าไปแล้วถูกแปลงเป็นกรดยูริก 
                            เมื่อมีกรดยูริกในเลือดมากเกินไปจนร่างกายขับออกไม่ทัน จะทำให้กรดนั้นจับตัวเป็นก้อนตามข้อต่างๆของร่างกาย ผู้ป่วยจึงควรหลีกเลี่ยงอาหารที่มีค่าพิวรีนสูง 
                            เพื่อควบคุมอาการของโรค 
                        </p>

                        <div className="home-content">
                            <div>
                                <div className="home-content-i">
                                    <i className="fa-solid fa-burger"></i>
                                </div>
                                <p>เมนูอาหาร</p>
                                <p>สร้างสรรค์เมนูอาหารที่มีค่าพิวรีนต่ำและก่อให้เกิดกรดยูริกในร่างกายน้อย</p>
                                <h2>{menus.length}</h2>
                            </div>
                            <div>
                                <div className="home-content-i">
                                    <i className="fa-solid fa-shrimp"></i>
                                </div>
                                <p>วัตถุดิบ</p>
                                <p>เพิ่มรายการวัตถุดิบพร้อมค่าพิวรีนที่ได้รับและกรดยูริกที่จะเกิดในร่างกายโดยประมาณ</p>
                                <h2>{ingrs.length}</h2>
                            </div>
                            <div>
                                <div className="home-content-i">
                                    <i className="fa-solid fa-book"></i>
                                </div>
                                <p>เกร็ดความรู้</p>
                                <p>ข้อมูลเกี่ยวกับเกาต์ที่จะช่วยให้ผู้ป่วยเข้าใจโรคและเฝ้าระวังรวมถึงรักษาเบื้องต้นอย่างถูกวิธี</p>
                                <h2>{trivs.length}</h2>
                            </div>
                            <div>
                                <div className="home-content-i">
                                    <i className="fa-solid fa-question"></i>
                                </div>
                                <p>กระทู้</p>
                                <p>ตอบคำถามจากผู้ป่วยเพื่อให้ผู้ป่วยได้รับคำแนะนำที่ถูกต้องจากผู้เชี่ยวชาญ</p>
                                <h2>{topics.length}</h2>
                            </div>
                        </div>
                    </div>    
                </div>
                
            </div>
        </>
    );
}

export default HomeScreen;
