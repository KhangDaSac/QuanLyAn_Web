import {Routes, Route, Navigate} from 'react-router-dom';
import Layout from './layout/Layout';
import LoginPage from './page/LoginPage';
import HomePage from './page/HomePage';
import './App.css'

function App() {

    return (
        <>
            <Routes>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<HomePage/>}/>
                </Route>
                <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
        </>
    )
}

export default App
