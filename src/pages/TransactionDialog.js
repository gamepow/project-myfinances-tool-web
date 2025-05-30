import React, { useState, useCallback, useEffect, useMemo } from 'react';
import useFetchWithAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText'; // For select errors
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid'; // For better form layout

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

// Define default currency based on user context or a default
const DEFAULT_CURRENCY_SYMBOL = "CRC"; // Or get from user.defaultCurrency

function TransactionDialog({ open, onClose, categories, onTransactionSaved }) {
    const { user } = useUser();
    const fetchWithAuth = useFetchWithAuth();

    const initialFormState = useMemo(() => ({
        transactionType: '',
        categoryId: '',
        accountId: '',
        amount: '',
        description: '',
        transactionDate: dayjs(), // dayjs() will be new each time this memo re-runs
    }), []); // Empty dependency array means it's created once on mount.
              // If you want it to reset with a new dayjs() every time the dialog *opens*,
              // you might consider a more complex trigger or pass dayjs() into clearFormAndErrors.
              // For most cases, a fresh dayjs() on mount is fine.

    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alertState, setAlertState] = useState({ open: false, severity: 'error', message: '' });
    const [accounts, setAccounts] = useState([]);    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetchWithAuth(`/api/private/account/active/${user.id}`);
                if (response && response.data) {
                    // Ensure we're setting an array from the response data
                    setAccounts(Array.isArray(response.data) ? response.data : []);
                } else {
                    setAccounts([]);
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
                setAlertState({ open: true, severity: 'error', message: 'Failed to load accounts' });
                setAccounts([]); // Set empty array on error
            }
        };

        if (open && user?.id) {
            fetchAccounts();
        }
    }, [open, user?.id, fetchWithAuth]);

    const currencySymbol = user?.defaultCurrency || DEFAULT_CURRENCY_SYMBOL;

    const clearFormAndErrors = useCallback(() => {
        // To ensure `transactionDate` is truly reset to a *new* current time when clearing:
        setFormData({
            transactionType: '',
            categoryId: '',
            accountId: '',
            amount: '',
            description: '',
            transactionDate: dayjs(), // Explicitly set new dayjs() here
        });
        // Or if you want to use the memoized initialFormState (which might have an older dayjs())
        // setFormData(initialFormState);

        setFormErrors({});
        setAlertState({ open: false, severity: 'error', message: '' });
    }, []); // Now `initialFormState` is not a direct dependency, making `clearFormAndErrors` stable.

    useEffect(() => {
        if (open) {
            clearFormAndErrors();
        }
    }, [open, clearFormAndErrors]); // This is now safe to use as `clearFormAndErrors` is stable.

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        setAlertState(prev => ({...prev, open: false}));
    };

    const handleDateChange = (newValue) => {
        setFormData(prev => ({ ...prev, transactionDate: newValue }));
        if (formErrors.transactionDate) {
            setFormErrors(prev => ({ ...prev, transactionDate: '' }));
        }
        setAlertState(prev => ({...prev, open: false}));
    };

    const handleAmountChange = (event) => {
        let value = event.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value) && (value.match(/\./g) || []).length <= 1 && value.length <= 15) {
            setFormData(prev => ({ ...prev, amount: value }));
            if (formErrors.amount) setFormErrors(prev => ({ ...prev, amount: '' }));
        }
        setAlertState(prev => ({...prev, open: false}));
    };

    const filteredCategories = useMemo(() => {
        if (!formData.transactionType) return [];
        return categories.filter(cat =>
            (cat.categoryType || cat.category_type) === formData.transactionType
        );
    }, [categories, formData.transactionType]);

    const validateForm = () => {
        let tempErrors = {};
        let isValid = true;
        if (!formData.transactionType) { tempErrors.transactionType = 'Required'; isValid = false; }
        if (!formData.categoryId) { tempErrors.categoryId = 'Required'; isValid = false; }
        if (!formData.accountId) { tempErrors.accountId = 'Required'; isValid = false; }
        if (!formData.amount || parseFloat(formData.amount) <= 0) { tempErrors.amount = 'Must be a positive number'; isValid = false; }
        if (!formData.description.trim()) { tempErrors.description = 'Required'; isValid = false; }
        if (!formData.transactionDate || !formData.transactionDate.isValid()) { tempErrors.transactionDate = 'Valid date required'; isValid = false; }

        setFormErrors(tempErrors);
        if (!isValid) {
            setAlertState({open: true, severity: 'warning', message: 'Please correct the highlighted fields.'});
        }
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setAlertState({ open: false, severity: 'error', message: '' });

        const transactionData = {
            ...formData,
            amount: parseFloat(formData.amount),
            transactionDate: formData.transactionDate.format('YYYY-MM-DD'),
            userId: user.id,
        };

        try {
            const response = await fetchWithAuth('/api/private/transaction/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData),
            });

            if (response && (response.transactionId !== undefined || response.status === 200 || response.status === 201)) {
                 if (onTransactionSaved) onTransactionSaved();
                 onClose();
            } else {
                throw new Error(response.data?.message || 'Failed to save transaction.');
            }
        } catch (error) {
            console.error('Error saving transaction:', error);
            setAlertState({ open: true, severity: 'error', message: error.message || 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ component: 'form', onSubmit: (e) => { e.preventDefault(); handleSave(); } }}>
            <DialogTitle sx={{ pb: 1 }}>
                New Transaction
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                  <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{pt: 2}}>
                {alertState.open && (
                    <Alert
                        severity={alertState.severity}
                        sx={{ mb: 2 }}
                        action={
                            <IconButton
                                aria-label="close-alert"
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
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!formErrors.transactionType} required>
                            <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
                            <Select
                                name="transactionType"
                                labelId="transaction-type-label"
                                value={formData.transactionType}
                                label="Transaction Type"
                                onChange={handleChange}
                            >
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="expense">Expense</MenuItem>
                            </Select>
                            {formErrors.transactionType && <FormHelperText>{formErrors.transactionType}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!formErrors.accountId} required>
                            <InputLabel id="account-label">Account</InputLabel>
                            <Select
                                name="accountId"
                                labelId="account-label"
                                value={formData.accountId}
                                label="Account"
                                onChange={handleChange}
                            >
                                {accounts.map((acc) => (
                                    <MenuItem key={acc.accountId} value={acc.accountId}>
                                        {acc.accountName} ({acc.accountType})
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.accountId && <FormHelperText>{formErrors.accountId}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!formErrors.categoryId} required>
                            <InputLabel id="category-label">Category</InputLabel>
                            <Select
                                name="categoryId"
                                labelId="category-label"
                                value={formData.categoryId}
                                label="Category"
                                onChange={handleChange}
                            >
                                {filteredCategories.map((cat) => (
                                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                                        {cat.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formErrors.categoryId && <FormHelperText>{formErrors.categoryId}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="amount"
                            label="Amount"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.amount}
                            onChange={handleAmountChange}
                            required
                            error={!!formErrors.amount}
                            helperText={formErrors.amount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
                            }}
                            inputProps={{ maxLength: 15 }}
                        />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Transaction Date"
                            value={formData.transactionDate}
                            onChange={handleDateChange}
                            sx={{ width: '100%' }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    required: true,
                                    error: !!formErrors.transactionDate,
                                    helperText: formErrors.transactionDate,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="description"
                            label="Description"
                            type="text"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            error={!!formErrors.description}
                            helperText={formErrors.description}
                            inputProps={{ maxLength: 100 }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    // onClick={handleSave} // Not strictly needed if PaperProps onSubmit is used
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Transaction'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TransactionDialog;