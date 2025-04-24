import React, { useEffect } from "react";
import { useNavigation } from '../context/NavigationContext';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();
    const navigate = useNavigation();

    useEffect(() => {
        if (!user) {
            // redirect to login page
            navigate('/login', { replace:true});
        }
    }, [user, navigate]);
    
    if(!user){
        return null; // prevent rendering children before redirection
    }

    return children;
};

export default ProtectedRoute;