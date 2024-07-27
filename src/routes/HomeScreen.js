import React from 'react'
import Navbar from '../components/Navbar'
import '../App.css'
import { useAuth } from '../middleware/Auth';

function HomeScreen() {
     const { userData, logout } = useAuth();

     return (
          <>
               <Navbar/>
               <div class="banner-img">
                    <img alt='Banner gouthiw' src='../public/Banner.jpeg' />
               </div>

               <div class="banner-text">
                    <h2>Gouthiw, gout diet management for nutritionist</h2>
                    <h1>I am {userData ? `${userData.firstname} ${userData.lastname}` : 'John Doe'}</h1>
                    <button onClick={logout}>Log out</button>
               </div>
          </>
     )
}

export default HomeScreen
