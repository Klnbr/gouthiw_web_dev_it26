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
     return (
          <div>
               <div className='form--hidden-ingr'>
                    <h2>วิธีการทำอาหาร</h2>
               </div>
               <hr className='hr-line-full' />
               {formData.method.map((step, index) => (
                    <div className='form--input' key={index}>
                         <label htmlFor={`step-${index + 1}`}>
                              ขั้นตอนที่ {index + 1}
                         </label>
                         <TextArea 
                              className='form--inputbox' 
                              placeholder='ระบุขั้นตอนการทำอาหาร' 
                              rows={4}
                              value={step}
                              onChange={(e) => handleMethodChange(index, e.target.value)} />
                    </div>
               ))}
               <button type="button" onClick={addMethod}>
                    เพิ่มขั้นตอน
               </button>
          </div>
     )
}

export default Form3