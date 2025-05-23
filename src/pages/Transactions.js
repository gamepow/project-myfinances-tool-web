import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import useFetchWithAuth from '../hooks/useAuth';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert'; // Import Alert
import Collapse from '@mui/material/Collapse'; // Import Collapse
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import { TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function Transactions() {
  const { user } = useUser();
  const fetchWithAuth = useFetchWithAuth(); // Use the custom hook
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [alertState, setAlertState] = useState({ open: false, severity: 'success', message: '' }); // State for alert
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null);   // State for end date

  function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD', // fallback if currency is null
      minimumFractionDigits: 2,
    }).format(amount);
  }

  useEffect(() => {
    const fethTransactions = async () => {
      try {
        const response = await fetchWithAuth(`/api/private/transaction/${user.id}`); // Pass the user id to the endpoint
        console.log('Transactions List response.data: ' + response.data.data); // Debugging transactions response
        setTransactions(response.data); // Update the transactions state with the fetched data  
      }
      catch (error) {
        console.error('Error fetching transactions: ', error);
      }
    };

    if (user?.id) {
      fethTransactions();
    }
  }, [user, fetchWithAuth]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.header,
      color: theme.palette.common.black,
      fontWeight: 'bold',
    }
  }));

  const handleDelete = async (transactionId) => {
    try {
      const response = await fetchWithAuth(`/api/private/transaction/${transactionId}`, {
        method: 'DELETE',
      });
      console.log('Delete transaction response: ', response); // Debugging delete response
      if (response.status === 200) {
        setTransactions(transactions.filter(tx => tx.transactionId !== transactionId));
        setAlertState({ open: true, severity: 'success', message: 'Transaction deleted successfully!' }); // Show success alert
      } else {
        console.error('Error deleting transaction: ', response);
        setAlertState({ open: true, severity: 'error', message: response.data?.message || 'Failed to delete transaction.' }); // Show error alert
      }
    } catch (error) {
      console.error('Error deleting transaction: ', error);
      setAlertState({ open: true, severity: 'error', message: 'An unexpected error occurred while deleting.' }); // Show error alert
    }
  };

  const handleDateRangeSubmit = async () => {
    if (!startDate || !endDate) {
      setAlertState({ open: true, severity: 'error', message: 'Please select both start and end dates.' });
      return;
    }

    try {
      const response = await fetchWithAuth(`/api/private/transaction/${user.id}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      setTransactions(response.data);
      setAlertState({ open: true, severity: 'success', message: 'Transactions filtered by date range.' });
    } catch (error) {
      console.error('Error fetching transactions: ', error);
      setAlertState({ open: true, severity: 'error', message: 'Failed to fetch transactions for the selected date range.' });
    }
  };

  const fetchFilteredTransactions = async () => {
    if (!startDate || !endDate) return; // Ensure both dates are selected

    try {
      const response = await fetchWithAuth(
        `/api/private/transaction/filter/${user.id}?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
      );
      setTransactions(response.data); // Update transactions with filtered data
    } catch (error) {
      console.error('Error fetching filtered transactions:', error);
    }
  };

  return (
    <Box sx={{ 
        marginTop: 0,
        display: 'flex',
        flexDirection: 'column', // Add this to stack items vertically
        width: '100%',
        }}
    >
       {/* Alert for success or error messages */}
        <Collapse in={alertState.open} sx={{ width: '100%', mb: 2 }}>
            <Alert
                severity={alertState.severity}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setAlertState(prev => ({ ...prev, open: false }))}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                {alertState.message}
            </Alert>
        </Collapse>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button variant="contained" onClick={fetchFilteredTransactions}>
              Filter
            </Button>
          </Box>
        </LocalizationProvider>
        {isMobile ? (
        // Card view for mobile
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}>
          {Array.isArray(transactions) && transactions.map((tx) => (
            <Card key={tx.transactionId} variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={ { fontWeight: 'bold' }}>
                  {tx.transactionType} - Category {tx.categoryId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Description: {tx.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amount: {formatCurrency(tx.amount, tx.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {tx.transactionDate}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                  <IconButton aria-label="delete" onClick={() => handleDelete(tx.transactionId)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        // Table view for desktop
        <TableContainer component={Paper} sx={{ overflowX: 'auto'}}>
            <Table stickyHeader sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <StyledTableCell>Transaction Type</StyledTableCell>
                    <StyledTableCell align="right">Category</StyledTableCell>
                    <StyledTableCell align="right">Description</StyledTableCell>
                    <StyledTableCell align="right">Amount</StyledTableCell>
                    <StyledTableCell align="right">Transaction Date</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(transactions) && transactions.map((tx) => (
                    <TableRow key={tx.transactionId}>
                      <TableCell>{tx.transactionType}</TableCell>
                      <TableCell align="right">{tx.categoryName}</TableCell>
                      <TableCell align="right">{tx.description}</TableCell>
                      <TableCell align="right">{formatCurrency(tx.amount, tx.currency)}</TableCell>
                      <TableCell align="right">{tx.transactionDate}</TableCell>
                      <TableCell align="right">
                        <IconButton aria-label="delete" onClick={() => handleDelete(tx.transactionId)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
        </TableContainer>
        )}
    </Box>
  );
}