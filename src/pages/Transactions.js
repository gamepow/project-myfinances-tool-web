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

export default function Transactions() {
  const { user } = useUser();
  const fetchWithAuth = useFetchWithAuth(); // Use the custom hook
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [transactions, setTransactions] = useState([]); // State to store transactions

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
        console.log('Transactions List response.data: ' + response.data); // Debugging transactions response
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
      backgroundColor: theme.palette.common.primary,
      color: theme.palette.common.black,
      fontWeight: 'bold',
    }
  }));

  return (
    <Box sx={{ 
        marginTop: 2,
        display: 'flex',
        width: '100%',
        }}
    >
        {isMobile ? (
        // Card view for mobile
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
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
                  <IconButton aria-label="delete">
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
                        <IconButton aria-label="delete">
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