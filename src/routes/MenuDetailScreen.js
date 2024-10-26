import React from 'react'
import '../components/Detail.css'
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar'

function MenuDetailScreen() {
     const location = useLocation();
     const { menuData } = location.state || {};
     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='content-no-sidebar'>
                         <div className='menu-detail-content'>
                              <div className='card-left'>
                                   <div className='menu-detail-flex'>
                                        <h1>{menuData.menuName}</h1>
                                        <h2>ประเภท: {menuData.category}</h2>
                                   </div>
                                   <img src={menuData.image} alt='' />
                                   <div className='menu-detail-flex'>
                                        <p>พิวรีน (โดยเฉลี่ย) :</p>
                                        <p>{menuData.purine_total} มิลลิกรัม</p>
                                   </div>
                                   <div className='menu-detail-flex'>
                                        <p>กรดยูริก (โดยเฉลี่ย) :</p>
                                        <p>{menuData.uric_total} มิลลิกรัม</p>
                                   </div>
                              </div>
                              <div className='card-right'>
                                   <div>
                                        <h3>วัตถุดิบ:</h3>
                                        <table>
                                             {menuData.ingredients.map((ingr, index) => (
                                                  <tr key={index}>
                                                       <td>{menuData.ingrDetails[index]?.name}</td>
                                                       <td>{ingr.qty}</td>
                                                       <td>{ingr.unit}</td>
                                                  </tr>
                                             ))}  
                                        </table>
                                   </div>
                                   <div>
                                        <h3>วิธีทำ:</h3>
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
               </div>
          </>
     )
}

export default MenuDetailScreen