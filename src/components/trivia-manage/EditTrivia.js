import React, { useState, useEffect } from 'react'
import './CreateTrivia.css';
import { Input } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import { firebase } from '../../firebase'
import axios from 'axios';

function EditTrivia() {
     const navigate = useNavigate();
     const location = useLocation();
     const { triviaData } = location.state || {};

     const [head, setHead] = useState("")
     const [image, setImage] = useState(null)
     const [content, setContent] = useState("")

     useEffect(() => {
          if (triviaData) {
               console.log("triviaData: ", triviaData)
               setHead(triviaData.head);
               setImage(triviaData.image);
               setContent(triviaData.content);
          }
     }, [triviaData]);

     const handleUpdateTriv = async () => {
          try {
               let imageUrl = image;
               if (image && typeof image !== 'string') {
                    const storageRef = firebase.storage().ref();
                    const imageRef = storageRef.child(`images/${image.name}`);
                    await imageRef.put(image);
                    imageUrl = await imageRef.getDownloadURL();
                    console.log("Image uploaded successfully. URL:", imageUrl);
               }
          
               const trivData = {
                    head: head,
                    image: imageUrl,
                    content: content,
                    isDeleted: false
               };
          
               console.log("Triv Data:", trivData);
          
               const response = await axios.put(`http://localhost:5500/trivia/${triviaData._id}`, trivData);
               console.log("Response from server:", response);
          
               if (response.status === 201) {
                    alert("อัพเดตสำเร็จ");
                    navigate('/trivias');
               }
          } catch (error) {
               alert("อัพเดตไม่สำเร็จ");
               console.log("error updating trivia", error);
               if (error.response) {
                    console.log("Error response data:", error.response.data);
               }
          }
     };

     const handleImageChange = (e) => {
          const selectedFile = e.target.files[0];
          if (selectedFile) {
               setImage(selectedFile)
          } else {
               console.log("No file selected!")
          }
     };

     const triggerFileInputClick = () => {
          document.getElementById('imageUpload').click();
     };

     return (
          <>
               <div className='form-trivia'>
                    <h2>แก้ไขเกร็ดความรู้</h2>
                    <div className='form--input'>
                         <label htmlFor='menu-name'>ภาพประกอบ</label>
                         <div className='form--drop-pic' onClick={triggerFileInputClick}>
                              {image && (
                                   <img
                                        className='form--pic'
                                        alt={`รูปภาพของ ${head}`}
                                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                   />
                              )}
                              <input type="file" id="imageUpload" onChange={handleImageChange} />
                              <i className="fa-regular fa-images"></i>
                         </div>
                         </div>
                    <div>
                         <div className='form--input'>
                         <label htmlFor='menu-type'>
                              หัวข้อ
                         </label>
                         <Input className='form--inputbox' value={head} onChange={(e) => setHead(e.target.value)} />
                         </div>
                         <div className='form--input'>
                         <label htmlFor='menu-type'>
                              เนื้อหา
                         </label>
                         <TextArea className='form--inputbox' rows='6' value={content} onChange={(e) => setContent(e.target.value)} />
                         </div>
                    </div>
                    <div className='form-group form-bt'>
                         <button type='button' className='btn-addtv' onClick={handleUpdateTriv}>บันทึกข้อมูล</button>
                         <button type='button' className='btn-cancel' onClick={() => navigate('/trivias')}>ยกเลิก</button>
                    </div>
               </div>
          </>
     )
}

export default EditTrivia