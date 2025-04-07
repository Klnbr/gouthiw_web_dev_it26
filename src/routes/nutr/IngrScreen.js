import React, { useEffect, useState } from 'react';
import '../../components/ingr.css';
import '../../components/Modal.css';
import '../../../src/App.css';
import Navbar from '../../components/Navbar/Navbar';
import SideBar from '../../components/SideBar/SideBar';
import { Select } from "antd";
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

     const [currentPage, setCurrentPage] = useState(1);
     const itemsPerPage = 13;

     const [activeButton, setActiveButton] = useState('ทั้งหมด');
   
     // Set modal
     const [modal, setModal] = useState(false);
     const toggleModal = () => {
          setModal(!modal);
          if (!modal) {
               setName("");
               setPurine("");
               setUric("");
               setType("");
               setCurrentItemId(null);
          }
     };

     const [dropdownVisible, setDropdownVisible] = useState(false);


     if (modal) {
          document.body.classList.add('active-modal');
     } else {
          document.body.classList.remove('active-modal');
     }

     useEffect(() => {
          const fetchData = async () => {
              try {
                  const ingrResponse = await axios.get("https://gouthiw-health.onrender.com/ingrs", { timeout: 1000 });
                  setIngrs(ingrResponse.data);
      
                  if (nutrData && nutrData._id) {
                      const ingrNutrResponse = await axios.get(`https://gouthiw-health.onrender.com/ingrs/${nutrData._id}`, { timeout: 1000 });
                      setIngrsNutr(ingrNutrResponse.data);
                  }
              } catch (error) {
                  console.log("Error fetching data", error.message);
              }
          };
      
          fetchData();
      }, [nutrData]);  

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
          if (!name || !purine) {
               alert("กรุณากรอกข้อมูลให้ครบถ้วน");
               return;
          }

          const thaiRegex = /^[ก-๙\s]+$/;
          if (!thaiRegex.test(name)) {
               alert("สามารถกรอกได้เฉพาะตัวอักษรภาษาไทยเท่านั้น");
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
                    await axios.put(`https://gouthiw-health.onrender.com/ingr/${currentItemId}`, ingreData);
                    alert("แก้ไขสำเร็จ");
               } else {
                    await axios.post(`https://gouthiw-health.onrender.com/ingr/${nutrData._id}`, ingreData);
                    alert("เพิ่มเข้าสำเร็จ");
               }

               setName("");
               setPurine("");
               setUric("");
               setType("");
               setModal(false);
               setCurrentItemId(null);
               const response = await axios.get("https://gouthiw-health.onrender.com/ingrs", { timeout: 1000 });
               setIngrs(response.data);
          } catch (error) {
               alert("การบันทึกไม่สำเร็จ", error.response?.data?.message || "Unknown error");
               console.log(error);
          }
     };

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`https://gouthiw-health.onrender.com/ingr/${itemId}`);
               const ingrData = response.data;
               setName(ingrData.name);
               setPurine(ingrData.purine);
               setUric(ingrData.uric);
               setType(ingrData.ingr_type);
               setCurrentItemId(itemId);
               setModal(true);
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
               const response = await axios.delete(`https://gouthiw-health.onrender.com/ingr/${itemId}`);

               if (response.status === 200) {
                    alert("ลบสำเร็จ");
                    const response = await axios.get("https://gouthiw-health.onrender.com/ingrs", { timeout: 1000 });
                    setIngrs(response.data);
               }
          } catch (error) {
               console.log('Error deleting ingr', error);
          }
     };

     const paginate = (pageNumber) => setCurrentPage(pageNumber);

     const renderItem = (item) => (
          <tr key={item._id}>
               <td>{item.name}</td>
               <td>{item.purine}</td>
               <td>{item.ingr_type}</td>
               <td>{item.owner_name || (nutrData ? `${nutrData.firstname} ${nutrData.lastname}` : "ไม่ระบุ")}</td>
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

     // Pagination Logic
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = filterDisplay.slice(indexOfFirstItem, indexOfLastItem);

     const totalPages = Math.ceil(filterDisplay.length / itemsPerPage);

     const handleNameChange = (e) => {
          const regex = /^[A-Za-zก-ฮะ-์\s]+$/;  // Allows only Thai and English letters
          if (regex.test(e.target.value) || e.target.value === '') {
               setName(e.target.value);

          }
     };

     const handlePurineChange = (e) => {
          const regex = /^[0-9]*$/;  // Allows only numbers
          if (regex.test(e.target.value) || e.target.value === '') {
               setPurine(e.target.value);
          }
     };
     return (
          <>
               <div className='container'>
                    <Navbar />
                    <div className='sidebar-content-wrapper'>
                         <SideBar />
                         <div className='content'>
                              <div className='main-content'>
                                   <div className='ingr-content'>
                                        {/* Filter and search section */}
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
                                        {/* Search and filter controls */}
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
                                                                 { value: "top_purine", label: "ค่าพิวรีนมากสุด" },
                                                                 { value: "low_purine", label: "ค่าพิวรีนน้อยสุด" }
                                                            ]}
                                                       />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   {modal && (
                                        <div className="modal">
                                             <div className="modal-content">
                                                  <button className="ingr-cancel--btn" onClick={toggleModal}>
                                                       <i class="fa-solid fa-xmark"></i>
                                                  </button>
                                                  <h1>เพิ่มวัตถุดิบ</h1>

                                                  <label>ชื่อวัตถุดิบ</label>
                                                  <input
                                                       type="text"
                                                       className="modal--input"

                                                       value={name}
                                                       onChange={handleNameChange}
                                                  />

                                                  <label>ค่าพิวรีน (มิลลิกรัม / 100 กรัม)</label>
                                                  <input
                                                       type="text"
                                                       className="modal--input"
                                                       value={purine}
                                                       onChange={handlePurineChange}
                                                  />

                                                  <label>ประเภท</label>
                                                  <select
                                                       className="ingr-form--select"
                                                       value={type}
                                                       onChange={(e) => setType(e.target.value)}
                                                  >
                                                       <option value="">เลือกประเภท</option>
                                                       <option value="เนื้อสัตว์">เนื้อสัตว์</option>
                                                       <option value="ผัก">ผัก</option>
                                                       <option value="ผลไม้">ผลไม้</option>
                                                       <option value="อื่น ๆ">อื่น ๆ</option>
                                                  </select>

                                                  <button className="ingr-save--btn" onClick={handleSave}>
                                                       บันทึก
                                                  </button>
                                             </div>
                                        </div>
                                   )}

                                   {/* switch role */}
                                   <div className='above-table'>
                                        <p>รวมทั้งหมด {activeButton === 'ทั้งหมด' ? ingrs.length : ingrsNutr.length} วัตถุดิบ</p>
                                        <div className='switch-btn'>
                                             <button
                                                  onClick={() => setActiveButton('ทั้งหมด')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ทั้งหมด' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ทั้งหมด' ? 'white' : 'black'
                                                  }}>ทั้งหมด </button>
                                             <button
                                                  onClick={() => setActiveButton('ของฉัน')}
                                                  style={{
                                                       backgroundColor: activeButton === 'ของฉัน' ? '#FFA13F' : 'white',
                                                       color: activeButton === 'ของฉัน' ? 'white' : 'black'
                                                  }}> ของฉัน </button>
                                        </div>

                                   </div>

                                   <table className='table-ingr'>
                                        <thead>
                                             <tr>
                                                  <th>ชื่อวัตถุดิบ</th>
                                                  <th>ค่าพิวรีน (มิลลิกรัม / 100 กรัม)</th>
                                                  <th>ประเภท</th>
                                                  <th>เพิ่มโดย</th>
                                                  <th></th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                        {activeButton === 'ทั้งหมด' ? (
                                             currentItems.length > 0 ? (
                                                  currentItems.map(item => renderItem(item))
                                             ) : (
                                                  <h2>ยังไม่มีข้อมูลวัตถุดิบ</h2>
                                             )
                                        ) : (
                                             ingrsNutr.length > 0 ? (
                                                  ingrsNutr.map(item => renderItem(item))
                                             ) : (
                                                  <h2>ยังไม่มีข้อมูลวัตถุดิบ</h2>
                                             )
                                        )}
                                        </tbody>
                                   </table>

                                   {/* Pagination controls */}
                                   <div className="pagination">
                                        <button
                                             onClick={() => paginate(currentPage - 1)}
                                             disabled={currentPage === 1}
                                             className="pagination-button"
                                        >
                                             ย้อนกลับ
                                        </button>
                                        {[...Array(totalPages).keys()].map(number => (
                                             <button
                                                  key={number}
                                                  onClick={() => paginate(number + 1)}
                                                  className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
                                             >
                                                  {number + 1}
                                             </button>
                                        ))}
                                        <button
                                             onClick={() => paginate(currentPage + 1)}
                                             disabled={currentPage === totalPages}
                                             className="pagination-button"
                                        >
                                             ถัดไป
                                        </button>
                                   </div>

                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}

export default IngrScreen;
