import React from 'react'
import './MenuDetailScreen.css'
import { useLocation } from 'react-router-dom';

function MenuDetailScreen() {
     const location = useLocation();
     const { menuData } = location.state || {};
     return (
          <>
               <div className='container'>
                    <div className='menu-detail-card'>
                         <div className='menu-detail-content'>
                              <div className='menu-detail-flex'>
                                   <h1>เมนู: {menuData.menuName}</h1>
                                   <h2>{menuData.category}</h2>
                              </div>
                              <img src={menuData.image} alt='' />
                              <div className='menu-detail-flex'>
                                   <p>พิวรีน: {menuData.purine}</p>
                                   <p>กรดยูริก: {menuData.uric}</p>
                              </div>
                              <div>
                                   <h2>วัตถุดิบ:</h2>
                                   <table>
                                        {menuData.ingredients.map((item, index) => (
                                             <tr key={index}>
                                                  <td>{item.ingrName}</td>
                                                  <td>{item.ingrQty}</td>
                                                  <td>{item.ingrUnit}</td>
                                             </tr>
                                        ))}  
                                   </table>
                              </div>
                              <div>
                                   <h2>วิธีทำ:</h2>
                                   {menuData.method.map((step, index) => (
                                        <div className='menu-detail-method' key={index}>
                                             <p>{index+1}.</p>
                                             <p>{step}</p> 
                                        </div>
                                   ))} 
                              </div>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default MenuDetailScreen