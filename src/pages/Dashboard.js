import React, { useState, useEffect, useCallback } from 'react';
import useFetchWithAuth from '../hooks/useAuth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useUser } from '../context/UserContext';
import '../layouts/css/Main.css';
import '../layouts/css/Dashboard.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TransactionDialog from './TransactionDialog'; // Import the new component
import PieChartComponent from '../layouts/PieChart'; // Import the PieChartComponent
import { Typography, Container } from '@mui/material';
import dayjs from 'dayjs'; // Import dayjs

function Dashboard() {
  const { user } = useUser();
  const [categories, setCategories] = useState([]); // State to store categories
  const [openDialog, setOpenDialog] = useState(false); // State to control the popup
  const [transactionExpensesSummary, setTransactionExpensesSummary] = useState([]); // State to store transaction summary
  const [transactionIncomeSummary, setTransactionIncomeSummary] = useState([]); // State to store transaction summary
  const currentMonthYear = dayjs().format('MMMM YYYY'); // Format the current date
  const fetchWithAuth = useFetchWithAuth(); // Use the custom hook
  const [refreshCharts, setRefreshCharts] = useState(false);

  const handleTransactionSaved = () => {
    setRefreshCharts(prev => !prev); // Toggle to trigger useEffect
  };

  // Fetch Categories from the API
  useEffect(() => {
    console.log('User:', user); // Debugging user object

    const fetchCategories = async () => {
      try {
        const response = await fetchWithAuth(`/api/private/category/${user.id}`); // Pass the user id to the endpoint
        console.log('Categories response: ' + response.data); // Debugging categories response
        setCategories(response.data); // Update the categories state with the fetched data
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    if (user?.id) {
      fetchCategories(); // Fetch categories only if the user ID is available
    }
  }, [user, fetchWithAuth]);

  useEffect(() => {
    const fetchTransactionExpensesSummary = async () => {
      try {
        const response = await fetchWithAuth(`/api/private/transaction/summary/expenses/${user.id}`);
        console.log('Transaction Summary Expense Response:', response.data);
        setTransactionExpensesSummary(response.data);
      } catch (error) {
        console.error('Error fetching transaction summary:', error);
      }
    };
  
    if (user?.id) {
      fetchTransactionExpensesSummary();
    }
  }, [user, fetchWithAuth, refreshCharts]);

  useEffect(() => {
    const fetchTransactionIncomeSummary = async () => {
      try {
        const response = await fetchWithAuth(`/api/private/transaction/summary/income/${user.id}`);
        console.log('Transaction Summary Income Response:', response.data);
        setTransactionIncomeSummary(response.data);
      } catch (error) {
        console.error('Error fetching transaction summary:', error);
      }
    };
  
    if (user?.id) {
      fetchTransactionIncomeSummary();
    }
  }, [user, fetchWithAuth, refreshCharts]);

  const handleAddTransaction = useCallback(() => {
    setOpenDialog(true);
  }, [setOpenDialog]); // Add setOpenDialog as a dependency

  const handleCloseDialog = useCallback((event, reason) => {
    if (reason !== 'backdropClick') {
      setOpenDialog(false);
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ 
              display: 'flex',
              justifyContent: 'center', 
              flexDirection: 'column', // Change flex direction to column
              alignItems: 'center', // Center items horizontally
              mt: 2 }}>
          <Typography variant="h4" sx={{ mt: 4 }}>
              {currentMonthYear} {/* Display the current month and year */}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, // Responsive layout
            alignItems: 'center',
            justifyContent: 'center', 
            gap: 3,
            mt: 2 
          }}
        >
          <Box sx={{ width: { xs: '100%', md: 400 }, mb: {xs: 2, md: 0 }}}>
            <PieChartComponent data={transactionExpensesSummary} title="Expenses" />
          </Box>
          <Box sx={{ width: { xs: '100%', md: 400 } }}>
            <PieChartComponent data={transactionIncomeSummary} title="Income" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
          <Button variant="contained" size="large" onClick={handleAddTransaction}>
            Add Transaction
          </Button>
        </Box>
        <TransactionDialog
          open={openDialog}
          onClose={handleCloseDialog}
          categories={categories}
          onTransactionSaved={handleTransactionSaved}
        />
      </Box>
    </LocalizationProvider>
  );
}

export default Dashboard;