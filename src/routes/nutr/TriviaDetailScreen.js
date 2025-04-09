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
    const [hasDeadline, setHasDeadline] = useState(null);  
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [pendingReports, setPendingReports] = useState(0); 
    const [Ingrs, setIngrs] = useState([]);
    const [timeLeftText, setTimeLeftText] = useState('');

    useEffect(() => {
        if (nutrData && triviaData && nutrData._id === triviaData.creator._id) {
            setEditButton(true);
            if (triviaData.edit_deadline) {
                setHasDeadline(triviaData.edit_deadline);
                calculateTimeRemain(triviaData.edit_deadline);

                const interval = setInterval(() => {
                    autoDeleteIfExpired(triviaData._id, triviaData.edit_deadline);
                }, 60000)

                return () => clearInterval(interval);
            }
        }
    }, [nutrData, triviaData]);

    const calculateTimeAgo = (deadlineString) => {
        const now = new Date();
        const deadline = new Date(deadlineString);
        const diff = deadline - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            setTimeLeftText(`คุณมีเวลาแก้ไขอีก ${days} วัน ${hours} ชั่วโมง ${minutes} นาที ก่อนจะถูกลบ`);
        } else {
            setTimeLeftText('ครบกำหนดแก้ไข');
        }
    };

    const autoDeleteIfExpired = async (itemId, deadlineString) => {
        const now = new Date();
        const deadline = new Date(deadlineString);
    
        if (now >= deadline) {
            try {
                const response = await axios.put(`https://gouthiw-health.onrender.com/trivia/${itemId}`, {
                    head: triviaData.head,
                    image: triviaData.image,
                    content: triviaData.content,
                    isVisible: false,
                    isDeleted: true,
                });
    
                if (response.status === 200) {
                    console.log('เปลี่ยนเป็น isDeleted: true แล้ว');
                    setTimeLeftText('ครบกำหนดแล้วแบ้ส');
    
                    // ถ้าอยากซ่อน UI เลยด้วย:
                    setEditButton(false);
                }
            } catch (error) {
                console.error('ไม่สามารถอัปเดต isDeleted:', error);
            }
        }
    };
    

    const calculateTimeRemain = () => {
        const now = new Date();
        const deadline = new Date(hasDeadline);
        const diff = deadline - now;
  
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
  
          setTimeLeft({ days, hours, minutes });
        } else {
          setTimeLeft('หมดเวลาแก้ไข');
        }
      }

    const handleReport = async (itemId) => {
        try {
            const response = await axios.get(`https://gouthiw-health.onrender.com/trivia/${itemId}`);
            const triviaData = response.data;

            navigate('/report', { state: { triviaData } });
        } catch (error) {
            console.log('Error fetching trivia data', error.message);
        }
    };

    const handleDelete = async (itemId) => {
        const confirmDelete = window.confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?");
        if (!confirmDelete) {
             return; // ถ้าไม่ยืนยัน จะไม่ทำการลบ
        }

        try {
           const response = await axios.delete(`https://gouthiw-health.onrender.com/trivia/${itemId}`);

               if (response.status === 200) {
                    alert("ลบสำเร็จ");
                    const response = await axios.get("https://gouthiw-health.onrender.com/trivias", { timeout: 1000 });
                    setIngrs(response.data);
               }
        } catch (error) {
            console.error("Error deleting trivia", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleEdit = async (itemId) => {
        try {
            const response = await axios.get(`https://gouthiw-health.onrender.com/trivia/${itemId}`);
            const triviaData = response.data;

            navigate('/edit-trivia', { state: { triviaData }  });
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
                            <button className="btn-edit" onClick={() => handleEdit(triviaData._id)}>
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
                            {hasDeadline && (
                                <div className='triv-deadline'>
                                    <p>{timeLeftText}</p>
                                </div>
                            )}
                            <img className='triv-pic' alt={`รูปภาพของ ${triviaData.head}`} src={triviaData.image} />
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