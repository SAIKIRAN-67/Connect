import { useState } from 'react'
import Signin from './pages/Signin'
import Signup from './pages/Signup';
import Home from './pages/Home';
import PostProblem from './pages/PostProblem';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import EditProblem from './pages/Editproblem';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/post' element={<PostProblem/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/edit' element={<EditProblem/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
