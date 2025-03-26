import React, { useState } from 'react'
import '../components/Login.css';
import { Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middleware/Auth';
import Logo from '../images/logo_temporary.png'

function LoginScreen() {
    const navigate = useNavigate();
    const { handleSignin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className='sign-in--container'>
            <div className='signin-card'>
                <img alt="gouthiw-logo" src={Logo} loading="lazy" width="100" height="90"></img>
                <h1>เข้าสู่ระบบ</h1>
                <div className='signin-form'>
                    <label htmlFor='signin-email'>อีเมล</label>
                    <Input className='form--inputbox' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor='signin-password'>รหัสผ่าน</label>
                    <Input type='password' className='form--inputbox' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button className='signin-btn' onClick={() => handleSignin({ email, password })}>เข้าสู่ระบบ</button>
                    <b>ยังไม่มีมีบัญชี?  <p onClick={() => navigate('/signup')}>ลงทะเบียน</p></b>
                </div>
            </div>
           
        </div>
    );
}

export default LoginScreen;
