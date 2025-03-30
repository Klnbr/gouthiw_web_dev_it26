import React, { useState, useEffect } from 'react'
import './CreateTrivia.css';
import { Input, Select } from "antd";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../middleware/Auth';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import Editor from 'react-simple-wysiwyg';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


function CreateTrivia() {
    const navigate = useNavigate();
    const { nutrData } = useAuth();

    const [head, setHead] = useState("")
    const [image, setImage] = useState(null)
    const [content, setContent] = useState("")
    const [type, setType] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/"); // ถ้าไม่มี token ให้กลับไปหน้า login
            return;
        }
    }, [navigate]);

    const handleAddTrivId = async () => {
        try {
            if (!image) {
                alert("Please select an image!");
                return;
            }

            const storage = getStorage();
            const storageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(storageRef, image);

            // ดึง URL ของภาพที่อัปโหลด
            const imageUrl = await getDownloadURL(storageRef);
            console.log("Image uploaded successfully. URL:", imageUrl);

            if (!head || !content || !type) {
                alert("กรุณากรอกข้อมูลให้ครบ")
            }

            const trivData = {
                head: head,
                image: imageUrl,
                content: content,
                trivia_type: type,
                isDeleted: false
            };

            console.log("Triv Data:", trivData);

            const response = await axios.post(`https://gouthiw-web-dev-it26.onrender.com/trivia/${nutrData._id}`, trivData);
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
            <div className='container'>
                <Navbar />
                <div className='content-no-sidebar'>
                    <div className='main-content'>
                    <button className="btn-goback" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                        <div className='form-trivia'>
                            <h1>เพิ่มเกร็ดความรู้</h1>
                            <div className='trivia-flex'>
                                <Input
                                    className='trivia-form--input'
                                    value={head}
                                    onChange={(e) => setHead(e.target.value)}
                                    placeholder='หัวข้อเกร็ดความรู้'
                                />
                                <Select
                                    className='trivia-form--select'
                                    placeholder="เลือกประเภท"
                                    // value={type}
                                    onChange={(value) => setType(value)}
                                    optionFilterProp="children"
                                    options={[
                                        {
                                            value: "อาหาร",
                                            label: "อาหาร"
                                        },
                                        {
                                            value: "โรค",
                                            label: "เกี่ยวกับโรค"
                                        },
                                        {
                                            value: "ออกกำลังกาย",
                                            label: "ออกกำลังกาย"
                                        },
                                        {
                                            value: "อื่น ๆ",
                                            label: "อื่น ๆ"
                                        },
                                    ]}
                                />
                            </div>

                            <Editor
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='รายละเอียด'
                            />
                            {/* <TextArea 
                                className='form--inputbox' 
                                rows='6' 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='รายละเอียด' 
                            /> */}

                            <div className='form--drop-pic' onClick={triggerFileInputClick}>
                                {image ? (
                                    <img
                                    loading="lazy"
                                        className='form--pic'
                                        alt={`url: ${image.name}`}
                                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                    />
                                ) : (
                                    <div>
                                        <i className="fa-regular fa-images"></i>
                                        <p>ภาพประกอบ</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="imageUpload"
                                    onChange={handleImageChange} />
                            </div>

                            <div className='form-group form-bt'>
                                <button
                                    className='btn-cancel'
                                    onClick={() => navigate('/trivias')}>ยกเลิก</button>
                                <button
                                    className='btn-addtv'
                                    onClick={handleAddTrivId}>บันทึกข้อมูล</button>
                            </div>
                        </div>

                        
                    </div>
                </div>

            </div>
        </>
    )
}

export default CreateTrivia