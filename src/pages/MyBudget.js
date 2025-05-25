import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useFetchWithAuth from '../hooks/useAuth';

function MyBudget() {
    const [budgets, setBudgets] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [currency, setCurrency] = useState('');
    const [error, setError] = useState(null);
    const fetchWithAuth = useFetchWithAuth();

    useEffect(() => {
        // Fetch budgets from the backend
        const fetchBudgets = async () => {
            try {
                const response = await fetchWithAuth('/api/budgets');
                setBudgets(response.data);
            } catch (err) {
                setError('Failed to fetch budgets.');
            }
        };
        fetchBudgets();
    }, [fetchWithAuth]);

    const handleAddBudget = async () => {
        if (!startDate || !currency) return;
        try {
            const response = await fetchWithAuth('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start_date: startDate, currency })
            });
            setBudgets([...budgets, response.data]);
            setStartDate('');
            setCurrency('');
        } catch (err) {
            setError('Failed to add budget.');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>My Budget</Typography>
            {error && <Typography color="error" gutterBottom>{error}</Typography>}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <TextField
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddBudget}
                >
                    Add Budget
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Currency</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgets.map((budget) => (
                            <TableRow key={budget.budget_id}>
                                <TableCell>{budget.start_date}</TableCell>
                                <TableCell>{budget.currency}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MyBudget;
