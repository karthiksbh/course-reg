import React, { useState, useEffect } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';

export const StudentAll = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    window.location.href = "/login";
                    return;
                }
                const response = await fetch('http://127.0.0.1:8000/course/all-courses/',{
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


    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <h2>Course Registration Portal</h2>

            <div>
                <h4>VIEW ALL COURSES REGISTERED</h4>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Credits</th>
                            <th>Year</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr key={course.id}>
                                <td>{course.course_name}</td>
                                <td>{course.credits}</td>
                                <td>{course.year}</td>
                                <td>{course.sem}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
