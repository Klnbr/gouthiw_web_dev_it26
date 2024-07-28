import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import '../App.css'
import { useAuth } from '../middleware/Auth';
import { useNavigate } from 'react-router-dom';
import HomeBanner from '../images/Banner.jpeg'

function HomeScreen() {
     const navigate = useNavigate();
     const { userData, logout } = useAuth();

     return (
          <>
               <div className='container'>
                    <SideBar />
                    <div className='content'>
                         <div className='nav'>
                              <Navbar />
                         </div>
                         <div className='main-content'>
                              <div className='home-content'>
                                   <div class="banner-img">
                                        <img alt='Banner gouthiw' src={HomeBanner} />
                                   </div>

                                   <div class="banner-text">
                                        <h1>Gouthiw, gout diet management for nutritionist</h1>
                                        <p>
                                             Lorem Ipsum is simply dummy text of the printing and 
                                             typesetting industry. Lorem Ipsum has been the industry's 
                                             standard dummy text ever since the 1500s, when an unknown 
                                             printer took a galley of type and scrambled it to make a 
                                             type specimen book. It has survived not only five centuries, 
                                             but also the leap into electronic typesetting, remaining 
                                             essentially unchanged.
                                        </p>
                                        <button onClick={() => navigate('/menus')}>
                                             Create your menu
                                             
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default HomeScreen
