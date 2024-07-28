import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TopicScreen() {
     return (
          <>
               <div className='container'>
                    <SideBar />
                    <div className='content'>
                         <div className='nav'>
                              <Navbar />
                         </div>
                         <div className='main-content'>
                              <h1>TopicScreen</h1>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default TopicScreen
