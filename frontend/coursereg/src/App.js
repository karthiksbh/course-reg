import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import {Register} from './pages/Register';
import {Home} from './pages/Home';
import {StudentSearch} from './pages/StudentSearch';
import { CourseSearch } from './pages/CourseSearch';
import {RegisterCourse} from './pages/RegisterCourse';
import {StudentAll} from './pages/StudentAll';
import {StudentYearSem} from './pages/StudentYearSem';
import {Profile} from './pages/Profile';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student-search" element={<StudentSearch />} />
          <Route path="/course-search" element={<CourseSearch />} />
          <Route path="/register-course" element={<RegisterCourse />} />

          <Route path="/student-all" element={<StudentAll />} />
          <Route path="/student-yearsem/" element={<StudentYearSem />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
