import React from 'react';
import { Input } from "antd";
import './CreateMenu.css';

function Form3({ formData, setFormData }) {
    const { TextArea } = Input;

    const handleMethodChange = (index, value) => {
        // ตรวจสอบให้กรอกได้เฉพาะตัวอักษรและตัวเลข (ภาษาไทยและภาษาอังกฤษ) และไม่เป็นช่องว่าง
        if (!/^[a-zA-Z0-9ก-๙\s]*$/.test(value)) {
            alert("กรุณากรอกข้อมูลเฉพาะตัวอักษรและตัวเลขเท่านั้น");
            return;
        }

        // กรองค่าที่เป็นช่องว่างเปล่า หรือเฉพาะช่องว่าง
        const newMethod = [...formData.method];
        newMethod[index] = value.trim(); // ตัดช่องว่างที่ไม่จำเป็น
        setFormData({ ...formData, method: newMethod });
    };

    const addMethod = () => {
        setFormData({ ...formData, method: [...formData.method, ""] });
    };

    const handleDeleteMethod = (index) => {
        const newMethods = formData.method.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            method: newMethods
        });
    };

    const handleSave = () => {
        // ตรวจสอบว่า ทุกขั้นตอนถูกกรอกข้อมูลหรือไม่
        if (formData.method.some(step => step.trim() === "  ")) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน (ไม่ให้มีช่องว่าง)");
            return; // ห้ามบันทึกถ้ายังมีช่องว่าง
        }
        // หากกรอกครบถ้วนแล้ว ทำการบันทึกข้อมูล
        console.log("ข้อมูลครบถ้วนพร้อมบันทึก:", formData.method);
        // บันทึกข้อมูลที่ต้องการ
    };

    return (
        <div className='form3-containner'>
            <div className='form--hidden-ingr'>
                <h2>วิธีการทำอาหาร</h2>
            </div>
            <hr className='hr-line-full' />
            {formData.method.map((step, index) => (
                <div key={index}>
                    <div className='form3--input'>
                        <label htmlFor={`step-${index + 1}`}>
                            ขั้นตอนที่ {index + 1}
                        </label>
                        <i className="fa-solid fa-circle-xmark" onClick={() => handleDeleteMethod(index)}></i>
                    </div>
                    <TextArea 
                        className='form--inputbox' 
                        placeholder='ระบุขั้นตอนการทำอาหาร' 
                        rows={4}
                        value={step}
                        onChange={(e) => handleMethodChange(index, e.target.value)} 
                    />
                </div>
            ))}
            <button className='add-step-btn' onClick={addMethod}>
                เพิ่มขั้นตอนถัดไป
            </button>

        </div>
    );
}

export default Form3;
