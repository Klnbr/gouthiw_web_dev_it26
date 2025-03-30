import React, { useState } from 'react';
import '../components/Register.css';
import { Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { firebase } from '.././firebase';
import axios from 'axios';
import { useAuth } from '../middleware/Auth';

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
   
    const defaultImage = "https://cdn-icons-png.flaticon.com/512/147/147131.png";
    const defaultBackground = "https://jamie-wong.com/images/color/Purple.png";

    const handleSignup = async () => {
        // ตรวจสอบว่าไม่มีช่องว่าง
        if (!firstname || !lastname || !license || !tel || !email || !password || !confirm) {
            alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
            return;
        }

        // ตรวจสอบอีเมล (เฉพาะ Gmail)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            alert("กรุณากรอกอีเมลให้ถูกต้อง (เฉพาะ Gmail เท่านั้น)");
            return;
        }

        // ตรวจสอบเบอร์โทรศัพท์ (ต้องมี 10 ตัว และขึ้นต้นด้วย 0)
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(tel)) {
            alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลักและขึ้นต้นด้วย 0)");
            return;
        }

        // ตรวจสอบรหัสผ่าน
        if (password.length < 6) {
            alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            return;
        }

        if (password !== confirm) {
            alert("รหัสผ่านไม่ตรงกัน กรุณาลองอีกครั้ง");
            return;
        }

        // ตรวจสอบว่าไม่มีอักษรพิเศษในชื่อ, นามสกุล และเลขที่ใบประกอบวิชาชีพ
        const nameRegex = /^[A-Za-zก-์ะ-ึิ-ุูเ-๎]+$/;  // Only letters and Thai characters
        if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
            alert("ชื่อและนามสกุลต้องประกอบด้วยตัวอักษรเท่านั้น");
            return;
        }

        // ตรวจสอบเลขที่ใบประกอบวิชาชีพ (ต้องเป็นตัวเลขเท่านั้น)
        const licenseRegex = /^[0-9ก-ฮ]+$/;  // Only numbers
        if (!licenseRegex.test(license)) {
            alert("เลขที่ใบประกอบวิชาชีพต้องเป็นตัวเลขเท่านั้น");
            return;
        }

        try {
            let imageUrl = defaultImage;

            if (image) {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child(`images/${image.name}`);
                await imageRef.put(image);
                imageUrl = await imageRef.getDownloadURL();
                console.log("Image uploaded successfully. URL:", imageUrl);
            }

            const nutrData = {
                firstname,
                lastname,
                password,
                license_number: license,
                tel,
                email,
                image_profile: imageUrl,
                image_background: defaultBackground,
                isDeleted: false
            };

            console.log("User Data:", nutrData);

            const response = await axios.post("https://gouthiw-health.onrender.com/register", nutrData);
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
            setImage(selectedFile);
        } else {
            console.log("No file selected!");
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
                            loading="lazy"
                                className='signup-form--image'
                                alt="คลิกที่นี่เพื่อเพิ่มรูปโปรไฟล์" 
                                onClick={triggerFileInputClick}
                                src={URL.createObjectURL(image)}
                            />
                         ) : (
                            <img
                            loading="lazy"
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
                        <Input className='form--inputbox' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                        <label htmlFor='signup-pass--confirm'>ยืนยันรหัสผ่าน</label>
                        <Input className='form--inputbox' type='password' value={confirm} onChange={(e) => setConfirm(e.target.value)} />

                        <button className='signup-btn' onClick={handleSignup}>ลงทะเบียน</button>
                        <b>มีบัญชีอยู่แล้ว? <p onClick={() => navigate('/signin')}>เข้าสู่ระบบ</p></b>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterScreen;
