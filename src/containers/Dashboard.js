import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { useLocation } from 'react-router-dom';
import '../components/css/Main.css';
import '../components/css/Dashboard.css';
import Stack from '@mui/material/Stack';

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
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between'}} >

        </Stack>
    );
}

export default Dashboard;