import React from 'react';
import '../components/css/Main.css';
import Typography from '@mui/material/Typography';

function LandingPage(){

    return (
        
        <div className="landingPage">
            <main>
                <div>
                    <Typography color="primary" variant="h4" gutterBottom>
                        Manage your finances with ease
                    </Typography>
                    <Typography color="primary" variant="body1" gutterBottom>
                        Add expenses, handle your budget, create new categories, customize to your style...
                    </Typography>
                </div>
            </main>
        </div>
    );
}

export default LandingPage;