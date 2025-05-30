import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../context/UserContext';
import useFetchWithAuth from '../hooks/useAuth';

const accountTypes = [
    'checking',
    'savings',
    'credit_card',
    'cash',
    'investment',
    'loan'
];

function MyAccounts() {
    const { user } = useUser();
    const [accounts, setAccounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const fetchWithAuth = useFetchWithAuth(); // Use the custom hook

    const [formData, setFormData] = useState({
        accountName: '',
        accountType: '',
        currentBalance: 0,
        currency: '',
        userId: user.id
    });

    const fetchAccounts = async () => {
        try {
            const response = await fetchWithAuth(`/api/private/account/${user.id}`);
            const data = await response.data;
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [user.id]);

    const handleClickOpen = () => {
        setOpen(true);
        setIsEdit(false);
        setFormData({
            accountName: '',
            accountType: '',
            currentBalance: 0,
            currency: '',
            userId: user.id
        });
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedAccount(null);
    };

    const handleEdit = (account) => {
        setIsEdit(true);
        setSelectedAccount(account);
        setFormData({
            accountName: account.accountName,
            accountType: account.accountType,
            currentBalance: account.currentBalance,
            currency: account.currency,
            userId: user.id
        });
        setOpen(true);
    };

    const handleDelete = async (accountId) => {
        if (window.confirm('Are you sure you want to delete this account?')) {
            try {
                await fetchWithAuth(`/api/private/account/${accountId}`, {
                    method: 'DELETE'
                });
                fetchAccounts();
            } catch (error) {
                console.error('Error deleting account:', error);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const url = isEdit
                ? `/api/private/account/${selectedAccount.accountId}`
                : '/api/private/account';
            const method = isEdit ? 'PUT' : 'POST';

            await fetchWithAuth(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            handleClose();
            fetchAccounts();
        } catch (error) {
            console.error('Error saving account:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: { xs: 2, sm: 4 },
        }}>
            <Box
                sx={{
                    maxWidth: { xs: '100%', sm: 700, md: 1000 },
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
                    My Accounts
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleClickOpen}
                    >
                        Add Account
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {accounts.map((account) => (
                        <Grid item xs={12} sm={6} md={4} key={account.accountId}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" gutterBottom>
                                            {account.accountName}
                                        </Typography>
                                        <Box>
                                            <IconButton onClick={() => handleEdit(account)} size="small">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(account.accountId)} size="small">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    <Typography color="textSecondary">
                                        Type: {account.accountType}
                                    </Typography>
                                    <Typography variant="h6">
                                        Balance: {account.currentBalance} {account.currency}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEdit ? 'Edit Account' : 'New Account'}</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                            <TextField
                                name="accountName"
                                label="Account Name"
                                fullWidth
                                value={formData.accountName}
                                onChange={handleChange}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Account Type</InputLabel>
                                <Select
                                    name="accountType"
                                    value={formData.accountType}
                                    label="Account Type"
                                    onChange={handleChange}
                                >
                                    {accountTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type.replace('_', ' ').toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                name="currentBalance"
                                label="Current Balance"
                                type="number"
                                fullWidth
                                value={formData.currentBalance}
                                onChange={handleChange}
                            />
                            <TextField
                                name="currency"
                                label="Currency"
                                fullWidth
                                value={formData.currency}
                                onChange={handleChange}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {isEdit ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}

export default MyAccounts;
