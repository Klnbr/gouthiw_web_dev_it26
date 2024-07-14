import React from 'react';
import '../components/Register.css';

function RegisterScreen() {
    return (
        <div className='web'>
            <div className='card'>
                <h1>ลงทะเบียน</h1>
                <div className='form'>
                    <label>ชื่อ-นามสกุล</label><br />
                    <input  /><br />
                    <label>เลขที่ใบประกอบวิชาชีพ</label><br />
                    <input /><br />
                    <label>เบอร์โทรศัพท์</label><br />
                    <input /><br />
                    <label>อีเมล</label><br />
                    <input /><br />
                    <label>รหัสผ่าน</label><br />
                    <input  /><br />
                    <button className='btn-regis'>ลงทะเบียน</button>
                </div>
                <br />
                <b>มีบัญชีอยู่แล้ว?     <a href='/login'>  เข้าสู่ระบบ</a></b>
            </div>
        </div>
    );
}

export default RegisterScreen;
