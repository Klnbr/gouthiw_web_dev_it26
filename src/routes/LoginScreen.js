import React from 'react';
import '../components/Login.css';

function LoginScreen() {
    return (
        <div className='web'>
            <div className='card'>
                <h1>เข้าสู่ระบบ</h1>
                <div className='form'>
                    
                    <label>อีเมล</label><br />
                    <input /><br />
                    <label>รหัสผ่าน</label><br />
                    <input  /><br />
                    <button className='btn-login'>เข้าสู่ระบบ</button>
                </div>
                <br />
                <b>ยังไม่มีมีบัญชี?     <a href='/signup'>  ลงทะเบียน</a></b>
            </div>
            sty
        </div>
    );
}

export default LoginScreen;
