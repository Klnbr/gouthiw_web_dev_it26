import React, { Component, useState } from 'react'
import './SideBar.css'
import { Link, useLocation } from "react-router-dom";
import { MenuItems } from '../MenuItems';
import SidebarLogo from '../../images/logo_temporary.png'
import SidebarBottom from '../../images/bottom_nav2.png'

function SideBar () {
     const location = useLocation();
     return (
          <div className='side-bar--container'>
               <div className='side-bar--content'>
                    <img className='side-bar--logo' alt='' src={SidebarLogo} />
                         {/* <div className='menu-icons' onClick={this.handleClick}>
                              <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                         </div> */}

                    <div className='side-bar--menu'>
                         { MenuItems.map((item, index) => {
                              return (
                                   <li className={location.pathname === item.url ? 'side-bar--focus' : 'side-bar--links'} key={index}>
                                        <Link className='side-bar--item' to={item.url}>
                                             <i className={item.icon}></i>
                                             <span className='side-bar--title'>{item.title}</span>
                                        </Link>
                                   </li>
                              )
                         })}
                         {/* <button className='button' to='/signup'>Sign up</button> */}
                    </div>
               </div>
               <img className='side-bar--btm' alt='' src={SidebarBottom} />
          </div>
     )
}

export default SideBar;