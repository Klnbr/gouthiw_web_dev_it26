import React from 'react'
import { Input } from "antd";
import './CreateMenu.css';

function Form3({ formData, setFormData }) {
     const { TextArea } = Input;

     const handleMethodChange = (index, value) => {
          const newMethod = [...formData.method];
          newMethod[index] = value;
          setFormData({ ...formData, method: newMethod });
     };

     const addMethod = () => {
          setFormData({ ...formData, method: [...formData.method, ""] });
     };

     const handleDeleteMethod = (index) => {
          const newMethods = formData.method.filter((_, i) => i !== index);
          setFormData({
              ...formData,
              method: newMethods
          });
     };
     return (
          <div className='form3-containner'>
               <div className='form--hidden-ingr'>
                    <h2>วิธีการทำอาหาร</h2>
               </div>
               <hr className='hr-line-full' />
               {formData.method.map((step, index) => (
                    <div key={index}>
                         <div className='form3--input'>
                              <label htmlFor={`step-${index + 1}`}>
                                   ขั้นตอนที่ {index + 1}
                              </label>
                              <i className="fa-solid fa-circle-xmark" onClick={() => handleDeleteMethod(index)}></i>
                         </div>
                         <TextArea 
                              className='form--inputbox' 
                              placeholder='ระบุขั้นตอนการทำอาหาร' 
                              rows={4}
                              value={step}
                              onChange={(e) => handleMethodChange(index, e.target.value)} />
                    </div>
               ))}
               <button className='add-step-btn' onClick={addMethod}>
                    เพิ่มขั้นตอนถัดไป
               </button>
          </div>
     )
}

export default Form3