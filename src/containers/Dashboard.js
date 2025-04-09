import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { useLocation } from 'react-router-dom';
import '../components/css/Main.css';
import '../components/css/Dashboard.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import TransactionDialog from './TransactionDialog'; // Import the new component
import PieChartComponent from '../components/PieChart'; // Import the PieChartComponent

function Dashboard() {
  const { user, fetchWithAuth } = useUser();
  const [categories, setCategories] = useState([]); // State to store categories
  const [openDialog, setOpenDialog] = useState(false); // State to control the popup

  // Fetch Categories from the API
  useEffect(() => {
    console.log('User:', user); // Debugging user object

    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth(`/api/category/${user.id}`); // Pass the user id to the endpoint
        console.log('response.data: ' + response.data); // Debugging categories response
        setCategories(response.data); // Update the categories state with the fetched data
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    if (user?.id) {
      fetchCategories(); // Fetch categories only if the user ID is available
    }
  }, [user, fetchWithAuth]);

  const handleAddTransaction = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]); // Add setOpenDialog as a dependency

  const handleCloseDialog = useCallback((event, reason) => {
    if (reason !== 'backdropClick') {
      setOpenDialog(false);
    }
  }, []);

  const saveTransaction = useCallback((transactionData) => {
    // Log the user input data
    console.log('Transaction Data:', transactionData);

    setOpenDialog(false);
  }, []);

  // TODO change this with a DB select
  const customData = useMemo(() => [
    { id: 0, value: 15, label: 'Apples' },
    { id: 1, value: 25, label: 'Bananas' },
    { id: 2, value: 20, label: 'Cherries' },
    { id: 3, value: 35, label: 'Dates' },
    { id: 5, value: 10, label: 'Lemon' },
    { id: 6, value: 5, label: 'Watermelon' },
    { id: 7, value: 30, label: 'Pineaple' },
  ], []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <PieChartComponent data={customData} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" size="large" onClick={handleAddTransaction}>
          Add Transaction
        </Button>
      </Box>
        <TransactionDialog
          open={openDialog}
          onClose={handleCloseDialog}
          categories={categories}
          onSave={saveTransaction}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default Dashboard;