import React from 'react'
import Navbar from '../components/Navbar'
import '.././App.css'

function MenuScreen({ navigation }) {
     return (
          <>
               <Navbar/>
               <div className='menu-block'>
                    <div className='add-menu-card' onClick={() => navigation.navigate('/menus/addmenu')}>
                         <i class="fa-solid fa-plus" cl></i>
                    </div>
                    <div className='menu-card'>
                         <img className='menu-pic' alt='ไข่เจียวกุ้ง' src='https://img.wongnai.com/p/800x0/2018/10/22/ce894b08df4649d6847a600b53a685e1.jpg' />
                         <h1>ไข่เจียวกุ้ง</h1>
                         <div className='layout'>
                              <p className='purine'>พิวรีน: 000</p>
                              <p className='uric'>กรดยูริก: 000</p>
                         </div>
                    </div>
                    <div className='menu-card'>
                         <img className='menu-pic' alt='ไข่เจียวกุ้ง' src='https://img.wongnai.com/p/800x0/2018/10/22/ce894b08df4649d6847a600b53a685e1.jpg' />
                         <h1>ไข่เจียวกุ้ง</h1>
                         <div className='layout'>
                              <p className='purine'>พิวรีน: 000</p>
                              <p className='uric'>กรดยูริก: 000</p>
                         </div>
                    </div>
                    <div className='menu-card'>
                         <img className='menu-pic' alt='ไข่เจียวกุ้ง' src='https://img.wongnai.com/p/800x0/2018/10/22/ce894b08df4649d6847a600b53a685e1.jpg' />
                         <h1>ไข่เจียวกุ้ง</h1>
                         <div className='layout'>
                              <p className='purine'>พิวรีน: 000</p>
                              <p className='uric'>กรดยูริก: 000</p>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default MenuScreen
