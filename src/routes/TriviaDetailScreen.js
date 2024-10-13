import React from 'react'
import '../components/Detail.css'
import { useLocation } from 'react-router-dom';

const options = {
    timeZone: "Asia/Bangkok",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

const optionsDMY = {
    timeZone: "Asia/Bangkok", year: 'numeric', month: 'long', day: 'numeric',
};

const optionsTime = {
    timeZone: "Asia/Bangkok", hour: 'numeric', minute: 'numeric', second: 'numeric'
};

function TriviaDetailScreen() {
    const location = useLocation();
    const { triviaData } = location.state || {};

    const calculateTimeAgo = (createdAt) => {
        const currentTime = new Date();
        const postTime = new Date(createdAt);
        const timeDiff = Math.abs(currentTime - postTime) / 36e5;  // คำนวณต่างเป็นชั่วโมง
        
        if (timeDiff < 1) {
             return `${Math.floor(timeDiff * 60)} นาทีที่แล้ว`;
        } else if (timeDiff < 24) {
             return `${Math.floor(timeDiff)} ชั่วโมงที่แล้ว`;
        } else {
             return postTime.toLocaleString("th-TH", optionsDMY);
        }
    };

    return (
        <>
            <div className='triv-detail-content'>
                <div className='triv-detail'>
                    <img className='triv-pic' alt={`รูปภาพของ ${triviaData.head}`} src={triviaData.image} />
                    <div className='triv-detail-flex'>
                        <h1>{triviaData.head}</h1>
                        <p>อัพเดตล่าสุด {calculateTimeAgo(triviaData.updatedAt)}</p>
                    </div>
                    <hr className='hr-line'/>
                    <div className='triv-info'>
                        {triviaData.content}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TriviaDetailScreen