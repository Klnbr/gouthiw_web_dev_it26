import React, { useState, useEffect} from 'react';
import { Input, Select } from "antd";
import './CreateMenu.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Form2({ formData, setFormData }) {
       const navigate = useNavigate();
     const [ingrs, setIngrs] = useState([]);
     const [selectedIndex, setSelectedIndex] = useState(null);

     const [totalPurine, setTotalPurine] = useState(0);
     // const [totalUric, setTotalUric] = useState(0);

     const [modal, setModal] = useState(false);

     const { ingredients } = formData;

     const [searchIngr, setSearchIngr] = useState('');
     const [selectedType, setSelectedType] = useState("ทั้งหมด");
     const [selectedDisplay, setSelectedDisplay] = useState("เพิ่มเข้าล่าสุด");

     const toggleModal = () => {
          setModal(!modal);
     }

     if (modal) {
          document.body.classList.add('active-modal')
     } else {
          document.body.classList.remove('active-modal')
     }

     const filterIngrs = ingrs.filter(ingr => 
          (selectedType === "ทั้งหมด" || ingr.ingr_type === selectedType) &&
          ingr.name.includes(searchIngr)
     );

     // การกรองตามลำดับการแสดง
     const filterDisplay = selectedDisplay === "เพิ่มเข้าล่าสุด"
          ? filterIngrs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงตามวันที่ล่าสุด
          : selectedDisplay === "top_purine"
          ? filterIngrs.sort((a, b) => b.purine - a.purine) // เรียงจากมากไปน้อย
          : filterIngrs.sort((a, b) => a.purine - b.purine); // เรียงจากน้อยไปมาก

     useEffect(() => {
          const fetchIngrData = async () => {
               try {
                    const response = await axios.get("https://gouthiw-web-dev-it26.onrender.com/ingrs", { timeout: 1000 });
                    setIngrs(response.data);
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message);
               }
          };

          fetchIngrData();
     }, []);

     const convertToGrams = (quantity, unit) => {
          switch (unit) {
               case 'กิโลกรัม':
                    return quantity * 1000; // 1 กิโลกรัม = 1000 กรัม
               default:
                    return quantity; // กรัม
          }
     };

     const getNameValue = (ingr_id) => {
          const ingr = ingrs.find(item => item._id === ingr_id);
          return ingr ? ingr.name : "";
     };

     const getPurineValue = (ingr_id) => {
          const ingr = ingrs.find(item => item._id === ingr_id);
          return ingr ? ingr.purine : 0;
     };
      
     //  const getUricValue = (ingr_id) => {
     //      const ingr = ingrs.find(item => item._id === ingr_id);
     //      return ingr ? ingr.uric : 0;
     // };

     useEffect(() => {
          const token = localStorage.getItem("authToken");
          if (!token) {
              navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
              return;
          }

          const newTotalPurine = ingredients.reduce((total, ingredient) => {
               const quantity = parseFloat(ingredient.qty) || 0;
               const unit = ingredient.unit;
               const purinePerUnit = parseFloat(getPurineValue(ingredient.ingr_id)) || 0;
               const purine = convertToGrams(quantity, unit) * purinePerUnit / 100;
               return total + purine;
          }, 0);

       
          setTotalPurine(newTotalPurine);
          // setTotalUric(newTotalUric);

          setFormData((prevFormData) => ({
               ...prevFormData,
               purine_total: newTotalPurine,
               // uric_total: newTotalUric
          }));

     }, [setFormData, ingredients, navigate]);


     const handleIngredientChange = (index, field, value) => {
          const newIngrs = [...formData.ingredients];
          
          // ตรวจสอบว่า qty เป็นตัวเลขและไม่ต่ำกว่า 0
          if (field === 'qty' && value !== '' && !/^\d+(\.\d+)?$/.test(value)) {
              alert("ปริมาณต้องเป็นตัวเลขเท่านั้น");
              return; // หยุดการทำงานหากไม่ใช่ตัวเลข
          }
      
          if (field === 'qty' && parseFloat(value) < 0) { // ตรวจสอบว่า qty ต้องไม่น้อยกว่า 0
              alert("ปริมาณต้องมากกว่าหรือเท่ากับ 0");
              return; // หยุดการทำงานหากค่าต่ำกว่า 0
          }
      
          newIngrs[index] = { ...newIngrs[index], [field]: value };
          setFormData({
              ...formData,
              ingredients: newIngrs
          });
      };
      

      const handleAddIngredient = () => {
          // ตรวจสอบทุกๆ ingredient.qty ว่ามีค่าต่ำกว่า 0 หรือไม่
          if (formData.ingredients.some(ingredient => parseFloat(ingredient.qty) < 0)) {
              alert("ปริมาณต้องมากกว่าหรือเท่ากับ 0");
              return; // หยุดการทำงานหากมีค่าที่น้อยกว่า 0
          }
      
          setFormData({
              ...formData,
              ingredients: [...formData.ingredients, { ingr_id: '', qty: '', unit: 'กรัม' }]
          });
      };
      

     const handleSelectIngr = (itemId) => {
          const selectedIngr = ingrs.find(ingr => ingr._id === itemId);
          if (selectedIngr !== undefined && selectedIndex !== null) {
              const newIngr = [...formData.ingredients];
      
              newIngr[selectedIndex] = {
                  ...newIngr[selectedIndex],
                  ingr_id: selectedIngr._id,
                  qty: newIngr[selectedIndex].qty, // เก็บค่า qty เดิม
                  unit: newIngr[selectedIndex].unit, // เก็บค่า unit เดิม
              };
      
              setFormData({
                  ...formData,
                  ingredients: newIngr
              });
      
              setSelectedIndex(null);
              toggleModal(); // ปิด modal หลังจากเลือก
          }
     };

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
               {/* <td>{item.uric}</td> */}
          </tr>
     );

     return (
          <div>
               <div className='ingr-head'>
                    <div className='ingr-head-l'>
                         <h1>รวมพิวรีน: </h1>
                         <p>{totalPurine.toFixed(2)} mg</p>
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
                                   <div className='ingr-search-wrapper'>
                                        <i className="fa-solid fa-magnifying-glass ingr-search-icon"></i>
                                        <input 
                                             type='text'
                                             placeholder='ค้นหาวัตถุดิบที่นี่' 
                                             onChange={(e) => setSearchIngr(e.target.value)} 
                                             className='ingr-search-input' />
                                   </div>

                                   <div className='ingr-select-wrapper'>
                                        <i className="fa-solid fa-filter ingr-search-icon"></i>
                                        <Select 
                                             className='ingr-search-select'
                                             value={selectedType} 
                                             onChange={(value) => setSelectedType(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                             options={[
                                                  { value: "ทั้งหมด", label: "ทั้งหมด" },
                                                  { value: "เนื้อสัตว์", label: "เนื้อสัตว์" },
                                                  { value: "ผัก", label: "ผัก" },
                                                  { value: "ผลไม้", label: "ผลไม้" },
                                                  { value: "อื่น ๆ", label: "อื่น ๆ" },
                                             ]}
                                        />
                                    </div>

                                   <div className='ingr-select-wrapper'>
                                        <i className="fa-solid fa-sort ingr-search-icon"></i>
                                        <Select 
                                             className='ingr-search-select'
                                             value={selectedDisplay} 
                                             onChange={(value) => setSelectedDisplay(value)} // อัปเดต selectedFilterType เมื่อเลือกประเภท
                                             options={[
                                                  { value: "last_add", label: "เพิ่มเข้าล่าสุด" },
                                                  { value: "top_purine", label: "ค่าพิวรีนมากสุด" },
                                                  { value: "low_purine", label: "ค่าพิวรีนน้อยสุด" }
                                             ]}
                                        />
                                   </div>
                              </div>
                                   <div className='table-ingr-container'>
                                        <table className='table-ingr'>
                                             <thead>
                                                  <tr>
                                                       <th>ชื่อวัตถุดิบ</th>
                                                       <th>ค่าพิวรีน (มิลลิกรัม / 100 กรัม)</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {filterDisplay.length > 0 ? (
                                                       filterDisplay.map(item => renderItem(item))
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
                                        value={getNameValue(ingredient.ingr_id)}
                                        readOnly />
                                   <div className='list-ingr-icon' onClick={() => { setSelectedIndex(index); toggleModal(); }}>
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
    value={ingredient.qty}
    onChange={(e) => handleIngredientChange(index, 'qty', e.target.value)} 
/>

                              </div>
                              <div className='form--input-1-col'>
                                   <label htmlFor='ingr-amount'>
                                        หน่วย
                                   </label>
                                   <Select 
                                        className='form--select'
                                        defaultValue="กรัม"
                                        value={ingredient.unit}
                                        onChange={(value) => handleIngredientChange(index, 'unit', value)}
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
                                        value={getPurineValue(ingredient.ingr_id).toFixed(2)}
                                        readOnly
                                        />
                              </div>
                              {/* <div className='form--input-1-col'>
                                   <label htmlFor='ingr-uric'>
                                        กรดยูริก
                                   </label>
                                   <Input 
                                        className='form--inputbox' 
                                        placeholder='ระบุกรดยูริก'
                                        value={getUricValue(ingredient.ingr_id).toFixed(2)}
                                        readOnly
                                        />
                              </div> */}
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