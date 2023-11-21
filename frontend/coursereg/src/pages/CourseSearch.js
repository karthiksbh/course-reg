import React, { useState, useEffect } from 'react';
import Message from './Message';
import { Link } from 'react-router-dom';

export const CourseSearch = () => {
  const [year, setYear] = useState('');
  const [sem, setSem] = useState('');

  const [dropdown, setDropDown] = useState(false);

  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState('');
  const [students, setStudents] = useState([]);

  const [message, setMessage] = useState('');
  const [colour,setColour] = useState('');

  const years = [1,2, 3, 4];
  const semesters = [1, 2];

  const fetchCourses = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/course/course-search/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          year: parseInt(year),
          sem: parseInt(sem)
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setCourses(data);
        setDropDown(true);
      } else {
        setMessage("Please enter a valid year and semester for the student");
        setColour("#FF6961");
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    // Fetch students for the selected course
    try {
      const response = await fetch('http://127.0.0.1:8000/course/student-course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ course_id: course })
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const CourseSearchSection = () => {
    return (
        <div>
            <form onSubmit={handleCourseSubmit}>
            <div>
            <label>Course:</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="" disabled>Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.course_name}</option>
              ))}
            </select>
          </div>
          <div>
            <button className="btn" type="submit">Search Students</button>
          </div> 
            </form>
        </div>
    );
};

const StudentSection = () => {
  if (!students || students.length === 0) {
      return null;
  }
  return (
      <div>
          <h3>Students For the Given Course</h3>
          <ul id="list" className="list">
              {students.map((student, index) => (
                  <li key={student.id}><h4>{student.reg_no}</h4> (Name: {student.first_name} {student.last_name})</li>
              ))}
          </ul>
      </div>
  );
};

  return (
    <div className="container">
      <Link to="/"> ← Go Back</Link>
      <h2>Course Registration Portal</h2>
      <div>
        <h4>SEARCH COURSES</h4>
      </div>
      {message && <Message message={message} colour={colour}/>}
      <form onSubmit={fetchCourses}>
      <div>
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="" disabled>Select a year</option>
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>{yearOption}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Semester:</label>
          <select value={sem} onChange={(e) => setSem(e.target.value)}>
            <option value="" disabled>Select a semester</option>
            {semesters.map((semesterOption) => (
              <option key={semesterOption} value={semesterOption}>{semesterOption}</option>
            ))}
          </select>
        </div>
        <button type="submit" class="btn">Search Courses</button>
      </form>

      {dropdown && <CourseSearchSection/>}

    {StudentSection()}
    </div>
  );
};

