import React, {useState} from 'react';
import '../../assets/css/signin.css';
import { useHistory } from "react-router-dom";
import axios from 'axios';

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const goToRegister = () => {
        history.push('/register');
    }

    const goToLogin = () => {
        history.push('/login');
    }

    const callLogin = (e) => {
        e.preventDefault();

        if (email && password) {
            axios.post('https://radiant-beach-45888.herokuapp.com/auth/signin')
            .then((result) => {
                console.log('result ', result);
                alert('login done');
            })
            .catch((err) => console.log('error in login ', err));
        }
    }

    return (
        <div className="container">
            <form method='post' onSubmit={(e) => callLogin(e)}>
                <div className="form_container p-3 p-md-5 mt-5">
                    <div className="form_detail">
                        <label>E-mail</label>
                        <input type="email" name="email" required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form_detail">
                        <label>PASSWORD</label>
                        <input type="password" name="password" required onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="forgot_pass"><a><span>forgot password</span></a></div>
                    <div className="remember">
                        <input type="checkbox" name="" /><label>Remember me</label>
                    </div>
                    <div className="login"><button>Login</button></div>
                    <div className="text-center newbie">are You a newbie? <a onClick={goToRegister} style={{ cursor:"pointer" }}>Sign Up</a></div>
                </div>
            </form>
        </div>
    )
}

export default Login
