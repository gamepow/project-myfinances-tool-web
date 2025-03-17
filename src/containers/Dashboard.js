import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { useLocation } from 'react-router-dom';
import '../components/css/Main.css';
import '../components/css/Dashboard.css';

function Dashboard(){
    const { logout } = useUser();
    const navigate = useNavigation();
    const location = useLocation(); // Get current location
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleMenuClick = (route) => {
        navigate(route);
    }

    // TODO: Delete this placeholder once DB is connected
    const tasks = [
        {
        title: 'Design Mockups',
        description: 'Create mockups for the new landing page.',
        dueDate: '2025-03-08',
        status: 'In Progress',
        },
        {
        title: 'Backend API Integration',
        description: 'Integrate the backend API with the frontend.',
        dueDate: '2025-03-15',
        status: 'Pending',
        },
        {
        title: 'Testing and Debugging',
        description: 'Perform thorough testing and debugging.',
        dueDate: '2025-03-14',
        status: 'In Progress',
        },
    ];

    const getTaskColor = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        console.log(today);
        console.log(diffDays);
    
        if (diffDays > 5) {
          return 'green';
        } else if (diffDays >= 3 && diffDays <= 5) {
          return 'yellow';
        } else if (diffDays < 3) {
          return 'red';
        } else {
          return 'gray';
        }
      };

    return (

        <div className="dashboardPage">
            <header>
                <h1>Welcome to your Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <div className='dashboardContainer'>
                <aside className="dashboardMenu">
                    <ul>
                        <li onClick={() => handleMenuClick('/dashboard')}
                            className={location.pathname === '/dashboard' ? 'active' : ''}
                        > Dashboard</li>
                        <li
                            onClick={() => handleMenuClick('/projects')}
                            className={location.pathname === '/projects' ? 'active' : ''}
                        > Projects</li>
                        <li onClick={() => handleMenuClick('/tasks')}
                            className={location.pathname === '/tasks' ? 'active' : ''}
                        >Tasks</li>
                        <li onClick={() => handleMenuClick('/teams')}
                            className={location.pathname === '/teams' ? 'active' : ''}
                        >Teams</li>
                        <li onClick={() => handleMenuClick('/reports')}
                            className={location.pathname === '/reports' ? 'active' : ''}
                        >Reports</li>
                    </ul>
                </aside>
                <div className="dashboardContent">
                <main>
                    <h3>Upcoming Tasks</h3>
                    <table>
                        <tbody>
                            {tasks.map((task, index) => (
                            <tr key={index}>
                                <td className="task-cell"
                                    style={{ backgroundColor: getTaskColor(task.dueDate) }}>
                                    <div className="task-title">{task.title}</div>
                                    <div className="task-description">{task.description}</div>
                                    <div className="task-due-date">Due: {task.dueDate}</div>
                                    <div className="task-status">Status: {task.status}</div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </main>
                </div>
            </div>
            <footer>
                <p>&copy; {new Date().getFullYear()} My Project Admin</p>
            </footer>
        </div>
    );
}

export default Dashboard;