import React from 'react';
import '../components/css/Main.css';
import { useNavigation } from '../context/NavigationContext';

function LandingPage(){
    const navigate = useNavigation();

    const handleLoginPage = () => {
        navigate('/login')
    }   

    return (

        <div className="landingPage">
            <header>
                <h1>My Project Administrator</h1>
                <button onClick={handleLoginPage}>Login</button>
            </header>
            <main>
                <div>
                    <h2> Manage your project with ease</h2>
                    <p>Workflow, task management and more...</p>
                </div>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} My Project Admin</p>
            </footer>
        </div>
    );
}

export default LandingPage;