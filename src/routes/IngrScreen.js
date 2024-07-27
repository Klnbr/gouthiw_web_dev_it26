import React, { useEffect, useState } from 'react'
import '.././App.css'
import '../components/Modal.css'
import { Input } from "antd";
import axios from 'axios';

function IngrScreen() {
     const [ingrs, setIngrs] = useState([]);

     const [name, setName] = useState("");
     const [purine, setPurine] = useState("");
     const [uric, setUric] = useState("");
     const [currentItemId, setCurrentItemId] = useState(null);

     //set modal
     const [modal, setModal] = useState(false)
     const toggleModal = () => {
          setModal(!modal);
          if (!modal) {
               setName("");
               setPurine("");
               setUric("");
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

     const handleSave = async () => {
          if (!name || !purine || !uric) {
               alert("กรุณากรอกข้อมูลให้ครบถ้วน");
               return;
          }

          const ingreData = {
               name: name,
               purine: purine,
               uric: uric,
               isDeleted: false
          };

          try {
               if (currentItemId) {
                    await axios.put(`http://localhost:5500/ingr/${currentItemId}`, ingreData);
                    alert("แก้ไขสำเร็จ");
               } else {
                    await axios.post("http://localhost:5500/addIngr", ingreData);
                    alert("เพิ่มเข้าสำเร็จ");
               }

               setName("");
               setPurine("");
               setUric("");
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
               setCurrentItemId(itemId);
               setModal(true);
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
                    <button onClick={() => handleItemPress(item._id)}>
                         แก้ไข
                    </button>
               </td>
               <td>
                    <button onClick={() => handleItemDelete(item._id)}>
                         ลบ
                    </button>
               </td>
          </tr>
     );

     return (
          <div>
               <button onClick={toggleModal}>เพิ่มวัตถุดิบ</button>

               {modal && (
                    <div className='modal'>
                         <div className='overlay'></div>
                         <div className='modal-content'>
                              <h1>{currentItemId ? "แก้ไขวัตถุดิบ" : "เพิ่มวัตถุดิบใหม่"}</h1>

                              <label htmlFor='ingr-name'>ชื่อวัตถุดิบ</label>
                              <Input className='modal--input' value={name} onChange={(e) => setName(e.target.value)} />

                              <label htmlFor='ingr-purine'>พิวรีน (โดยเฉลี่ย)</label>
                              <Input className='modal--input' value={purine} onChange={(e) => setPurine(e.target.value)} />

                              <label htmlFor='ingr-uric'>ยูริก (โดยเฉลี่ย)</label>
                              <Input className='modal--input' value={uric} onChange={(e) => setUric(e.target.value)} />
                              
                              <button onClick={handleSave}>บันทึก</button>
                              <button onClick={toggleModal}>ปิด</button>
                         </div>
                    </div>
               )}

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
                                   <td colSpan="4">ยังไม่มีข้อมูลวัตถุดิบ</td>
                              </tr>
                         )}
                    </tbody>
               </table>
          </div>
     )
}

export default IngrScreen