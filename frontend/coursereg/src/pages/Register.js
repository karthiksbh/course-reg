import React, { useState } from 'react'
import Message from './Message';

export const Register = () => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [ph_no, setPhNo] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const [sem, setSem] = useState('');
    const [regNo, setregNo] = useState('');
    const [year, setYear] = useState('');

    const [message, setMessage] = useState(null);
    const [colour, setColour] = useState('');

    const isStudent = selectedOption === 'Student';

    async function registerUser(e) {
        e.preventDefault();

        const response = await fetch(process.env.REACT_APP_BASE_URL + '/course/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reg_no: regNo,
                first_name: fname,
                last_name: lname,
                email: email,
                ph_no:ph_no,
                password: password,
                sem:parseInt(sem),
                year:parseInt(year),
                is_fac:!isStudent
            })
        })

        console.log(response);
        if (response.status === 201) {
            setMessage("✔ User successfully registered");
            setColour("#90EE90");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
        } else {
            setMessage("✘ Please check if the details are correct and the email and registration ID is not registered");
            setColour("#FF6961");
        }
    }

    const StudentSection = () => {
        return (
            <div>
                <div className="form-control">
                    <label htmlFor="text">Year </label>
                    <input type="text" id="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Enter your year..." />
                </div>
                <div className="form-control">
                    <label htmlFor="text">Semester </label>
                    <input type="text" id="text" value={sem} onChange={(e) => setSem(e.target.value)} placeholder="Enter your semester..." />
                </div>
            </div>
        );
    };

    const login = () => {
        window.location.href = "/login";
    };


    return (
        <div className="container">
            <h2>Course Registration Portal</h2>

            <div>
                <h4>Register a New User</h4>
            </div>
            {message && <Message message={message} colour={colour} />}
            <>
                <h3>Register to Start using the Portal</h3>
                <form id="form" onSubmit={registerUser}>
                    <div className="form-control">
                        <label htmlFor="text">Registration Number </label>
                        <input type="text" id="text" value={regNo} onChange={(e) => setregNo(e.target.value)} placeholder="Enter your last registration ID..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">First Name *</label>
                        <input type="text" id="text" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="Enter your first name..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">Last Name </label>
                        <input type="text" id="text" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Enter your last name..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">Email *</label>
                        <input type="email" id="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="text">Phone Number *</label>
                        <input type="text" id="text" value={ph_no} onChange={(e) => setPhNo(e.target.value)} placeholder="Enter your phone number..." />
                    </div>
                    <div className="form-control">
                        <label
                        >Password *<br /></label>
                        <input type="password" id="amount" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password..." />
                    </div>
                    <div className="form-control">
                        <label htmlFor="dropdown">Student or Faculty?</label>
                        <select id="dropdown" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                            <option value="" disabled>Select an option</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                        </select>
                    </div>

                    {selectedOption === 'Student' && <StudentSection />}

                    <button className="btn">REGISTER USER</button>
                    <button className="btn" style={{ backgroundColor: "#FF6961" }} onClick={login}>ALREADY HAVE AN ACCOUNT?</button>
                </form>
            </>
        </div>
    )
}
