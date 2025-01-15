import React, { useState, useEffect } from 'react';
import { Steps } from "antd";
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import './CreateMenu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { firebase } from '../.././firebase'
import axios from 'axios';

function EditMenu() {
     const navigate = useNavigate();
     const location = useLocation();
     const { menuData } = location.state || {};

     const [formData, setFormData] = useState({
          menuName: '',
          category: '',
          image: null,
          ingredients: [],
          method: [],
          purine: 0,
          // uric: 0
     });

     useEffect(() => {
          if (menuData) {
               setFormData({
                    menuName: menuData.menuName,
                    category: menuData.category,
                    image: menuData.image,
                    ingredients: menuData.ingredients || [],
                    method: menuData.method || [],
                    purine: menuData.purine,
                    // uric: menuData.uric
               });
          }
     }, [menuData]);

     const steps = [
          {
               title: "ข้อมูลทั่วไป",
               content: <Form1 formData={formData} setFormData={setFormData} />
          },
          {
               title: "วัตถุดิบ",
               content: <Form2 formData={formData} setFormData={setFormData} />
          },
          {
               title: "วิธีการทำอาหาร",
               content: <Form3 formData={formData} setFormData={setFormData} />
          },
     ]

     const [current, setCurrent] = useState(0);

     const items = steps.map((item) => ({
          key: item.title,
          title: item.title,
          // icon: item.icon,
     }));

     const nextStepper = () => {
          setCurrent(current + 1);
     };

     const prevStepper = () => {
          setCurrent(current - 1);
     };

     const handleSave = async () => {
          try {
               let imageUrl = formData.image;

               if (formData.image && typeof formData.image !== 'string') {
                    const storageRef = firebase.storage().ref();
                    const imageRef = storageRef.child(`images/${formData.image.name}`);
                    await imageRef.put(formData.image);
                    imageUrl = await imageRef.getDownloadURL();
                    console.log("Image uploaded successfully. URL:", imageUrl);
               }
               
               const updatemenuData = {
                    menuName: formData.menuName,
                    category: formData.category,
                    ingredients: formData.ingredients,
                    method: formData.method,
                    purine: formData.purine,
                    // uric: formData.uric,
                    image: imageUrl,
                    isDeleted: false
               };

               console.log('Updated Menu Data:', updatemenuData);

               const response = await axios.put(`http://localhost:5500/menu/${menuData._id}`, updatemenuData);

               console.log('Menu updated', response.data);

               if (response.status === 200) {
                    alert("แก้ไขสำเร็จ");
                    navigate('/menus');
               }
          } catch (error) {
               alert("แก้ไขไม่สำเร็จ", error.response.data.message || "Unknown error");
               console.log('Error updating menu', error);
          }
     };

     return (
          <div className='step-container'>
               <div className='step-layout'>
                    <Steps current={current} items={items} labelPlacement="vertical" />
               </div>
               <div>{steps[current].content}</div>

               <div className='step-btn'>
                    <button className='step-btn--cancel' onClick={() => navigate('/menus')}>ยกเลิก</button>
                    <div className="step-btn-layout">
                         {current > 0 && (
                              <button className="step-btn--prev" onClick={() => prevStepper()}>
                                   ย้อนกลับ
                              </button>
                         )}
                         {current < steps.length - 1 && (
                              <button className="step-btn--next" onClick={() => nextStepper()}>
                                   ถัดไป
                              </button>
                         )}
                         {current === steps.length - 1 && (
                              <button className="step-btn--next" onClick={handleSave}>
                                   บันทึก
                              </button>
                         )}
                    </div>
               </div>
          </div>
     )
}

export default EditMenu