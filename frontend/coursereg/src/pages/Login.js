import React, { useState } from 'react'
import Message from './Message';

export const Login = () => {

    const [reg_no, setregNo] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [colour,setColour] = useState('');

    async function loginUser(e) {
        e.preventDefault();
        
        const response = await fetch(process.env.REACT_APP_BASE_URL + '/course/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reg_no: reg_no,
                password: password
            })
        })


        const data = await response.json();
        if (response.status === 200) {
            localStorage.setItem('access_token', data.access_token);
            setMessage("✔ Login Success");
            setColour("#90EE90");
            setTimeout(() => {
                window.location.href="/";
            }, 1000);
        } else {
            setMessage("✘ Login Failed: Please check your registration ID and Password");
            setColour("#FF6961");
        }
    }

    const register = () => {
        window.location.href="/register";
      };

    return (
        <div className="container">
            <h2>Course Registration Portal</h2>
            <div>
                <h4>Login</h4>
            </div>
            {message && <Message message={message} colour={colour}/>}
            <>
                <h3>Login to View Your Profile</h3>
                <form id="form" onSubmit={loginUser}>
                    <div className="form-control">
                        <label htmlFor="text">Registration ID</label>
                        <input type="text" id="reg_no" value={reg_no} onChange={(e) => setregNo(e.target.value)} placeholder="Enter registration ID..." />
                    </div>
                    <div className="form-control">
                        <label
                        >Password<br /></label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password..." />
                    </div>
                    <button className="btn">LOGIN USER</button>
                    <button className="btn" style={{backgroundColor:"#FF6961"}} onClick={register}>DON'T HAVE AN ACCOUNT?</button>
                </form>
            </>
        </div>
    )
}
