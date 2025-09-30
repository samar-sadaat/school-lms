// import { useEffect } from 'react'
import './App.css'
// import Header from './components/header'
import SignUp from './components/signup'
import SignIn from './components/singIn'
import StudentDashboard from './components/student-dashbord'
import Students from './components/Students'
import { Route, Routes } from 'react-router-dom'

function App() {
  // const navigate = useNavigate();

  // useEffect(()=>{
  //   navigate('/signup');
  // },[])
  
  return (
    <>
    {/* <SignUp /> */}
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/students" element={<Students />} />
        <Route path="/studentsDashbord" element={<StudentDashboard />} />
      </Routes>
    </>
  )
}

export default App
