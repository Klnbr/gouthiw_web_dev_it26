import React, { useState } from 'react'
import '../components/Register.css';
import { Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { firebase } from '.././firebase'
import axios from 'axios';
import { useAuth } from '../middleware/Auth';
import BottomScreen from '../images/bottom_screen.png'

function RegisterScreen() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [license, setLicense] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [image, setImage] = useState(null);

    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSoW3g9hjXIasgon-kpzz-lD9z4SsalyPbZA&s"

    const handleSignup = async () => {
        if (password !== confirm) {
                alert("รหัสผ่านไม่ตรงกัน กรุณาลองอีกครั้ง");
                return;
            }
        
        try {
            let imageUrl = defaultImage;

            if (image) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${image.name}`);
                await imageRef.put(image);
                const imageUrl = await imageRef.getDownloadURL();
                console.log("Image uploaded successfully. URL:", imageUrl);
            }
            
            const userData = {
                firstname: firstname, 
                lastname: lastname, 
                password: password, 
                license_number: license, 
                tel: tel, 
                email: email, 
                image_profile: imageUrl,
                isDeleted: false
            };
        
            console.log("User Data:", userData);
        
            const response = await axios.post("http://localhost:5500/signup", userData);
            console.log("Response from server:", response);
        
            if (response.status === 201) {
                login(response.data.token, response.data.user);
                alert("ลงทะเบียนสำเร็จ กำลังพาคุณไปที่หน้าเข้าสู่ระบบ");
                navigate('/signin');
            }
        } catch (error) {
            alert("ลงทะเบียนไม่สำเร็จ");
            console.log("error sign up", error);
            if (error.response) {
                console.log("Error response data:", error.response.data);
            }
        }
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setImage(selectedFile)
        } else {
            console.log("No file selected!")
        }
    };

    const triggerFileInputClick = () => {
        document.getElementById('imageUpload').click();
    };

    return (
        <div className='sign-up--container'>
            <div className='signup-card'>
                <h1>ลงทะเบียน</h1>
                <div className='signup-form'>
                    <div className='signup-form--left'>
                        {image ? (
                            <img
                                className='signup-form--image'
                                alt="คลิกที่นี่เพื่อเพิ่มรูปโปรไฟล์" 
                                onClick={triggerFileInputClick}
                                src={URL.createObjectURL(image)}
                            />
                         ) : (
                            <img
                                className='signup-form--image'
                                alt="คลิกที่นี่เพื่อเพิ่มรูปโปรไฟล์"
                                onClick={triggerFileInputClick}
                                src={defaultImage}
                            />
                         )}
                        <input 
                            type="file"
                            id="imageUpload"
                            onChange={handleImageChange} />
                    </div>
                    <div className='signup-form--right'>
                        <label htmlFor='signup-firstname'>ชื่อ</label>
                        <Input className='form--inputbox' value={firstname} onChange={(e) => setFirstname(e.target.value)} />

                        <label htmlFor='signup-lastname'>นามสกุล</label>
                        <Input className='form--inputbox' value={lastname} onChange={(e) => setLastname(e.target.value)} />

                        <label htmlFor='signup-license'>เลขที่ใบประกอบวิชาชีพ</label>
                        <Input className='form--inputbox' value={license} onChange={(e) => setLicense(e.target.value)} />

                        <label htmlFor='signup-tel'>เบอร์โทรศัพท์</label>
                        <Input className='form--inputbox' value={tel} onChange={(e) => setTel(e.target.value)} />

                        <label htmlFor='signup-email'>อีเมล</label>
                        <Input className='form--inputbox' value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label htmlFor='signup-pass'>รหัสผ่าน</label>
                        <Input className='form--inputbox' value={password} onChange={(e) => setPassword(e.target.value)} />

                        <label htmlFor='signup-pass--confirm'>ยืนยันรหัสผ่าน</label>
                        <Input className='form--inputbox' value={confirm} onChange={(e) => setConfirm(e.target.value)} />

                        <button className='signup-btn' onClick={handleSignup}>ลงทะเบียน</button>
                        <b>มีบัญชีอยู่แล้ว?  <a href='/signin'>เข้าสู่ระบบ</a></b>
                    </div>
                </div>
            </div>
            {/* <img className='screen--btm' alt='' src={BottomScreen} /> */}
        </div>
    );
}

export default RegisterScreen;
