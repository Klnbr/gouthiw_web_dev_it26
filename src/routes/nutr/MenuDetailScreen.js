import React, { useEffect, useState } from 'react';
import '../../components/Detail.css';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../middleware/Auth';
import axios from 'axios';

function MenuDetailScreen() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();
     const location = useLocation();
     const { menuData } = location.state || {};
     const [setMenu] = useState([]);
     const [editButton, setEditButton] = useState(false);

     useEffect(() => {
          const fetchMenu = async () => {
               try {
                    const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/menus/auth/${nutrData._id}`, { timeout: 1000 });
                    setMenu(response.data);

                    if (menuData && response.data.some((menuItem) => menuItem._id === menuData._id)) {
                         setEditButton(true);
                    } else {
                         setEditButton(false);
                    }
               } catch (error) {
                    console.log("Error fetching menus data", error.message);
               }
          };

          if (nutrData?._id && menuData?._id) {
               fetchMenu();
          }
     }, [nutrData, menuData]);

     const handleItemDelete = async (itemId) => {
          const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
          if (!confirmDelete) {
               return; // ถ้าไม่ยืนยัน จะไม่ทำการลบ
          }

          try {
               const response = await axios.delete(`https://gouthiw-web-dev-it26.onrender.com/menu/${itemId}`);

               if (response.status === 200) {
                    alert("ลบสำเร็จ");
                    const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/menus", { timeout: 1000 });
                    setMenu(response.data);
                    navigate('/menus');
               }
          } catch (error) {
               console.log('Error deleting menu', error);
          }
     };


     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='content-no-sidebar'>
                         <button className="btn-goback" onClick={() => navigate(-1)}>
                              <i className="fa-solid fa-angle-left"></i>
                         </button>
                         <div className="menu-edit-container">
     {editButton && (
          <button className="menu-edit" onClick={() => navigate(`/menu`, { state: { menuData } })}>
               <i className="fa-solid fa-pen-to-square"></i> แก้ไข
          </button>
     )}

     <button className="menu-delete" onClick={() => handleItemDelete(menuData._id)}>
          <i className="fa-solid fa-trash"></i> ลบ
     </button>
</div>



                         <div className='menu-detail-content'>
                              <div className='card-left'>
                                   <div className='menu-detail-flex'>
                                        <h1>{menuData.menuName}</h1>
                                        <h2>ประเภท: {menuData.category}</h2>
                                   </div>
                                   <img src={menuData.image} alt='รูปอาหาร' loading="lazy" />
                                   <div className='menu-detail-flex'>
                                        <p>พิวรีน (โดยเฉลี่ย) :</p>
                                        <p>{menuData.purine_total} มิลลิกรัม</p>
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
                                                  <p>{index + 1}.</p>
                                                  <p>{step}</p>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}

export default MenuDetailScreen;
