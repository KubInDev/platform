import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import PreTestPage from './Pages/PreTest';
import MainTestPage from './Pages/MainTest';
import FinalTestPage from './Pages/PostTest';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pre-test" element={<PreTestPage />} />
                <Route path="/main-test" element={<MainTestPage />} />
                <Route path="/post-test" element={<FinalTestPage />} />
            </Routes>
        </Router>
    );
}

export default App;
