import React from 'react'
import { Input, Select } from "antd";
import './CreateMenu.css';

function Form2() {
     return (
          <div>
               <div className='form--hidden-ingr'>
                    <h2>วัตถุดิบที่ 1</h2>
                    <i class="fa-solid fa-caret-down"></i>
               </div>
               <hr className='hr-line-full' />
               <div className='form--input'>
                    <label htmlFor='ingr-name'>
                         ชื่อวัตถุดิบ
                    </label>
                    <Input className='form--inputbox' placeholder='ระบุชื่อวัตถุดิบ' />
               </div>
               <div className='form--input-2-col'>
                    <div className='form--input-1-col'>
                         <label htmlFor='ingr-amount'>
                              ปริมาณ
                         </label>
                         <Input className='form--inputbox' placeholder='ระบุปริมาณ' />
                    </div>
                    <div className='form--input-1-col'>
                         <label htmlFor='ingr-amount'>
                              หน่วย
                         </label>
                         <Select 
                              className='form--select'
                              placeholder="เลือกหน่วย"
                              optionFilterProp="children"
                              options={[
                                   {
                                        value: "กิโลกรัม",
                                        label: "กิโลกรัม"
                                   },
                                   {
                                        value: "กรัม",
                                        label: "กรัม"
                                   },
                                   {
                                        value: "ขีด",
                                        label: "ขีด"
                                   }
                              ]}
                         />
                    </div>
               </div>
               <div className='form--input-2-col'>
                    <div className='form--input-1-col'>
                         <label htmlFor='ingr-purine'>
                              พิวรีน
                         </label>
                         <Input className='form--inputbox' placeholder='ระบุพิวรีน' />
                    </div>
                    <div className='form--input-1-col'>
                         <label htmlFor='ingr-uric'>
                              กรดยูริก
                         </label>
                         <Input className='form--inputbox' placeholder='ระบุกรดยูริก' />
                    </div>
               </div>
          </div>
     )
}

export default Form2