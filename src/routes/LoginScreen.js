import React, { useState } from 'react'
import '../components/Login.css';
import { Input } from "antd";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../middleware/Auth';
import Logo from '../images/logo_temporary.png'
import BottomScreen from '../images/bottom_screen.png'

function LoginScreen() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignin = async () => {
        try {
            const response = await axios.post("http://localhost:5500/signin", { email, password });
            if (response.status === 201) {
                login(response.data.token, response.data.nutr);
                alert("เข้าสู่ระบบสำเร็จ");
                navigate('/');
            }
        } catch (error) {
            alert("เข้าสู่ระบบไม่สำเร็จ");
            console.log("error logging in", error);
            if (error.response) {
                console.log("Error response data:", error.response.data);
            }
        }
    };

    return (
        <div className='sign-in--container'>
            <div className='signin-card'>
                <img alt='gouthiw logo' src={Logo} />
                <h1>เข้าสู่ระบบ</h1>
                <div className='signin-form'>
                    <label htmlFor='signin-email'>อีเมล</label>
                    <Input className='form--inputbox' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label htmlFor='signin-password'>รหัสผ่าน</label>
                    <Input type='password' className='form--inputbox' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button className='signin-btn' onClick={handleSignin}>เข้าสู่ระบบ</button>
                    <b>ยังไม่มีมีบัญชี?  <a href='/signup'>ลงทะเบียน</a></b>
                </div>
            </div>
            {/* <img className='screen--btm' alt='' src={BottomScreen} /> */}
        </div>
    );
}

export default LoginScreen;
