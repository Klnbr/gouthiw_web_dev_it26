import React, { useState, useEffect } from 'react';
import { Input, Select } from "antd";
import './CreateMenu.css';

function Form2({ formData, setFormData }) {
     const [totalPurine, setTotalPurine] = useState(0);
     const [totalUric, setTotalUric] = useState(0);
     const { ingredients } = formData;

     const convertToGrams = (quantity, unit) => {
          switch (unit) {
               case 'กิโลกรัม':
                    return quantity * 1000; // 1 กิโลกรัม = 1000 กรัม
               case 'ขีด':
                    return quantity * 100; // 1 ขีด = 100 กรัม
               default:
                    return quantity; // กรัม
          }
     };

     useEffect(() => {
          const newTotalPurine = ingredients.reduce((total, ingredient) => {
               const quantity = parseFloat(ingredient.ingrQty) || 0;
               const unit = ingredient.ingrUnit;
               const purinePerUnit = parseFloat(ingredient.ingrPurine) || 0;
               const purine = convertToGrams(quantity, unit) * purinePerUnit;
               return total + purine;
          }, 0);
  
          const newTotalUric = ingredients.reduce((total, ingredient) => {
               const quantity = parseFloat(ingredient.ingrQty) || 0;
               const unit = ingredient.ingrUnit;
               const uricPerUnit = parseFloat(ingredient.ingrUric) || 0;
               const uric = convertToGrams(quantity, unit) * uricPerUnit;
               return total + uric;
          }, 0);
  
          setTotalPurine(newTotalPurine);
          setTotalUric(newTotalUric);

          setFormData({
               ...formData,
               purine: newTotalPurine,
               uric: newTotalUric
          });

      }, [ingredients]);

     const handleIngredientChange = (index, field, value) => {
          const newIngredients = [...ingredients];
          newIngredients[index] = { ...newIngredients[index], [field]: value };
          
          if (field === 'ingrQty' || field === 'ingrPurine' || field === 'ingrUric') {
               newIngredients[index][field] = value.replace(/[^0-9.]/g, '');
          }

          setFormData({
               ...formData,
               ingredients: newIngredients
          });
     };

     const handleAddIngredient = () => {
          setFormData({
              ...formData,
              ingredients: [...formData.ingredients, { ingrName: '', ingrQty: '', ingrUnit: '', ingrPurine: '', ingrUric: '' }]
          });
     };

     return (
          <div>
               <h1>รวมพิวรีน: {totalPurine.toFixed(2)} mg</h1>
               <h1>รวมยูริก: {totalUric.toFixed(2)} mg</h1>
               {formData.ingredients.map((ingredient, index) => (
                    <div key={index}>
                         <div className='form--hidden-ingr'>
                              <h2>วัตถุดิบที่ {index + 1}</h2>
                              <i className="fa-solid fa-caret-down"></i>
                         </div>
                         <hr className='hr-line-full' />
                         <div className='form--input'>
                              <label htmlFor='ingr-name'>
                                   ชื่อวัตถุดิบ
                              </label>
                              <Input 
                                   className='form--inputbox' 
                                   placeholder='ระบุชื่อวัตถุดิบ'
                                   value={ingredient.ingrName}
                                   onChange={(e) => handleIngredientChange(index, 'ingrName', e.target.value)} />
                         </div>
                         <div className='form--input-2-col'>
                              <div className='form--input-1-col'>
                                   <label htmlFor='ingr-amount'>
                                        ปริมาณ
                                   </label>
                                   <Input 
                                        className='form--inputbox' 
                                        placeholder='ระบุปริมาณ'
                                        value={ingredient.ingrQty}
                                        onChange={(e) => handleIngredientChange(index, 'ingrQty', e.target.value)} />
                              </div>
                              <div className='form--input-1-col'>
                                   <label htmlFor='ingr-amount'>
                                        หน่วย
                                   </label>
                                   <Select 
                                        className='form--select'
                                        placeholder="เลือกหน่วย"
                                        value={ingredient.ingrUnit}
                                        onChange={(value) => handleIngredientChange(index, 'ingrUnit', value)}
                                        optionFilterProp="children"
                                        options={[
                                             {
                                                  value: "กิโลกรัม",
                                                  label: "กิโลกรัม"
                                             },
                                             {
                                                  value: "กรัม",
                                                  label: "กรัม"
                                             },
                                             {
                                                  value: "ขีด",
                                                  label: "ขีด"
                                             }
                                        ]}
                                   />
                              </div>
                         </div>
                         <div className='form--input-2-col'>
                              <div className='form--input-1-col'>
                                   <label htmlFor='ingr-purine'>
                                        พิวรีน
                                   </label>
                                   <Input 
                                        className='form--inputbox' 
                                        placeholder='ระบุพิวรีน'
                                        value={ingredient.ingrPurine}
                                        onChange={(e) => handleIngredientChange(index, 'ingrPurine', e.target.value)} />
                              </div>
                              <div className='form--input-1-col'>
                                   <label htmlFor='ingr-uric'>
                                        กรดยูริก
                                   </label>
                                   <Input 
                                        className='form--inputbox' 
                                        placeholder='ระบุกรดยูริก'
                                        value={ingredient.ingrUric}
                                        onChange={(e) => handleIngredientChange(index, 'ingrUric', e.target.value)} />
                              </div>
                         </div>
                    </div>
               ))}
               <button className='add-ingredient-btn' onClick={handleAddIngredient}>
                    เพิ่มวัตถุดิบใหม่
               </button>
          </div>
     )
}

export default Form2