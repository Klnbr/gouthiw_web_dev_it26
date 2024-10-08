import React, { useState } from 'react';
import { Steps } from "antd";
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import './CreateMenu.css';
import { useNavigate } from 'react-router-dom';

function CreateMenu() {
     const navigate = useNavigate();
     const steps = [
          {
               title: "ข้อมูลทั่วไป",
               content: <Form1/>
          },
          {
               title: "วัตถุดิบ",
               content: <Form2/>
          },
          {
               title: "วิธีการทำอาหาร",
               content: <Form3/>
          },
     ]

     const [current, setCurrent] = useState(0);

     const items = steps.map((item) => ({
          key: item.title,
          title: item.title,
          // icon: item.icon,
     }));

     const nextStepper = () => {
          setCurrent(current + 1);
     };

     const prevStepper = () => {
          setCurrent(current - 1);
     };

     return (
          <div className='step-container'>
               <div className='step-layout'>
                    <Steps current={current} items={items} labelPlacement="vertical" />
               </div>
               <div>{steps[current].content}</div>

               <div className='step-btn'>
                    <button className='step-btn--cancel' onClick={() => navigate('/menus')}>ยกเลิก</button>
                    <div className="step-btn-layout">
                         {current > 0 && (
                              <button className="step-btn--prev" onClick={() => prevStepper()}>
                                   ย้อนกลับ
                              </button>
                         )}
                         {current < steps.length - 1 && (
                              <button className="step-btn--next" onClick={() => nextStepper()}>
                                   ถัดไป
                              </button>
                         )}
                         {current === steps.length - 1 && (
                              <button className="step-btn--next">
                                   บันทึก
                              </button>
                         )}
                    </div>
               </div>
          </div>
     )
}

export default CreateMenu