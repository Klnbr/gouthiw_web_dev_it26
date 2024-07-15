import React, { useState } from 'react';
import './CreateTrivia.css';
import { Input, Select } from "antd";
import { useNavigate } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';

function CreateTrivia() {
    const navigate = useNavigate();

    return (
        <>
            <div className='form-trivia'>
                <h2>เพิ่มเกร็ดความรู้</h2>
                <div className='form--input'>
                        <label htmlFor='menu-name'>
                            ภาพประกอบ
                        </label>
                        <div className='form--drop-pic'>
                            <i class="fa-regular fa-images"></i>
                        </div>
                    </div>
                <div>
                    <div className='form--input'>
                        <label htmlFor='menu-type'>
                            หัวข้อ
                        </label>
                        <Input className='form--inputbox' />
                    </div>
                    <div className='form--input'>
                        <label htmlFor='menu-type'>
                            เนื้อหา
                        </label>
                        <TextArea className='form--inputbox' rows='6'/>
                    </div>
                </div>
                <div className='form-group form-bt'>
                        <button type='button' className='btn-cancel' onClick={() => navigate('/trivias')}>ยกเลิก</button>
                        <button type='submit' className='btn-addtv'>บันทึกข้อมูล</button>
                    </div>
              
            </div>
        </>
    )
}

export default CreateTrivia