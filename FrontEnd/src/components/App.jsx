import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import LandingPage from "./LandingPage";


function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/Login" element={<Login />}></Route>
        <Route path="/SignUp" element={<SignUp />}></Route>
        <Route path="/Home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
