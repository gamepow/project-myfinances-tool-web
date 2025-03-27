import React, { useState } from 'react';
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
import InputAdornment from '@mui/material/InputAdornment';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function Dashboard(){
    const { logout } = useUser();
    const navigate = useNavigation();
    const location = useLocation(); // Get current location
    // State variables for form inputs
    const [transactionType, setTransactionType] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [transactionDate, setTransactionDate] = useState(dayjs());

    const [openDialog, setOpenDialog] = useState(false); // State to control the popup

    const handleAddTransaction = () =>{
      setOpenDialog(true);
    }

    const handleCloseDialog = (event, reason) => {
      if (reason !== "backdropClick") {
        setOpenDialog(false);
      }
    }

    const saveTransaction = () => {
      // Log the user input data
      console.log('Transaction Type:', transactionType);
      console.log('Category:', category);
      console.log('Amount:', amount);
      console.log('Description:', description);
      console.log('Transaction Date:', transactionDate.format('YYYY-MM-DD'));

      setOpenDialog(false);
    }

    const handleTransactionType = (event) => {
      setTransactionType(event.target.value);
    }

    const handleCategory = (event) => {
      setCategory(event.target.value);
    }

    const clearValues = () =>{

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
            <Button variant="contained" size="large" onClick={handleAddTransaction} >Add Transaction</Button>
          </Box>
        </Container>
      );
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <CustomPieChart data = {customData}/>

          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm" disableEscapeKeyDown>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="dense">
                <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
                <Select 
                  labelId="transaction-type-label"
                  id="transaction-type"
                  value={transactionType}
                  label="Transaction Type"
                  onChange={(event) => {
                    event.stopPropagation(); // Prevent event propagation to the PieChart
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
                  onChange={(event) =>{
                    event.stopPropagation();
                    handleCategory(event);
                  }}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Supermarket">Supermarket</MenuItem>
                  <MenuItem value="Restaurants">Restaurants</MenuItem>
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
                <DatePicker label="Transaction Date" sx={{ width: 260 }}
                onChange={(event) => setTransactionDate(event.target.value)}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button type="submite" onClick={saveTransaction} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
          
        </Box>
      </LocalizationProvider>
    );
}

export default Dashboard;