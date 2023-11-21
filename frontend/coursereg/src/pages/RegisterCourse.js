import React, { useState, useEffect } from 'react';
import './Register.css';
import Message from './Message';
import { Link } from 'react-router-dom';

export const RegisterCourse = () => {
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState(null);
    const [colour, setColour] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    window.location.href = "/login";
                    return;
                }
                const response = await fetch('http://127.0.0.1:8000/course/courses/',{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setCourses(data);
                } else {
                    console.error('Failed to fetch courses:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, []);

    const registerCourse = async (courseId, index) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/course/register-course/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    course_id: courseId
                })
            });

            if (response.ok) {
                setMessage('Course registered successfully');
                setColour("#90EE90");
                setTimeout(() => {
                    window.location.href="/register-course";
                }, 1000);
                console.log('Course registered successfully');
            } else {
                setMessage('Course registration failed');
                setColour("#FF6961");
                setTimeout(() => {
                    window.location.href="/register-course";
                }, 1000);
                console.error('Failed to register course:', response.statusText);
            }
        } catch (error) {
            console.error('Error registering course:', error);
        }
    };

    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <h2>Course Registration Portal</h2>

            <div>
                <h4>REGISTER COURSES FOR THE SEMESTER</h4>
            </div>

            {message && <Message message={message} colour={colour}/>}

            {courses.length === 0 ? (
                <p>No courses available for registration.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Credits</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course, index) => (
                                <tr key={course.id}>
                                    <td>{course.course_name}</td>
                                    <td>{course.credits}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            onClick={() => registerCourse(course.id, index)}
                                            disabled={course.is_registered}
                                            style={{ backgroundColor: course.is_registered ? "#FF6961" : "#4CAF50" }}
                                        >
                                            {course.is_registered ? 'Registered' : 'Register'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
