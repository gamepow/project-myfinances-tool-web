import React, { useState, useCallback, useEffect } from 'react';
import useFetchWithAuth from '../hooks/useAuth';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  InputAdornment,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useUser } from '../context/UserContext';
import dayjs from 'dayjs';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function TransactionDialog({ open, onClose, categories, onTransactionSaved}) {
  const { user } = useUser();
  const fetchWithAuth = useFetchWithAuth(); // Use the custom hook
  const [transactionType, setTransactionType] = useState('');
  const [categoryId, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);

  // Error states for each field
  const [transactionTypeError, setTransactionTypeError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [transactionDateError, setTransactionDateError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const clearForm = useCallback(() => {
    setTransactionType('');
    setCategory('');
    setAmount('');
    setDescription('');
    setTransactionDate(dayjs());

    setTransactionTypeError(false);
    setCategoryError(false);
    setAmountError(false);
    setDescriptionError(false);
    setTransactionDateError(false);
  }, []);

  useEffect(() => {
    if (open) {
      clearForm();
    }
  }, [open, clearForm]);

  const handleTransactionType = useCallback((event) => {
    setTransactionType(event.target.value);
  }, []);

  const handleCategoryChange = useCallback((event) => {
    setCategory(event.target.value);
  }, []);

  const handleSave = useCallback(() => {
    setLoading(true);

    // Reset errors
    setTransactionTypeError(false);
    setCategoryError(false);
    setAmountError(false);
    setDescriptionError(false);
    setTransactionDateError(false);

    let hasErrors = false;

    if (!transactionType) {
      setTransactionTypeError(true);
      hasErrors = true;
    }
    if (!categoryId) {
      setCategoryError(true);
      hasErrors = true;
    }
    if (!amount) {
      setAmountError(true);
      hasErrors = true;
    }
    if (!description) {
      setDescriptionError(true);
      hasErrors = true;
    }
    if (!transactionDate) {
      setTransactionDateError(true);
      hasErrors = true;
    }

    if (hasErrors) {
      setAlertMessage('Please fill in all required fields.');
      setLoading(false); // Stop loading if there are errors
      setOpenAlert(true); // Show alert if there are errors
      return;
    }

    const transactionData = {
      transactionType,
      categoryId,
      amount: parseFloat(amount),
      description,
      transactionDate: transactionDate.format('YYYY-MM-DD'),
      userId: user.id,
    };

    console.log('Transaction Data:', transactionData); // Log the user input data

    // call rest point
    fetchWithAuth('/api/private/transaction/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    })
      .then(response => {
        console.log('Response:', response.transactionId); // Log the response for debugging
        if (response.transactionId === null) {
          throw new Error('Network response was not ok');
        }
        if (onTransactionSaved) onTransactionSaved(); // <-- Add this line
        onClose(); // Close the dialog on successful save
        return response;
      })
      .then(data => {
        console.log('Success:', data);
        onClose(); // Close the dialog on successful save
      })
      .catch(error => {
        console.error('Error:', error);
        setAlertMessage('Add Transaction failed. Please try again.');
        setOpenAlert(true); // Show alert if there was an error
        // Handle error (e.g., display an error message to the user)
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of success or failure
      });
    
  }, [transactionType, categoryId, amount, description, transactionDate, onTransactionSaved]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disablePortal disableEscapeKeyDown>
      <DialogTitle>New Transaction</DialogTitle>
      <Collapse in={openAlert}>
        <Alert severity="error" variant="filled" sx={{ mb: 2 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            margin-bottom= '5px'
            onClick={() => {
              setOpenAlert(false);
            }}
            sx={{ mb: 1 }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        > {alertMessage} </Alert>
      </Collapse>
      <DialogContent>
        <Box>
          <FormControl fullWidth margin="dense">
            <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
            <Select
              labelId="transaction-type-label"
              id="transaction-type"
              value={transactionType}
              label="Transaction Type"
              onChange={(event) => {
                event.stopPropagation();
                handleTransactionType(event);
              }}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
            {transactionTypeError && <div style={{ color: 'red', fontSize: '0.75rem' }}>Please select a transaction type</div>}
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={categoryId}
              label="Category"
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
            {categoryError && <div style={{ color: 'red', fontSize: '0.75rem' }}>Please select a category</div>}
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount"
            type="text"
            fullWidth
            variant="outlined"
            value={amount}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">CRC</InputAdornment>,
              },
              htmlInput: { maxLength: 15 }
            }}
            onChange={(event) => {
              let value = event.target.value;
              // Allow only digits and a single dot, and up to two decimals
              if (
                /^\d*\.?\d{0,2}$/.test(value) && // Only two decimals allowed
                (value.match(/\./g) || []).length <= 1 &&
                value.length <= 15
              ) {
                setAmount(value);
              }
            }}
            required
            error={amountError}
            helperText={amountError ? 'Please enter an amount' : ''}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={(event) => setDescription(event.target.value)}
            error={descriptionError}
            helperText={descriptionError ? 'Please enter a description' : ''}
            slotProps={{ htmlInput: { maxLength: 50 } }}
          />
          <Box sx={{ mt: 1 }}>
            <DatePicker
              label="Transaction Date"
              sx={{ width: 260 }}
              value={transactionDate}
              onChange={(newValue) => setTransactionDate(newValue)}
            />
            {transactionDateError && <div style={{ color: 'red', fontSize: '0.75rem' }}>Please select a transaction date</div>}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <Box>
          <Button onClick={onClose} color="primary" size="large" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} onClick={handleSave} variant="contained" color="primary" size="large" sx={{ ml: 2 }} disabled={loading}>
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionDialog;