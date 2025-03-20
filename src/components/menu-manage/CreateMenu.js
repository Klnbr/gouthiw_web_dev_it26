import React, { useState } from 'react';
import { Steps } from "antd";
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import SideBar from '../SideBar/SideBar';
import Navbar from '../Navbar/Navbar';
import './CreateMenu.css';
import { useNavigate } from 'react-router-dom';
import { firebase } from '../.././firebase'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { useAuth } from '../../middleware/Auth';
import axios from 'axios';

function CreateMenu() {
     const navigate = useNavigate();
     const { nutrData } = useAuth();
     const [loading, setLoading] = useState(false);

     const [formData, setFormData] = useState({
          menuName: '',
          category: '',
          image: null,
          ingredients: [{ ingr_id:'', qty:'', unit:'', purine_total: '' }],
          method: [''],
          purine: '',
          // uric: ''
     });

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
          if (/[^ก-ฮะ-์]/.test(formData.menuName) || /\s/.test(formData.menuName)) {
              alert("ชื่ออาหารต้องเป็นภาษาไทยเท่านั้น ห้ามมีตัวเลขหรืออักขระพิเศษ");
              return;
          }

          setCurrent(current + 1);
      };
      

     const prevStepper = () => {
          setCurrent(current - 1);
     };


     const handleSave = async () => {
          const { menuName, category, ingredients, method, image } = formData;
    
          if (!menuName || !category || !image || !method[0] || ingredients.some(ingredient => !ingredient.ingr_id || !ingredient.qty || !ingredient.unit)) {
               alert("กรุณากรอกข้อมูลให้ครบถ้วน");
               return;
          }
          try {
               const storage= getStorage();
               const storageRef = ref(storage, `images/${image.name}`);
               await uploadBytes(storageRef, image);
        
               // ดึง URL ของภาพที่อัปโหลด
               const imageUrl = await getDownloadURL(storageRef);
               console.log("Image uploaded successfully. URL:", imageUrl);
               const menuData = { 
                    menuName: formData.menuName,
                    category: formData.category,
                    ingredients: formData.ingredients,
                    method: formData.method,
                    purine_total: formData.purine_total,
                    // uric_total: formData.uric_total,
                    image: imageUrl,
                    isDeleted: false
               };

               console.log("Menu Data:", menuData);

               const response = await axios.post(
                    `http://localhost:5500/menus/${nutrData._id}`, menuData
               );

               if (response.status === 201) {
                    alert("เพิ่มเข้าสำเร็จ");
                    navigate('/menus');
               }
          } catch (error) {
               alert("เพิ่มเข้าไม่สำเร็จ");
               console.log("error creating menu", error);
          }
     };

     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='content-no-sidebar'>
                         <div className='main-content'>
                              <div className='step-container'>
                                   <div className='step-layout'>
                                        <Steps current={current} items={items} labelPlacement="vertical" className='color-step' />
                                   </div>
                                   <div className='step-content'>{steps[current].content}</div>

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
                         </div>
                    </div>
               </div>
          </>
     )
}

export default CreateMenu