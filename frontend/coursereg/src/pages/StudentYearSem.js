import React, { useState } from 'react';
import Message from './Message';
import { Link } from 'react-router-dom';

export const StudentYearSem = () => {
    const [year, setYear] = useState('');
    const [sem, setSem] = useState('');
    const [message, setMessage] = useState(null);
    const [courses, setCourses] = useState([]);

    async function studentSearchYearSem(e) {
        e.preventDefault();

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/course/year-sem-course/`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    year: parseInt(year),
                    sem:parseInt(sem)
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setCourses(data);
            } else {
                setMessage("Please enter a valid year and semester for the student");
                setTimeout(() => {
                    window.location.href="/student-yearsem";
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
            <div>
                <h3>Student Course History For the Semester</h3>
                <ul id="list" className="list">
                    {courses.map((course, index) => (
                        <li key={index} className="course-item">
                            <h4>{course.course_name}</h4>
                            <p>Credits: {course.credits}</p>
                            <p>Year: {course.year}</p>
                            <p>Semester: {course.sem}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="container">
            <Link to="/"> ← Go Back</Link>
            <h2>Course Registration Portal</h2>
            {message && <Message message={message} colour="#FF6961" />}

            <h3>Search for a Student Courses For Year and Semester</h3>
            <form id="form" onSubmit={studentSearchYearSem}>
                <div className="form-control">
                    <label htmlFor="text">Year </label>
                    <input type="text" id="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Enter the year of study..." />
                </div>
                <div className="form-control">
                    <label htmlFor="text">Semester </label>
                    <input type="text" id="text" value={sem} onChange={(e) => setSem(e.target.value)} placeholder="Enter the semester of study..." />
                </div>
                <button className="btn">SEARCH STUDENT COURSES</button>
            </form>

            {CourseSection()}
        </div>
    );
};
