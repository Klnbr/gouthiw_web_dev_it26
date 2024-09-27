import React, { useState, useEffect } from 'react';
import { Input, Select } from "antd";
import './CreateMenu.css';
import axios from 'axios';

function Form2({ formData, setFormData }) {
     const [ingrs, setIngrs] = useState([]);
     const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(null);

     const [totalPurine, setTotalPurine] = useState(0);
     const [totalUric, setTotalUric] = useState(0);

     const [modal, setModal] = useState(false)

     const toggleModal = () => {
          setModal(!modal);
     }

     if (modal) {
          document.body.classList.add('active-modal')
     } else {
          document.body.classList.remove('active-modal')
     }

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
               const purine = convertToGrams(quantity, unit) * purinePerUnit / 100;
               return total + purine;
          }, 0);
  
          const newTotalUric = ingredients.reduce((total, ingredient) => {
               const quantity = parseFloat(ingredient.ingrQty) || 0;
               const unit = ingredient.ingrUnit;
               const uricPerUnit = parseFloat(ingredient.ingrUric) || 0;
               const uric = convertToGrams(quantity, unit) * uricPerUnit / 100;
               return total + uric;
          }, 0);

          const fetchIngrData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/ingrs", { timeout: 10000 });
                    setIngrs(response.data);
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message)
               }
          }

          fetchIngrData();
  
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

     const handleSelectIngr = (itemId) => {
          const selectedIngr = ingrs.find(ingr => ingr._id === itemId);
          if (selectedIngr !== undefined && selectedIngredientIndex !== null) {
               const newIngredients = [...formData.ingredients];
               newIngredients[selectedIngredientIndex] = {
                    ...newIngredients[selectedIngredientIndex],
                    ingrName: selectedIngr.name,
                    ingrPurine: selectedIngr.purine,
                    ingrUric: selectedIngr.uric
               };

               setFormData({
                    ...formData,
                    ingredients: newIngredients
               });

               setSelectedIngredientIndex(null);
               toggleModal();
          }
     }

     const handleDeleteIngr = (index) => {
          const newIngredients = formData.ingredients.filter((_, i) => i !== index);
          setFormData({
              ...formData,
              ingredients: newIngredients
          });
     };

     const renderItem = (item) => (
          <tr key={item._id} onClick={() => handleSelectIngr(item._id)}>
               <td>{item.name}</td>
               <td>{item.purine}</td>
               <td>{item.uric}</td>
          </tr>
     );

     return (
          <div>
               <div className='ingr-head'>
                    <div className='ingr-head-l'>
                         <h1>รวมพิวรีน: </h1>
                         <p>{totalPurine.toFixed(2)} mg</p>
                    </div>
                    <div className='ingr-head-r'>
                         <h1>รวมยูริก: </h1>
                         <p>{totalUric.toFixed(2)} mg</p>
                    </div>
               </div>
               {modal && (
                    <div className='modal-ingr'>
                         <div className='modal-ingr-content'>
                               <button className='ingr-cancel--btn' onClick={toggleModal}>
                                   <i className="fa-solid fa-xmark"></i>
                              </button>
                              <h1>รายชื่อวัตถุดิบ</h1>

                              <div className='ingr-search'>
                                   <input type='text' placeholder='ค้นหาวัตถุดิบที่นี่' />
                                   <button className='ingr-search--btn'>
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                   </button>
                              </div>
                              <div className='table-ingr-container'>
                                   <table className='table-ingr'>
                                        <thead>
                                             <tr>
                                                  <th>ชื่อวัตถุดิบ</th>
                                                  <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                                                  <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {ingrs.length > 0 ? (
                                                  ingrs.map(item => renderItem(item))
                                             ) : (
                                                  <tr>
                                                       <td colSpan="3">ยังไม่มีข้อมูลวัตถุดิบ</td>
                                                  </tr>
                                             )}
                                        </tbody>
                                   </table>                                    
                              </div>
                         </div>
                    </div>
               )}
               {formData.ingredients.map((ingredient, index) => (
                    <div className='form2-containner' key={index}>
                         <div className='form--hidden-ingr'>
                              <h2>วัตถุดิบที่ {index + 1}</h2>
                              <i className="fa-solid fa-circle-xmark" onClick={() => handleDeleteIngr(index)}></i>
                         </div>
                         <hr className='hr-line-full' />
                         <div>
                              <label htmlFor='ingr-name'>
                                   ชื่อวัตถุดิบ
                              </label>
                              <div className='form2--input'>
                                   <Input 
                                        className='form--inputbox' 
                                        placeholder='ระบุชื่อวัตถุดิบ'
                                        value={ingredient.ingrName}
                                        onChange={(e) => handleIngredientChange(index, 'ingrName', e.target.value)} />
                                   <div className='list-ingr-icon' onClick={() => { setSelectedIngredientIndex(index); toggleModal(); }}>
                                        <i className="fa-solid fa-clipboard-list"></i>
                                   </div>
                              </div>
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
               <button className='add-index-btn' onClick={handleAddIngredient}>
                    เพิ่มวัตถุดิบถัดไป
               </button>
               <hr className='hr-line-80' />
          </div>
     )
}

export default Form2