import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/SideBar/SideBar";
import "../App.css";
import { useAuth } from "../middleware/Auth";
import { useNavigate } from "react-router-dom";
import HomeBanner from "../images/homebanner.jpg";
import axios from 'axios';

function HomeScreen() {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
     const fetchMenuData = async () => {
          try {
               const response = await axios.get("http://localhost:5500/menus", { timeout: 10000 });
               setMenus(response.data);
          } catch (error) {
               console.log("Error fetching menus data", error.message)
          }
     }
     fetchMenuData()
  })

  return (
    <>
      <div className="container">
        <SideBar />
        <div className="content">
          <div className="nav">
            <Navbar />
          </div>
          <div class="main-content">
            <div className="dashboard">
              <div class="show-all-food">
              <h2>เมนูอาหารทั้งหมด</h2>
              <p>45</p>
              </div>
              <div class="show-all-wtd">
               <h2>วัตถุดิบทั้งหมด</h2>
               <p>45</p>
              </div>
              <div class="show-all-triv">
               <h2>เกร็ดความรู้ทั้งหมด</h2>
               <p>56</p>
              </div>
              <div class="show-all-topic">
               <h2>กระทู้ทั้งหมด</h2>
               <p>67</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
