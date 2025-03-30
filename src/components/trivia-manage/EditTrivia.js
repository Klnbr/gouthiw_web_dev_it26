import React, { useState, useEffect } from 'react';
import './EditTrivia.css';
import { Input } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


function EditTrivia() {
     const navigate = useNavigate();
     const location = useLocation();
     const { triviaData } = location.state || {};

     const [head, setHead] = useState("");
     const [image, setImage] = useState(null);
     const [content, setContent] = useState("");

     useEffect(() => {
          if (triviaData) {
               setHead(triviaData.head);
               setImage(triviaData.image);
               setContent(triviaData.content);
          }
     }, [triviaData]);

     const handleUpdateTriv = async () => {
          try {
               console.log("Updating trivia with data:", { head, image, content });
               let imageUrl = image;
               if (image && typeof image !== 'string') {
                    const storage = getStorage();
                    const storageRef = ref(storage, `images/${image.name}`);
                    await uploadBytes(storageRef, image);
                    imageUrl = await getDownloadURL(storageRef);
                    console.log("Image uploaded successfully. URL:", imageUrl);
               }

               const trivData = {
                    head,
                    image: imageUrl,
                    content,
                    isDeleted: false,
               };

               const response = await axios.put(`https://gouthiw-health.onrender.com/trivia/${triviaData._id}`, trivData);
               console.log("Response from server:", response);
               if (response.status === 200 || response.status === 204) {
                    alert("อัพเดตสำเร็จ");
                    navigate('/trivias');
               }
          } catch (error) {
               console.error("Error updating trivia:", error);
               alert("อัพเดตไม่สำเร็จ");
          }
     };


     const handleImageChange = (e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
               if (selectedFile.type.startsWith('image/')) {
                    setImage(selectedFile);
               } else {
                    alert('กรุณาเลือกไฟล์ภาพ');
               }
          }
     };


     const triggerFileInputClick = () => {
          document.getElementById('imageUpload').click();
     };

     return (
          <>
               <Navbar />
               <div className="container">
                    <div className='content-no-sidebar'>
                         <button className="btn-goback" onClick={() => navigate(-1)}>
                              <i className="fa-solid fa-angle-left"></i>

                         </button>
                         <div className="form-trivia">
                            
                              <h2>แก้ไขเกร็ดความรู้</h2>
                              <div className="form--drop-pic" onClick={triggerFileInputClick}>
                                   {image && (
                                        <img
                                        loading="lazy"
                                             alt={`รูปภาพของ ${head}`}
                                             src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                             className="form--pic"
                                        />
                                   )}
                                   <input type="file" id="imageUpload" onChange={handleImageChange} />
                                   {!image && <i className="fa-regular fa-images"></i>}
                              </div>
                              <div className="form--input">
                                   <label>หัวข้อ</label>
                                   <Input className="form--inputbox" value={head} onChange={(e) => setHead(e.target.value)} />
                              </div>
                              <div className="form--input">
                                   <label>เนื้อหา</label>
                                   <TextArea
                                        className="form--inputbox"
                                        rows={6}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                   />
                              </div>
                              <div className="form-bt">
                                   <button className="btn-addtv" onClick={handleUpdateTriv}>บันทึกข้อมูล</button>
                                   <button className="btn-cancel" onClick={() => navigate('/trivias')}>ยกเลิก</button>
                              </div>
                         </div>
                    </div>
               </div>
          </>
     );
}

export default EditTrivia;
