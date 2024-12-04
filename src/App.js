import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import PreTestPage from './Pages/PreTest';
import TestPage from './Pages/Test';
import FinalTestPage from './Pages/PostTest';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pre-test" element={<PreTestPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/final-test" element={<FinalTestPage />} />
            </Routes>
        </Router>
    );
}

export default App;
