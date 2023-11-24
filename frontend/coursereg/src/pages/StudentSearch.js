import React, { useState } from 'react';
import Message from './Message';
import { Link } from 'react-router-dom';

export const StudentSearch = () => {
    const [regNo, setRegNo] = useState('');
    const [message, setMessage] = useState(null);

    const [courses, setCourses] = useState([]);

    async function studentSearch(e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/course/student-search/?reg_no=${regNo}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.length === 0) {
                    setMessage("No courses found for the student.");
                } else {
                    setCourses(data);
                    setMessage('');
                }

            } else {
                setMessage("Please enter a valid registration ID of the student");
                setTimeout(() => {
                    window.location.href = "/student-search";
                }, 1000);
            }
        } catch (error) {
            console.error('Error fetching student:', error);
            setMessage("An error occurred while fetching the student. Please try again.");
        }
    }

    const CourseSection = () => {
        if (!courses || courses.length === 0) {
            return null;
        }
        return (
            <div class="container">
                <h3>Student Course History</h3>
                <table className="course-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Credits</th>
                            <th>Year</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={index} className="course-item">
                                <td>{course.course_name}</td>
                                <td>{course.course_code}</td>
                                <td>{course.credits}</td>
                                <td>{course.year}</td>
                                <td>{course.sem}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        );
    };

    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <h2>Course Registration Portal</h2>
            {message && <Message message={message} colour="#FF6961" />}

            <h3>Search for a Student Courses</h3>
            <form id="form" onSubmit={studentSearch}>
                <div className="form-control">
                    <label htmlFor="text">Registration Number </label>
                    <input type="text" id="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} placeholder="Enter the registration ID..." />
                </div>
                <button className="btn">SEARCH STUDENT COURSES</button>
            </form>

            {CourseSection()}
        </div>
    );
};
