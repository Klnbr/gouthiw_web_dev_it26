import React from 'react'
import { Input, Select } from "antd";
import './CreateMenu.css';

function Form1() {
     return (
          <div>
               <div className='form--input'>
                    <label htmlFor='menu-name'>
                         ชื่ออาหาร
                    </label>
                    <Input className='form--inputbox' />
               </div>
               <div className='form--input'>
                    <label htmlFor='menu-type'>
                         ประเภท
                    </label>
                    <Select 
                         className='form--select'
                         placeholder="ระบุประเภทอาหาร"
                         optionFilterProp="children"
                         options={[
                              {
                                   value: "ผัด",
                                   label: "ผัด"
                              },
                              {
                                   value: "แกง",
                                   label: "แกง"
                              },
                              {
                                   value: "ทอด",
                                   label: "ทอด"
                              },
                              {
                                   value: "ตุ๋น",
                                   label: "ตุ๋น"
                              },
                         ]}
                    />
               </div>
               <div className='form--input'>
                    <label htmlFor='menu-name'>
                         ภาพประกอบ
                    </label>
                    <div className='form--drop-pic'>
                         <i class="fa-regular fa-images"></i>
                    </div>
               </div>
          </div>
     )
}

export default Form1