import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../middleware/Auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "antd";
import axios from 'axios';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const optionsDMY = {
    timeZone: "Asia/Bangkok",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

const AnswerTopic = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { topicData } = location.state || {};
    const { nutrData } = useAuth();
    const [loading, setLoading] = useState(false);
    const { TextArea } = Input;
    const [answer, setAnswer] = useState('');
    const [image, setImage] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImage(files);
    };

    const handleAnswer = async () => {
        if (!answer || image.length === 0) {
            alert("กรุณาใส่คำตอบและเลือกรูปภาพ");
            return;
        }

        try {
            setLoading(true);

            // อัปโหลดรูปทั้งหมด
            const storage = getStorage();
            const imageUrls = [];

            for (let file of image) {
                const storageRef = ref(storage, `answer_image/${file.name}`);
                await uploadBytes(storageRef, file);
                const imageUrl = await getDownloadURL(storageRef);
                imageUrls.push(imageUrl); // เก็บ URL ของภาพ
            }

            // ตรวจสอบว่า URL ของภาพถูกเก็บ
            console.log("✅ Image URLs:", imageUrls);

            // ส่งข้อมูลคำตอบพร้อมกับ URL ของภาพที่อัปโหลด
            const ansData = {
                nutr_id: nutrData._id,
                answer_detail: answer,
                answer_image: imageUrls, // เก็บเป็น Array ของ URL
              };
              
              const response = await axios.put(`http://localhost:5500/topic/answer/${topicData._id}`, ansData);
              
            if (response.status === 200) {
                alert("ตอบกระทู้สำเร็จ");
                navigate('/topics');
            }
        } catch (error) {
            console.log("error creating topic", error);
            alert("ตอบกระทู้ไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = (item) => (
        <div className='topic-answer-card' key={item._id}>
            <div className='topic-content'>
                <h1>{item.answer_detail}</h1>
                <div className='topic-user'>
                    <div className='flex'>
                        <i className="fa-solid fa-user-nurse"></i>
                        <p>{item.nutrDetails?.firstname} {item.nutrDetails?.lastname}</p>
                    </div>
                    <div className='topic-images'>
                    {Array.isArray(item.answer_image) && item.answer_image.length > 0 ? (
  item.answer_image.map((img, index) => (
    <img key={index} src={img} alt={`รูปที่ ${index + 1}`} className='topic-img' />
  ))
) : (
  <p>ไม่มีรูปภาพ</p>
)}

                    </div>

                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className='container'>
                <Navbar />
                <div className='content-no-sidebar'>
                    <div className='main-content'>
                        <div className='topic-detail-card'>
                            <div className='topic-detail-content'>
                                <h1>{topicData.title}</h1>
                            </div>
                            <hr className='hr-line' />
                            <div className='topic-detail'>
                                <p>{topicData.detail}</p>
                            </div>
                            <div className='topic-images'>
                                {Array.isArray(topicData.image) && topicData.image.length > 0 ? (
                                    topicData.image.map((img, index) => (
                                        <img key={index} src={img} alt={`รูปที่ ${index + 1}`} className='trivia-pic' />
                                    ))
                                ) : (
                                    <p>ไม่มีรูปภาพ</p>
                                )}
                            </div>
                        </div>

                        <hr className='hr-line-80' />

                        <div className='topic-answer-card'>
                            <TextArea
                                className='form--inputbox'
                                placeholder='กรอกคำตอบของคุณที่นี่'
                                rows={8}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            />
                            <input type="file" multiple onChange={handleImageChange} />
                            <div className='topic-btn'>
                                <div className='topic-user'>
                                    <i className="fa-solid fa-user-nurse"></i>
                                    <p>{nutrData.firstname} {nutrData.lastname}</p>
                                </div>
                                <button onClick={handleAnswer}>ตอบกระทู้</button>
                            </div>
                        </div>

                        <div className='width-80'>
                            <p>การตอบกลับทั้งหมด</p>
                        </div>
                        {Array.isArray(topicData.answer) && topicData.answer.filter(item => item && item.answer_detail).length > 0 ? (
                            topicData.answer.map(item => renderItem(item))
                        ) : (
                            <div className='topic-answer-card'>
                                <p>ยังไม่มีการตอบกลับ</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnswerTopic;
