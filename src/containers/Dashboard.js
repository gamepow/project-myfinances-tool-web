import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import '../components/css/Main.css';

function Dashboard(){
    const { user, logout } = useUser();

    const navigate = useNavigation();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLoginPage = () => {
        navigate('/login')
    }

    if (!user) {
        return (
            <div className="landingPage">
                <header>
                    <h1>My Project Administrator</h1>
                    <button onClick={handleLoginPage}>Login</button>
                </header>
                <main>
                    <div>
                        <p>Access not available, please authenticate first.</p>
                        <button onClick={handleLoginPage}>Login</button>
                    </div>
                </main>
                <footer>
                    <p>&copy; {new Date().getFullYear()} My Project Admin</p>
                </footer>
            </div>
        );
    }

    return (

        <div className="dashboardPage">
            <header>
                <h1>Welcome to your dashboard.</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} My Project Admin</p>
            </footer>
        </div>
    );
}

export default Dashboard;