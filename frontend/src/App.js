import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import './App.css'

function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
         <Route path = "/" element = {<HomePage/>}/>
         <Route path = "/chats" element = {<ChatPage/>}/>
      </Routes>
      </Router>
    </div>
  );
}

export default App;
 