import React, { useState } from 'react'
import './CreateTrivia.css';
import { Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../middleware/Auth';
import TextArea from 'antd/es/input/TextArea';
import { firebase } from '../../firebase'
import axios from 'axios';

function CreateTrivia() {
    const navigate = useNavigate();
    const { userData, logout } = useAuth();

    const [head, setHead] = useState("")
    const [image, setImage] = useState(null)
    const [content, setContent] = useState("")

    const handleAddTriv = async () => {
        try {
            if (!image) {
                alert("Please select an image!");
                return;
            }

            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`images/${image.name}`);
            await imageRef.put(image);
            const imageUrl = await imageRef.getDownloadURL();
            console.log("Image uploaded successfully. URL:", imageUrl);
        
            const trivData = {
                head: head,
                image: imageUrl,
                content: content,
                isDeleted: false
            };
        
            console.log("Triv Data:", trivData);
        
            const response = await axios.post("http://localhost:5500/addTrivia", trivData);
            console.log("Response from server:", response);
        
            if (response.status === 201) {
                alert("เพิ่มเข้าสำเร็จ");
                navigate('/trivias');
            }
        } catch (error) {
            alert("เพิ่มเข้าไม่สำเร็จ");
            console.log("error creating trivia", error);
            if (error.response) {
                console.log("Error response data:", error.response.data);
            }
        }
    };

    const handleAddTrivId = async () => {
        try {
            if (!image) {
                alert("Please select an image!");
                return;
            }

            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child(`images/${image.name}`);
            await imageRef.put(image);
            const imageUrl = await imageRef.getDownloadURL();
            console.log("Image uploaded successfully. URL:", imageUrl);
        
            const trivData = {
                head: head,
                image: imageUrl,
                content: content,
                isDeleted: false
            };
        
            console.log("Triv Data:", trivData);
        
            const response = await axios.post(`http://localhost:5500/trivia/${userData._id}`, trivData);
            console.log("Response from server:", response);
        
            if (response.status === 201) {
                alert("เพิ่มเข้าสำเร็จ");
                navigate('/trivias');
            }
        } catch (error) {
            alert("เพิ่มเข้าไม่สำเร็จ");
            console.log("error creating trivia", error);
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
                <h2>เพิ่มเกร็ดความรู้</h2>
                <div className='form--input'>
                        <label htmlFor='menu-name'>ภาพประกอบ</label>
                        <div className='form--drop-pic' onClick={triggerFileInputClick}>
                            {image ? (
                                <img
                                    className='form--pic'
                                    alt={`url: ${image.name}`}
                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                />
                            ) : (
                                <i className="fa-regular fa-images"></i>
                            )}
                            <input 
                                type="file"
                                id="imageUpload"
                                onChange={handleImageChange} />
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
                        <button type='button' className='btn-cancel' onClick={() => navigate('/trivias')}>ยกเลิก</button>
                        <button type='button' className='btn-addtv' onClick={handleAddTrivId}>บันทึกข้อมูล</button>
                    </div>
              
            </div>
        </>
    )
}

export default CreateTrivia