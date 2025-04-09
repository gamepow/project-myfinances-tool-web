import React, { useState, useCallback } from 'react';
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
import dayjs from 'dayjs';

function TransactionDialog({ open, onClose, categories, onSave }) {
  const [transactionType, setTransactionType] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(dayjs());

  const handleTransactionType = useCallback((event) => {
    setTransactionType(event.target.value);
  }, []);

  const handleCategoryChange = useCallback((event) => {
    setCategory(event.target.value);
  }, []);

  const handleSave = useCallback(() => {
    onSave({
      transactionType,
      category,
      amount,
      description,
      transactionDate,
    });
  }, [transactionType, category, amount, description, transactionDate, onSave]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disablePortal disableEscapeKeyDown>
      <DialogTitle>New Transaction</DialogTitle>
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
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Category"
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">CRC</InputAdornment>,
              },
            }}
            onChange={(event) => setAmount(event.target.value)}
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
          />
          <Box sx={{ mt: 1 }}>
            <DatePicker
              label="Transaction Date"
              sx={{ width: 260 }}
              value={transactionDate}
              onChange={(newValue) => setTransactionDate(newValue)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionDialog;