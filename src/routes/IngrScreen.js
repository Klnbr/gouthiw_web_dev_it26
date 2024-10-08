import React, { useEffect, useState } from 'react'
import '../../src/components/ingr.css'
import '../components/Modal.css'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/SideBar/SideBar'
import { Input, Select } from "antd";
import axios from 'axios';

function IngrScreen() {
     const [ingrs, setIngrs] = useState([]);

     const [name, setName] = useState("");
     const [purine, setPurine] = useState("");
     const [uric, setUric] = useState("");
     const [type, setType] = useState("");
     const [currentItemId, setCurrentItemId] = useState(null);

     const [dropdownVisible, setDropdownVisible] = useState(false);
     const [selectedType, setSelectedType] = useState("ทั้งหมด");

     //set modal
     const [modal, setModal] = useState(false)
     const toggleModal = () => {
          setModal(!modal);
          if (!modal) {
               setName("");
               setPurine("");
               setUric("");
               setType("");
               setCurrentItemId(null);
          }
     }

     if (modal) {
          document.body.classList.add('active-modal')
     } else {
          document.body.classList.remove('active-modal')
     }

     useEffect(() => {
          const fetchIngrData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/ingrs", { timeout: 10000 });
                    setIngrs(response.data);
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message)
               }
          }
          fetchIngrData();
     }, []);

     const filterIngrs = (selectedType === "ทั้งหมด") 
          ? ingrs 
          : ingrs.filter(item => item.ingr_type === selectedType);


     const handleSave = async () => {
          if (!name || !purine || !uric) {
               alert("กรุณากรอกข้อมูลให้ครบถ้วน");
               return;
          }

          const ingreData = {
               name: name,
               purine: purine,
               uric: uric,
               ingr_type: type,
               isDeleted: false
          };


          try {
               if (currentItemId) {
                    await axios.put(`http://localhost:5500/ingr/${currentItemId}`, ingreData);
                    alert("แก้ไขสำเร็จ");

                    console.log("Current Type handleSave:", type);
               } else {
                    await axios.post("http://localhost:5500/addIngr", ingreData);
                    alert("เพิ่มเข้าสำเร็จ");
               }

               setName("");
               setPurine("");
               setUric("");
               setType("");
               setModal(false);
               setCurrentItemId(null);
               
               const response = await axios.get("http://localhost:5500/ingrs", { timeout: 10000 });
               setIngrs(response.data);
          } catch (error) {
               alert("การบันทึกไม่สำเร็จ", error.response?.data?.message || "Unknown error");
               console.log(error);
          }
     }

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://localhost:5500/ingr/${itemId}`);
               const ingrData = response.data;
               setName(ingrData.name);
               setPurine(ingrData.purine);
               setUric(ingrData.uric);
               setType(ingrData.ingr_type);
               setCurrentItemId(itemId);
               setModal(true);

               console.log("Current Type handleItemPress : ", type);
          } catch (error) {
               console.log('Error fetching ingr data', error.message);
          }
     };

     const handleItemDelete = async (itemId) => {
          try {
               const response = await axios.delete(`http://localhost:5500/ingr/${itemId}`);

               if (response.status === 200) {
                    alert("ลบสำเร็จ");
                    const response = await axios.get("http://localhost:5500/ingrs", { timeout: 10000 });
                    setIngrs(response.data);
               }
          } catch (error) {
               console.log('Error deleting ingr', error);
          }
     };

     const renderItem = (item) => (
          <tr key={item._id}>
               <td>{item.name}</td>
               <td>{item.purine}</td>
               <td>{item.uric}</td>
               <td>
                    <div className='ingr-btn--layout'>
                         <div className='ingr-btn' onClick={() => handleItemPress(item._id)}>
                              <i className="fa-solid fa-pen"></i>
                         </div>
                         <div className='ingr-btn' onClick={() => handleItemDelete(item._id)}>
                              <i className="fa-solid fa-trash-can"></i>
                         </div>
                    </div>
               </td>
          </tr>
     );

     return (
          <>
               <div className='container'>
                    <SideBar />
                    <div className='content'>
                         <div className='nav'>
                              <Navbar />
                         </div>
                         <div className='main-content'>
                              <div className='ingr-manage'>
                                   <div className='ingr-search'>
                                        <input type='text' placeholder='ค้นหาวัตถุดิบที่นี่' />
                                        <button className='ingr-search--btn'>
                                             <i className="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                   </div>
                                   <button className='add-ingr-btn' onClick={toggleModal}>
                                        <i className="fa-solid fa-plus"> เพิ่มวัตถุดิบของคุณ</i>
                                   </button>
                              </div>

                              {/* Dropdown สำหรับคัดกรองประเภทวัตถุดิบ */}
                              <Select 
                                   className='ingr-filter--select'
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

                              {modal && (
                                   <div className='modal'>
                                        <div className='modal-content'>
                                             <button className='ingr-cancel--btn' onClick={toggleModal}>
                                                  <i className="fa-solid fa-xmark"></i>
                                             </button>
                                             <h1>{currentItemId ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}</h1>

                                             <label htmlFor='ingr-name'>ชื่อวัตถุดิบ</label>
                                             <Input className='modal--input' value={name} onChange={(e) => setName(e.target.value)} />

                                             <label htmlFor='ingr-type'>ประเภท</label>
                                             <Select 
                                                  className='ingr-form--select'
                                                  placeholder="เลือกประเภทวัตถุดิบ"
                                                  value={type}
                                                  onChange={(value) => setType(value)}
                                                  optionFilterProp="children"
                                                  options={[
                                                       {
                                                            value: "เนื้อสัตว์",
                                                            label: "เนื้อสัตว์"
                                                       },
                                                       {
                                                            value: "ผัก",
                                                            label: "ผัก"
                                                       },
                                                       {
                                                            value: "ผลไม้",
                                                            label: "ผลไม้"
                                                       },
                                                       {
                                                            value: "อื่น ๆ",
                                                            label: "อื่น ๆ"
                                                       },
                                                  ]}
                                             />

                                             <label htmlFor='ingr-purine'>พิวรีน (มิลลิกรัม)</label>
                                             <Input className='modal--input' value={purine} onChange={(e) => setPurine(e.target.value)} />

                                             <label htmlFor='ingr-uric'>ยูริก (มิลลิกรัม)</label>
                                             <Input className='modal--input' value={uric} onChange={(e) => setUric(e.target.value)} />
                                             
                                             <button className='ingr-save--btn' onClick={handleSave}>
                                                  <i className="fa-solid fa-floppy-disk"></i>
                                                  <span className='btn-title'>บันทึก</span>
                                             </button>                                  
                                        </div>
                                   </div>
                              )}

                              <table className='table-ingr'>
                                   <thead>
                                        <tr>
                                             <th>ชื่อวัตถุดิบ</th>
                                             <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                                             <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                                             <th></th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {filterIngrs.length > 0 ? (
                                             filterIngrs.map(item => renderItem(item))
                                        ) : (
                                             <tr>
                                                  <td colSpan="4">ยังไม่มีข้อมูลวัตถุดิบ</td>
                                             </tr>
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               </div>
          </>
     )
}

export default IngrScreen