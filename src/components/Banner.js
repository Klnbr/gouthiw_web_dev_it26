import React from 'react'
import '../App.css';

function Banner(props) {
     return (
          <>
               <div className={props.cName}>
                    <img alt='banner pic' className='banner-img' src='https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/health/wp-content/uploads/2022/01/foods_to_eat_to_lose_weight.jpeg' />

                    <div className='banner-text'>
                         <h1>Gouthiw for gout nutr</h1>
                         <p>adgyaigdiuahdy;oaiufhdeoiudfioudiwioufc</p>
                         <a href='/menus'>Create Menu</a>
                    </div>
               </div>
          </>
     )
}

export default Banner
