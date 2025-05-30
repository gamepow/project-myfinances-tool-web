import React, { useState, useEffect, useCallback } from 'react';
import useFetchWithAuth from '../hooks/useAuth'; // Ensure this path is correct
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import { useUser } from '../context/UserContext'; // Ensure this path is correct

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AddCardIcon from '@mui/icons-material/AddCard';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// import TextField from '@mui/material/TextField'; // Needed for DatePicker renderInput in older MUI X versions

import TransactionDialog from './TransactionDialog'; // Ensure this path is correct
import PieChartComponent from '../layouts/PieChart'; // Ensure this path is correct
import dayjs from 'dayjs';
import BarChartComponent from '../layouts/BarChartComponent'; // Adjust path if needed
// Optional: if you need specific locales or month formatting
// import 'dayjs/locale/en'; 
// dayjs.locale('en');


function Dashboard() {
    const { user } = useUser();
    const fetchWithAuth = useFetchWithAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [categories, setCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [transactionExpensesSummary, setTransactionExpensesSummary] = useState([]);
     const [transactionIncomeSummary, setTransactionIncomeSummary] = useState([]); // Kept for potential future use
    const [loadingCharts, setLoadingCharts] = useState(true);
    const [chartError, setChartError] = useState(null);
    const [refreshCharts, setRefreshCharts] = useState(false);

    // State for selected date (year and month)
    const [selectedDate, setSelectedDate] = useState(dayjs()); // Initialize with current month and year

    // Display format for the selected month and year
    const displayMonthYear = selectedDate.format('MMMM YYYY');

    const handleTransactionSaved = () => {
        setOpenDialog(false);
        setRefreshCharts(prev => !prev); // Trigger refresh for the current selectedDate
    };

    const handleDateChange = (newDate) => {
        if (newDate && newDate.isValid()) {
            setSelectedDate(newDate);
            // Data fetching will be triggered by the useEffect watching selectedDate
        }
    };

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchWithAuth(`/api/private/category/${user.id}`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories: ', error);
            }
        };
        if (user?.id) fetchCategories();
    }, [user, fetchWithAuth]);

    // Fetch Transaction Summaries based on selectedDate and refreshCharts
    useEffect(() => {
        const fetchSummaries = async () => {
            if (!user?.id) return;
            setLoadingCharts(true);
            setChartError(null);
            setTransactionExpensesSummary([]); // Clear previous data

            const year = selectedDate.year();
            const month = selectedDate.month() + 1; // dayjs month is 0-indexed, API usually expects 1-indexed

            try {
                // Fetch expenses summary for the selected period
                const expensesRes = await fetchWithAuth(`/api/private/transaction/summary/expenses/${user.id}/month?year=${year}&month=${month}`);
                setTransactionExpensesSummary(expensesRes.data || []);

                // Fetch income summary for the selected period
                const incomeRes = await fetchWithAuth(`/api/private/transaction/summary/income/${user.id}/month?year=${year}&month=${month}`);
                setTransactionIncomeSummary(incomeRes.data || []);

            } catch (error) {
                console.error(`Error fetching transaction summaries for ${selectedDate.format('MMMM YYYY')}:`, error);
                setChartError(`Failed to load financial summaries for ${displayMonthYear}. Please try again later.`);
            } finally {
                setLoadingCharts(false);
            }
        };
        fetchSummaries();
    }, [user, fetchWithAuth, selectedDate, refreshCharts]); // Dependencies include selectedDate and refreshCharts

    const handleAddTransaction = useCallback(() => setOpenDialog(true), []);
    const handleCloseDialog = useCallback(() => setOpenDialog(false), []);

    //const pieChartHeight = isMobile ? 280 : 350;
    const chartHeight = isMobile ? 300 : 350; // Adjusted for bar chart potentially needing more height

    // Prepare data for BarChartComponent
    const expenseChartData = transactionExpensesSummary.map(item => ({
        name: item.label || 'Unknown Category',
        value: parseFloat(item.value) || 0,
    })).filter(item => item.value > 0); // Ensure only items with value are passed to chart

    const incomeChartData = transactionIncomeSummary.map(item => ({
        name: item.label || 'Unknown Category',
        value: parseFloat(item.value) || 0,
    })).filter(item => item.value > 0); // Ensure only items with value are passed to chart


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: { xs: 2, sm: 4 },
            }}>
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            maxWidth: '100%',
                            mx: 'auto',
                            background: { xs: 'none', sm: '#fff' },
                            borderRadius: { xs: 0, sm: 4 },
                            boxShadow: { xs: 'none', sm: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' },
                            border: { sm: '1px solid #e3e8ee' },
                            p: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                justifyContent: 'space-between',
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                mb: { xs: 3, md: 4 },
                                gap: { xs: 2, sm: 0 },
                            }}
                        >
                            <Typography
                                variant={isMobile ? "h5" : "h4"}
                                component="h1"
                                sx={{ 
                                    fontWeight: 800,
                                    letterSpacing: 1,
                                    color: '#2d3a4a',
                                    textAlign: { xs: 'center', sm: 'left' },
                                    width: { xs: '100%', sm: 'auto' }
                                }}
                            >
                                Dashboard
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddCardIcon />}
                                onClick={handleAddTransaction}
                                size={isMobile ? "medium" : "large"}
                                sx={{
                                    width: { xs: '100%', sm: 'auto' },
                                    py: 1.5,
                                    px: 3,
                                    borderRadius: 2,
                                    fontWeight: 600
                                }}
                            >
                                Add Transaction
                            </Button>
                        </Box>

                        {/* Year and Month Selector */}
                        <Box sx={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 4,
                            background: '#f7fafc',
                            borderRadius: 3,
                            p: { xs: 2, sm: 3 },
                            border: '1px solid #e3e8ee'
                        }}>
                            <Box sx={{ width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '100%' : 320 }}>
                                <DatePicker
                                    label="Select Month and Year"
                                    views={['year', 'month']}
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    format="MMMM YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            variant: 'outlined'
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        <Typography
                            variant="h5"
                            sx={{
                                textAlign: 'center',
                                mb: { xs: 3, md: 4 },
                                color: '#2d3a4a',
                                fontWeight: 700,
                                letterSpacing: 0.5
                            }}
                        >
                            {displayMonthYear} Overview
                        </Typography>

                        {/* Charts Section */}
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <Paper sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 'auto',
                                    overflowX: 'auto',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px 0 rgba(31, 38, 135, 0.07)',
                                    background: '#fff',
                                    border: '1px solid #e3e8ee'
                                }}>
                                    <Typography variant="h6" gutterBottom component="div" sx={{ 
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#2d3a4a',
                                        mb: 2
                                    }}>
                                        Expenses by Category
                                    </Typography>
                                    {loadingCharts ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: chartHeight }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : chartError ? (
                                        <Alert severity="error" sx={{ m: 2, minHeight: chartHeight, display: 'flex', alignItems: 'center' }}>
                                            {chartError}
                                        </Alert>
                                    ) : expenseChartData.length > 0 ? (
                                        <BarChartComponent data={expenseChartData} height={chartHeight} />
                                    ) : (
                                        <Typography sx={{ 
                                            textAlign: 'center',
                                            py: 4,
                                            minHeight: chartHeight,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        }}>
                                            No expense data found for {displayMonthYear}.
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Paper sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 'auto',
                                    overflowX: 'auto',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px 0 rgba(31, 38, 135, 0.07)',
                                    background: '#fff',
                                    border: '1px solid #e3e8ee'
                                }}>
                                    <Typography variant="h6" gutterBottom component="div" sx={{ 
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#2d3a4a',
                                        mb: 2
                                    }}>
                                        Income by Category
                                    </Typography>
                                    {loadingCharts ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: chartHeight }}>
                                            <CircularProgress />
                                        </Box>
                                    ) : chartError ? (
                                        <Alert severity="error" sx={{ m: 2, minHeight: chartHeight, display: 'flex', alignItems: 'center' }}>
                                            {chartError}
                                        </Alert>
                                    ) : incomeChartData.length > 0 ? (
                                        <BarChartComponent data={incomeChartData} height={chartHeight} />
                                    ) : (
                                        <Typography sx={{ 
                                            textAlign: 'center',
                                            py: 4,
                                            minHeight: chartHeight,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'text.secondary',
                                            fontStyle: 'italic'
                                        }}>
                                            No income data found for {displayMonthYear}.
                                        </Typography>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>

                        {categories.length > 0 && (
                            <TransactionDialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                categories={categories}
                                onTransactionSaved={handleTransactionSaved}
                            />
                        )}
                    </Box>
                </Container>
            </Box>
        </LocalizationProvider>
    );
}

export default Dashboard;