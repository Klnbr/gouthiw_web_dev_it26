import React, { useEffect, useState } from 'react';
import '../../components/Detail.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../middleware/Auth';
import axios from 'axios';

const optionsDMY = {
    timeZone: "Asia/Bangkok", year: 'numeric', month: 'long', day: 'numeric',
};
function TriviaDetailScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { triviaData } = location.state || {};
    const { nutrData } = useAuth();
    const [editButton, setEditButton] = useState(false);
    const [hasDeadline, setHasDeadline] = useState(null);  // corrected state usage
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [pendingReports, setPendingReports] = useState(0);  // corrected state usage

    useEffect(() => {
        if (nutrData && triviaData && nutrData._id === triviaData.creator._id) {
            setEditButton(true);
            if (triviaData.edit_deadline) {
                setHasDeadline(triviaData.edit_deadline);
            }
        }
    }, [nutrData, triviaData]);  // added triviaData to the dependency array

    const calculateTimeAgo = (createdAt) => {
        const currentTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
        const postTime = new Date(createdAt).toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
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
            const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/trivia/${itemId}`);
            const triviaData = response.data;

            navigate('/report', { state: { triviaData } });
        } catch (error) {
            console.log('Error fetching trivia data', error.message);
        }
    };

    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`https://gouthiw-web-dev-it26.onrender.com/trivia/${itemId}`);
            navigate('/trivia-list');  // หลังจากลบเสร็จแล้ว redirect ไปที่หน้ารายการ trivia
        } catch (error) {
            console.error("Error deleting trivia", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleItemPress = async (itemId) => {
        try {
            const response = await axios.get(`https://gouthiw-web-dev-it26.onrender.com/trivia/${itemId}`);
            const triviaData = response.data;

            navigate('/trivia', { state: { triviaData } });
        } catch (error) {
            console.log('Error fetching menu data', error.message);
        }
    };

    return (
        <>
            <div className='container'>
                <Navbar />
                <div className='content-no-sidebar'>
                    <button className="btn-goback" onClick={() => navigate(-1)}>
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    {editButton &&
                        <>
                            <button className="btn-edit" onClick={() => handleItemPress(triviaData._id)}>
                                แก้ไข
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(triviaData._id)}>
                                ลบ
                            </button>
                        </>
                    }

                    <div className='triv-detail-content'>
                        <div className='dropdown-container-tv'>
                            <i
                                className="fa-solid fa-ellipsis-vertical dropdown-icon"
                                onClick={toggleDropdown}
                            ></i>

                            {dropdownVisible && (
                                <div className="dropdown-trivia">
                                    <button onClick={() => handleReport(triviaData._id)}>รายงาน</button>
                                </div>
                            )}
                        </div>
                        <div className='triv-detail'>
                            <img className='triv-pic' alt={`รูปภาพของ ${triviaData.head}`} src={triviaData.image} loading="lazy" />
                            <h1>{triviaData.head}</h1>
                            <div className='triv-detail-flex'>
                                <p>เขียนโดย: {triviaData.creator.firstname} {triviaData.creator.lastname}</p>
                                <p>อัพเดตล่าสุด: {calculateTimeAgo(triviaData.updatedAt)}</p>
                            </div>
                            <hr className='hr-line' />
                            <div className='triv-info' dangerouslySetInnerHTML={{ __html: triviaData.content }} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TriviaDetailScreen;
