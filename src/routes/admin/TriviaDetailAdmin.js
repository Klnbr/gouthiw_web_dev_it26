import React, { useEffect, useState } from 'react';
import '../../components/Detail.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../middleware/Auth';
import axios from 'axios';

const optionsDMY = {
    timeZone: "Asia/Bangkok", year: 'numeric', month: 'long', day: 'numeric',
};

export default function TriviaDetailAdmin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { triviaData } = location.state || {};
    const { nutrData } = useAuth();
    const [editButton, setEditButton] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        // Show edit button if the logged-in user is the creator
        if (nutrData && triviaData && nutrData._id === triviaData.creator._id) {
            setEditButton(true);
        }
    }, [nutrData, triviaData]);

    const calculateTimeAgo = (createdAt) => {
        const currentTime = new Date();
        const postTime = new Date(createdAt);
        const timeDiff = Math.abs(currentTime - postTime) / 36e5;

        if (timeDiff < 1) {
            return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
        } else if (timeDiff < 24) {
            return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
        } else {
            return postTime.toLocaleString("th-TH", optionsDMY);
        }
    };

    const handleReport = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:5500/trivia/${itemId}`);
            const triviaData = response.data;

            console.log("triviaData: ", triviaData);
            navigate('/report', { state: { triviaData } });
        } catch (error) {
            console.log('Error fetching trivia data', error.message);
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

  return (
    <>
            <div className='container'>
                <Navbar />
                <div className='content-no-sidebar'>
                    <button className="btn-goback" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>

                    <div className='triv-detail-content'>
                        

                        <div className='triv-detail'>
                            <img className='triv-pic' alt={`รูปภาพของ ${triviaData.head}`} src={triviaData.image} />
                            <div className='triv-detail-flex'>
                                <div>
                                    <h1>{triviaData.head}</h1>
                                    <p>เขียนโดย: {triviaData.creator.firstname} {triviaData.creator.lastname}</p>
                                </div>
                                <div>
                                    <p>วันที่สร้าง: {calculateTimeAgo(triviaData.createdAt)}</p>
                                    <p>อัพเดตล่าสุด: {calculateTimeAgo(triviaData.updatedAt)}</p>
                                </div>

                            </div>
                            <hr className='hr-line' />
                            <div className='triv-info' dangerouslySetInnerHTML={{ __html: triviaData.content }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
  )
}
