import React, { useEffect } from 'react'
import { Input, Select } from "antd";
import './CreateMenu.css';
import { useNavigate } from 'react-router-dom';

function Form1({ formData, setFormData }) {
       const navigate = useNavigate();
     useEffect(() => {
          const token = localStorage.getItem("authToken");
          if (!token) {
              navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
              return;
          }

          return () => {
               if (formData.image && typeof formData.image !== 'string') {
                    URL.revokeObjectURL(formData.image);
               }
          };
          // ลบ URL ที่สร้างขึ้นจาก URL.revokeObjectURL หลังจากไม่ใช้งานแล้ว เพื่อป้องกันการใช้หน่วยความจำเกินความจำเป็น
     }, [formData.image, navigate]);

     const handleInputChange = (e) => {
          const { name, value } = e.target;

          // if (/[^ก-ฮะ-์]/.test(formData.name) || /\s/.test(formData.name)) {
          //      alert("ชื่ออาหารต้องเป็นภาษาไทยเท่านั้น ห้ามมีตัวเลขหรืออักขระพิเศษ");
          //      return;
          //  }

          setFormData({ ...formData, [name]: value });
     };
  
     const handleSelectChange = (value) => {
          setFormData({ ...formData, category: value });
     };
  
     const handleImageChange = (e) => {
          setFormData({ ...formData, image: e.target.files[0] });
     };

     const triggerFileInputClick = () => {
          document.getElementById('imageUpload').click();
     };

     return (
          <div>
               <div className='form--input'>
                    <label htmlFor='menu-name'>
                         ชื่ออาหาร
                    </label>
                    <Input 
                         name="menuName"
                         value={formData.menuName}
                         onChange={handleInputChange}
                         className='form--inputbox' />
               </div>
               <div className='form--input'>
                    <label htmlFor='menu-type'>
                         ประเภท
                    </label>
                    <Select 
                         className='form--select'
                         placeholder="ระบุประเภทอาหาร"
                         value={formData.category}
                         onChange={handleSelectChange}
                         optionFilterProp="children"
                         options={[
                              {
                                   value: "ผัด",
                                   label: "ผัด"
                              },
                              {
                                   value: "แกง",
                                   label: "แกง"
                              },
                              {
                                   value: "ทอด",
                                   label: "ทอด"
                              },
                              {
                                   value: "ตุ๋น",
                                   label: "ตุ๋น"
                              },
                         ]}
                    />
               </div>
               <div className='form--input'>
                    <label htmlFor='menu-name'>
                         ภาพประกอบ
                    </label>
                    <div className='form--drop-pic-menu' onClick={triggerFileInputClick}>
                         {formData.image ? (
                              <img
                              loading="lazy"
                                   className='form--pic'
                                   alt={`url: ${formData.image.name}`}
                                   src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                              />
                         ) : (
                              <i className="fa-regular fa-images"></i>
                         )}
                         <input 
                              type="file"
                              id="imageUpload"
                              onChange={handleImageChange} />
                    </div>
               </div>
          </div>
     )
}

export default Form1