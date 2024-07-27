import React from 'react'
import { Input, Select } from "antd";
import './CreateMenu.css';

function Form1({ formData, setFormData }) {
     const handleInputChange = (e) => {
          const { name, value } = e.target;
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
                    <div className='form--drop-pic' onClick={triggerFileInputClick}>
                         {formData.image ? (
                              <img
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