import React from 'react'
import Navbar from '../components/Navbar/Navbar'

function Welcome() {
     return (
          <>
               <div className='container'>
                    <Navbar />
                    <img
                         className="image-home"
                         src="https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2021/01/25180542/shutterstock_1545283778-1.jpg"
                         alt="head image"
                         />
               </div>
          </>
     )
}

export default Welcome