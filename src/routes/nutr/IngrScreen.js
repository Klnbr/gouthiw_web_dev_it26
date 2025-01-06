import React, { useEffect, useState } from 'react'
import '../../components/ingr.css'
import '../../components/Modal.css'
import Navbar from '../../components/Navbar/Navbar'
import SideBar from '../../components/SideBar/SideBar'
import { Input, Select } from "antd";
import axios from 'axios';
import { useAuth } from '../../middleware/Auth';

function IngrScreen() {
     const [ingrs, setIngrs] = useState([]);
     const [ingrsNutr, setIngrsNutr] = useState([]);
     const { nutrData } = useAuth();

     const [name, setName] = useState("");
     const [purine, setPurine] = useState("");
     const [uric, setUric] = useState("");
     const [type, setType] = useState("");
     const [currentItemId, setCurrentItemId] = useState(null);

     const [searchIngr, setSearchIngr] = useState('');
     const [selectedType, setSelectedType] = useState("ทั้งหมด");
     const [selectedDisplay, setSelectedDisplay] = useState("เพิ่มเข้าล่าสุด");

     const [activeButton, setActiveButton] = useState('ทั้งหมด');

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

     const [dropdownVisible, setDropdownVisible] = useState(false);
     const toggleDropdown = (ingrId) => {
          setDropdownVisible(dropdownVisible === ingrId ? null : ingrId);
     };

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
          const fetchIngrNutrData = async () => {
               try {
                    const response = await axios.get(`http://localhost:5500/ingrs/${nutrData._id}`, { timeout: 10000 });
                    setIngrsNutr(response.data);
               } catch (error) {
                    console.log("Error fetching ingrs data", error.message)
               }
          }
          fetchIngrData();
          fetchIngrNutrData();
     }, [nutrData]);

     console.log("object: ", ingrs)

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
                    await axios.post(`http://localhost:5500/ingr/${nutrData._id}`, ingreData);
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
          const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
          if (!confirmDelete) {
              return; // ถ้าไม่ยืนยัน จะไม่ทำการลบ
          }
      
          try {
              const response = await axios.delete(`http://localhost:5500/ingr/${itemId}`);
      
              if (response.status === 200) {
                  alert("ลบสำเร็จ");
                  // โหลดข้อมูลใหม่หลังจากลบสำเร็จ
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
              
               <td>{item.owner_name || nutrData.firstname + ' ' + nutrData.lastname}</td>
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
                    <Navbar />
                    <div className='sidebar-content-wrapper'>
                         <SideBar/>
                         <div className='content'>
                              <div className='main-content'>
                                   <div className='ingr-content'>
                                        <div className='display-flex'>
                                             <p className='breadcumb'>
                                                  <span className='press-to-back'>หน้าหลัก</span>
                                                  <span className='gray-color'> &#62;</span> วัตถุดิบ
                                             </p>
                                             <div className='divider' />
                                             <button className='add-ingr-btn' onClick={toggleModal}>
                                                  <i className="fa-solid fa-plus"> เพิ่มวัตถุดิบ</i>
                                             </button> 
                                        </div>
                                        
                                        <h1 className='head-content'>วัตถุดิบ</h1>
                                        <div className='ingr-manage'>
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
                                                                 { value: "top_purine", label: "ค่าพิวรีน มาก -> น้อย" },
                                                                 { value: "low_purine", label: "ค่าพิวรีน น้อย -> มาก" }
                                                            ]}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

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

                                   <div className='above-table'>
                                        <p>รวมทั้งหมด {ingrs.length} วัตถุดิบ</p>
                                        <div className='switch-btn'>
                                             <button 
                                                  onClick={() => setActiveButton('ทั้งหมด')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ทั้งหมด' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ทั้งหมด' ? 'white' : 'black'
                                                  }}>ทั้งหมด</button>
                                             <button 
                                                  onClick={() => setActiveButton('ของฉัน')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ของฉัน' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ของฉัน' ? 'white' : 'black'
                                                  }}>ของฉัน</button>
                                        </div>
                                   </div>
                                   
                                   <table className='table-ingr'>
                                        <thead>
                                             <tr>
                                                  <th>ชื่อวัตถุดิบ</th>
                                                  <th>ค่าพิวรีน (มิลลิกรัม / 100 กรัม)</th>
                                             
                                                  <th>เพิ่มโดย</th>
                                                  <th></th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {activeButton === 'ทั้งหมด' ? (
                                                  filterDisplay.length > 0 ? (
                                                       filterDisplay.map(item => renderItem(item))
                                                  ) : (
                                                       <tr>
                                                            <td colSpan="5">ยังไม่มีข้อมูลวัตถุดิบ</td>
                                                       </tr>
                                                  )
                                             ) : (
                                                  ingrsNutr.length > 0 ? (
                                                       ingrsNutr.map(item => renderItem(item))
                                                  ) : (
                                                       <tr>
                                                            <td colSpan="5">คุณยังไม่ได้เพิ่มวัตถุดิบ</td>
                                                       </tr>
                                                  )
                                             )}
                                        </tbody>
                                   </table>
                              </div>
                         </div>
                    </div>        
               </div>
          </>
     )
}

export default IngrScreen