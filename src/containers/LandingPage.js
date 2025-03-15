//import './components/css/Main.css'
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage(){
    const navigate = useNavigate();

    const handleLoginPage = () => {
        navigate('/login')
    }   

    return (
        <div>
            <h1>Herramienta de Administracion de Proyectos</h1>
            <button onClick={handleLoginPage}>Login Page</button>
        </div>
    );
}

export default LandingPage;