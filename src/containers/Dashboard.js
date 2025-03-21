import React from 'react';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { useLocation } from 'react-router-dom';
import '../components/css/Main.css';
import '../components/css/Dashboard.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';

function Dashboard(){
    const { logout } = useUser();
    const navigate = useNavigation();
    const location = useLocation(); // Get current location

    const handleAddExpense = () =>{

    }

    // TODO change this with a DB select
    const customData = [
      { id: 0, value: 15, label: 'Apples'},
      { id: 1, value: 25, label: 'Bananas'},
      { id: 2, value: 20, label: 'Cherries'},
      { id: 3, value: 35, label: 'Dates'},
      { id: 5, value: 10, label: 'Lemon'},
      { id: 6, value: 5, label: 'Watermelon'},
      { id: 7, value: 30, label: 'Pineaple'},
    ];

    function CustomPieChart({ data }) {
      return (
        <Container>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Horizontal centering
            alignItems: 'center', // Vertical centering
            height: '60vh', // Ensures the box is separate from the top bar
            gap: 4
          }}>
            <Typography variant="h4" sx={{ mt: 4 }}>March 2025</Typography> {/* Add top margin */}
            <PieChart
              colors={['#50881f','#6f8400','#8c7d00','#a97300','#c56400','#de511a','#f2363d','#ff0761']}
              series={[
                {
                  data: data,
                  arcLabel: (item) => item.label,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: '60%',
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                },
              ]}
              width={550}
              height={350}
            />
            <Button variant="contained" size="large" onClick={handleAddExpense} >Add Expense</Button>
          </Box>
        </Container>
      );
    }

    return (
      <Box>
        <CustomPieChart data = {customData}/>
      </Box>
    );
}

export default Dashboard;