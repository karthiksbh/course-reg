import React, { useState, useEffect } from 'react';

export const Home = () => {
    const [name, setName] = useState('');
    const [isFac,setisFac] = useState('');

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = "/login";
                return;
            }
            const response = await fetch(process.env.REACT_APP_BASE_URL + '/course/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }
            const data = await response.json();
            console.log(data.first_name);
            var fullName = "";
            if (data.last_name === null) {
                fullName = data.first_ame;
            } else {
                fullName = data.first_name + " " + data.last_name;
            }
            console.log(fullName);
            setName(fullName);
            setisFac(data.is_fac);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = "/login";
    };

    const registerCourse = () => {
        window.location.href = "/register-course";
    };

    
    const registeredCourses = () => {
        window.location.href = "/student-all";
    };

    const registeredCoursesYearSem = () => {
        window.location.href = "/student-yearsem";
    };

    const profileUser = () => {
        window.location.href = "/profile";
    };

    const StudentSection = () => {
        return (
            <div>
                <h3>Role: Student</h3>
                <br></br>
                <h4>Student Functionalities: </h4>
                <br></br>
                <button className="btn" style={{ backgroundColor: "#2abd2a" }} onClick={registerCourse}>REGISTER COURSE</button>
                <button className="btn" style={{ backgroundColor: "#2abd2a" }} onClick={registeredCoursesYearSem}>FILTER COURSES BY YEAR AND SEM</button>
                <button className="btn" style={{ backgroundColor: "#2abd2a" }} onClick={registeredCourses}>VIEW ALL REGISTERED COURSES</button>
            </div>
        );
    };

    const TeacherSection = () => {
        return (
            <div>
                <h3>Role: Teacher</h3>
                <br></br>
                <h4>Teacher Functionalities: </h4>
                <br></br>
                <button className="btn" style={{ backgroundColor: "#2abd2a" }} onClick={studentSearch}>SEARCH STUDENT BY REGISTRATION ID</button>
                <button className="btn" style={{ backgroundColor: "#2abd2a" }} onClick={courseSearch}>SEARCH STUDENT BY COURSE</button>
            </div>
        );
    };

    const studentSearch = () => {
        window.location.href = "/student-search";
    };

    const courseSearch = () => {
        window.location.href = "/course-search";
    };

      
    return (
        <div className="container">
            <h2>Welcome {name},</h2>
            {isFac && <TeacherSection />}
            {!isFac && <StudentSection />}
            <button className="btn" style={{ backgroundColor: "#FF6961" }} onClick={profileUser}>VIEW AND EDIT USER PROFILE</button>
            <button className="btn" style={{ backgroundColor: "#FF6961" }} onClick={logout}>LOGOUT USER</button>
        </div>

    )
}
