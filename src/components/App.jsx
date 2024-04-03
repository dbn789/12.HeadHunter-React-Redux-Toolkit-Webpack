import React from 'react';
import './app.css';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Main from './main/main';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Main} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
