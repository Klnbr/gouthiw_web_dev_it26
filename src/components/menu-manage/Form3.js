import React from 'react'
import { Input, Select } from "antd";
import './CreateMenu.css';

function Form3() {
     const { TextArea } = Input;
     return (
          <div>
               <div className='form--hidden-ingr'>
                    <h2>วิธีการทำอาหาร</h2>
               </div>
               <hr className='hr-line-full' />
               <div className='form--input'>
                    <label htmlFor='ingr-name'>
                         ขั้นตอนที่ 1
                    </label>
                    <TextArea className='form--inputbox' placeholder='ระบุขั้นตอนการทำอาหาร' rows={4} />
               </div>
          </div>
     )
}

export default Form3