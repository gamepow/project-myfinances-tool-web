import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, FormHelperText, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useFetchWithAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

function MyBudget() {
    const { user } = useUser();
    const fetchWithAuth = useFetchWithAuth();
    const [budgets, setBudgets] = useState([]);
    const [currency, setCurrency] = useState('CRC');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [startDate, setStartDate] = useState(dayjs());
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        // Fetch budgets from the backend
        const fetchBudgets = async () => {
            try {
                const response = await fetchWithAuth(`/api/private/budget/${user.id}`);
                setBudgets(response.data);
            } catch (err) {
                setError('Failed to fetch budgets.');
            }
        };
        fetchBudgets();
    }, [fetchWithAuth, user.id]);

    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await fetchWithAuth(`/api/private/category/${user.id}`);
                if (response.data) {
                    setCategories(response.data);
                }
            } catch (err) {
                setError('Failed to fetch categories.');
            }
        };
        fetchCategories();
    }, [user.id, fetchWithAuth]);    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!categoryId) {
            errors.categoryId = 'Please select a category';
            isValid = false;
        }

        if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
            errors.budgetAmount = 'Please enter a valid amount';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };    const handleAddBudget = async () => {
        if (!validateForm()) return;

        try {
            await fetchWithAuth('/api/private/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    categoryId: categoryId,
                    currency,
                    budgetAmount: parseFloat(budgetAmount),
                    userId: user.id
                })
            });
            // Re-fetch budgets to ensure correct structure
            const refreshed = await fetchWithAuth(`/api/private/budget/${user.id}`);
            setBudgets(refreshed.data);
            setCategoryId('');
            setCurrency('CRC');
            setBudgetAmount('');
            setFormErrors({});
            setError(null);
        } catch (err) {
            setError('Failed to add budget.');
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: { xs: 2, sm: 4 },
        }}>
            <Box
                sx={{
                    maxWidth: { xs: '100%', sm: 700, md: 900 },
                    mx: 'auto',
                    mt: 4,
                    px: { xs: 1, sm: 3, md: 4 },
                    py: { xs: 2, sm: 3 },
                    background: { xs: 'none', sm: '#fff' },
                    borderRadius: { xs: 0, sm: 4 },
                    boxShadow: { xs: 'none', sm: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' },
                    border: { sm: '1px solid #e3e8ee' },
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mb: 3, textAlign: 'center', letterSpacing: 1, color: '#2d3a4a' }}>
                    My Budget
                </Typography>
                {error && <Typography color="error" gutterBottom>{error}</Typography>}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: 2,
                        mb: 4,
                        alignItems: 'flex-end',
                        justifyContent: isMobile ? 'flex-start' : 'center',
                        background: '#f7fafc',
                        borderRadius: 3,
                        boxShadow: { sm: '0 2px 8px 0 rgba(31, 38, 135, 0.07)' },
                        p: { xs: 2, sm: 3 },
                        border: '1px solid #e3e8ee',
                    }}
                >
                    <FormControl fullWidth error={!!formErrors.categoryId}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            value={categoryId}
                            label="Category"
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                if (formErrors.categoryId) {
                                    setFormErrors(prev => ({ ...prev, categoryId: '' }));
                                }
                            }}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                                    {cat.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.categoryId && <FormHelperText>{formErrors.categoryId}</FormHelperText>}
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="currency-label">Currency</InputLabel>
                        <Select
                            labelId="currency-label"
                            value={currency}
                            label="Currency"
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <MenuItem value="CRC">CRC</MenuItem>
                            <MenuItem value="USD">USD</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Budget Amount"
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => {
                            setBudgetAmount(e.target.value);
                            if (formErrors.budgetAmount) {
                                setFormErrors(prev => ({ ...prev, budgetAmount: '' }));
                            }
                        }}
                        fullWidth
                        error={!!formErrors.budgetAmount}
                        helperText={formErrors.budgetAmount}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            min: "0",
                            step: "0.01"
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddBudget}
                    >
                        Add Budget
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{
                    maxWidth: '100%',
                    overflowX: isMobile ? 'auto' : 'visible',
                    boxShadow: { xs: 1, sm: 3 },
                    borderRadius: 3,
                    border: '1px solid #e3e8ee',
                }}>
                    <Table size={isMobile ? 'small' : 'medium'} sx={{
                        '& thead th': {
                            background: 'linear-gradient(90deg, #e0e7ef 0%, #f5f7fa 100%)',
                            color: '#2d3a4a',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                        },
                        '& tbody tr': {
                            transition: 'background 0.2s',
                        },
                        '& tbody tr:hover': {
                            background: '#f0f4fa',
                        },
                        '& td, & th': {
                            borderBottom: '1px solid #e3e8ee',
                        },
                    }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>Currency</TableCell>
                                <TableCell align="right">Budget Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {budgets.map((budget) => (
                                <TableRow key={budget.budget_id}>
                                    <TableCell>{budget.category?.categoryName || 'N/A'}</TableCell>
                                    <TableCell>{budget.currency}</TableCell>
                                    <TableCell align="right">
                                        {Number(budget.budgetAmount).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default MyBudget;
