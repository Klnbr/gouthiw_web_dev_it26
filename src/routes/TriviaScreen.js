import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import '.././App.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function TriviaScreen() {
     const navigate = useNavigate();
     const [trivs, setTrivia] = useState([]);

     useEffect(() => {
          const fetchTriviaData = async () => {
               try {
                    const response = await axios.get("http://localhost:5500/trivias", { timeout: 10000 });
                    setTrivia(response.data);
               } catch (error) {
                    console.log("Error fetching trivias data", error.message)
               }
          }
          fetchTriviaData();
     }, [])

     const handleItemPress = async (itemId) => {
          try {
               const response = await axios.get(`http://localhost:5500/trivia/${itemId}`);
               const triviaData = response.data;

               navigate('/trivia', { state: { triviaData } });
          } catch (error) {
               console.log('Error fetching trivia data', error.message);
          }
     };

     const renderItem = (item) => (
          <div className='trivia-card' onClick={() => handleItemPress(item._id)} key={item._id}>
               <img className='trivia-pic' alt={`รูปภาพของ ${item.head}`} src={item.image} />
               <div className='trivia-des'>
                    <h1>{item.head}</h1>
                    <div className='description'>
                         <p>{item.content}</p>
                    </div>
               </div>
          </div>
     );

     return (
          <>
               <Navbar />
               <div className='trivia-block'>
                    <div className='add-trivia-card' onClick={() => navigate('/trivia')}>
                         <i class="fa-solid fa-plus" cl> เพิ่มเกร็ดความรู้</i>
                    </div>
                    {trivs.length > 0 ? (
                         trivs.map(item => renderItem(item))
                    ) : (
                         <h2>ยังไม่มีข้อมูลเกร็ดความรู้</h2>
                    )}
               </div>
          </>
     )
}

export default TriviaScreen
