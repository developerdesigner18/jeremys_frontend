import React, { useState, useEffect } from 'react';
import '../../assets/css/signup.css';
import { useHistory } from "react-router-dom";
import axios from 'axios';

function Register() {
    const history = useHistory();

    const [type, setType] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confpass, setConfpass] = useState('');
    const [image, setImage] = useState('');
    const [showImage, setShowImage] = useState('');

    const goToRegister = () => {
        history.push('/register');
    }

    const goToLogin = () => {
        history.push('/login');
    }

    const onImageChange = (e) => {
        let reader = new FileReader();
        setImage(e.target.files[0]);
        // setShowImage(reader.readAsDataURL(e.target.result));
    }

    const callRegister = async (e) => {
        e.preventDefault();

        if (
            firstName === undefined && lastName === undefined && email === undefined && password === undefined && confpass === undefined
        ) { 
            alert('fill up all detail');
            return;
        }
        else if (password !== confpass) {
            alert("password and confirm password not mathch");
        } else {
            const frmRegData = {
                firstName,
                lastName,
                email,
                password,
                type,
            };
            let fd = new FormData();
            fd.append('firstName', firstName);
            fd.append('lastName', lastName);
            fd.append('email', email);
            fd.append('password', password);
            if (image) fd.append('image', image);
            
            axios.post('https://radiant-beach-45888.herokuapp.com/auth/signup', fd)
            .then((result) => {
                console.log('result ', result); 
                alert('registration done');
            })
            .catch((err) => console.log('error ',err))
        }
    }

    return (
        <div className="container p-5 main mt-5">
            <div className="tab">
                <input type="radio" name="type" value="Fan" />Fan
                <input type="radio" name="type" value="Fan" />Star
                <input type="radio" name="type" value="Chef" />Chef
                <input type="radio" name="type" value="Stylist" />Stylist
                <input type="radio" name="type" value="Trainer" />Trainer
                <input type="radio" name="type" value="Advertiser" />Advertiser
            </div>

                <div id="fan" className="tabcontent active">
                    <form method="post" onSubmit={(e) => callRegister(e)}>
                        <div className="form_container d-flex">
                            <div className="form_left_container">
                                <div className="form_detail">
                                    <label>firstname</label>
                                    <input type="text" name="firstName" onChange={(e) => setFirstName(e.target.value)} required />
                                </div>
                                <div className="form_detail">
                                    <label>lastname</label>
                                    <input type="text" name="lastName" onChange={(e) => setLastName(e.target.value)} required />
                                </div>
                                <div className="form_detail">
                                    <label>e-mail</label>
                                    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form_detail">
                                    <label>password</label>
                                    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form_right_container">
                                <div className="upload">
                                    {/* <img src={showImage} /> */}
                                    <input type="file" onChange={(e) => onImageChange(e)} />
                                    <p>UPLOAD<br />PROFILE PHOTO</p>
                                </div>
                                <div className="form_detail">
                                    <label>confirm password</label>
                                    <input type="password" name="confpass" onChange={(e) => setConfpass(e.target.value)} required />
                                </div>
                            </div>
                        </div>
                        <div className="create_ac_container d-flex justify-content-center mt-5">
                            <button className="create_ac">Create My Account</button>
                        </div>
                        <div className="privacy">By clicking the button, you agree to our <span>Terms</span>, <span>Privacy</span> and <span>Security Policy</span>.</div>
                    </form>
                </div>
                    
                <div id="star" className="tabcontent">
                    <h3>Paris</h3>
                    <p>Paris is the capital of France.</p> 
                </div>
                <div id="chef" className="tabcontent">
                    <h3>Tokyo</h3>
                    <p>Tokyo is the capital of Japan.</p>
                </div>
                <div id="stylist" className="tabcontent">
                    <h3>London</h3>
                    <p>London is the capital city of England.</p>
                </div>
                
                <div id="trainer" className="tabcontent">
                    <h3>Paris</h3>
                    <p>Paris is the capital of France.</p> 
                </div>

                <div id="advertiser" className="tabcontent">
                    <h3>Tokyo</h3>
                    <p>Tokyo is the capital of Japan.</p>
                </div>
                
            </div>
    )
}

export default Register
