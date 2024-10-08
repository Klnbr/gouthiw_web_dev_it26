import React, { Component, useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';
import { MenuItems } from './MenuItems';

class Navbar extends Component {
     state = { clicked: false }

     handleClick = () => {
          this.setState({ clicked: !this.state.clicked })
     }
     render() {
          return (
               <nav className='Nav-container'>
                    <h1 className='Nav-logo'>GOUTHIW</h1>

                    <div className='menu-icons' onClick={this.handleClick}>
                         <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                    </div>

                    <ul className={ this.state.clicked ? 'Nav-menu active' : 'Nav-menu' }>
                         { MenuItems.map((item, index) => {
                              return (
                                   <li key={index}>
                                        <Link className={item.cName} to={item.url}>
                                             <i className={item.icon}></i>{item.title}
                                        </Link>
                                   </li>
                              )
                         })}
                         <button className='button' to='/signup'>Sign up</button>
                    </ul>
               </nav>
          )
     }
}

export default Navbar;

// function Navbar() {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Navbar
