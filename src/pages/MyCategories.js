import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Table, TableBody, TableContainer, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useFetchWithAuth from '../hooks/useAuth';
import { useUser } from '../context/UserContext'; // Ensure this path is correct
import { styled } from '@mui/material/styles';

function MyCategories() {
    const { user } = useUser();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState(null);
    const [categoryType, setCategoryType] = useState('expense'); // Default to 'expense'
    const fetchWithAuth = useFetchWithAuth();

    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await fetchWithAuth(`/api/private/category/${user.id}`);
                console.log('Category list:', response.data);
                setCategories(response.data);
            } catch (err) {
                setError('Failed to fetch categories.');
            }
        };
        fetchCategories();
    }, [fetchWithAuth]);

    const handleAddCategory = async () => {
        if (!newCategory) return;
        // Validate categoryType
        if (!categoryType) {
            setError('Category type is required.');
            return;
        }
        try {
            const response = await fetchWithAuth('/api/private/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryName: newCategory, categoryType: categoryType, userId: user.id })
            });
            setCategories([...categories, response.data]);
            setNewCategory('');
            setCategoryType('expense'); // Reset to default
        } catch (err) {
            setError('Failed to add category.');
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory(category.categoryName ?? category.category_name ?? '');
        setCategoryType(category.categoryType ?? category.category_type ?? 'expense');
    };

    const handleUpdateCategory = async () => {
        if (!editingCategory) return;
        // Validate categoryType
        if (!categoryType) {
            setError('Category type is required.');
            return;
        }
        try {
            const response = await fetchWithAuth(`/api/private/category/${editingCategory.categoryId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryName: newCategory, categoryType: categoryType })
            });
            setCategories(categories.map(cat => cat.categoryId === editingCategory.categoryId ? response.data : cat));
            setEditingCategory(null);
            setNewCategory('');
            setCategoryType('expense'); // Reset to default
        } catch (err) {
            setError('Failed to update category.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await fetchWithAuth(`/api/private/category/${categoryId}`, { method: 'DELETE' });
            setCategories((prevCategories) => prevCategories.filter(cat => cat.categoryId !== categoryId));
        } catch (err) {
            setError('Failed to delete category. Please try again.');
        }
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.primary.header,
          color: theme.palette.common.black,
          fontWeight: 'bold',
        }
      }));

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>My Categories</Typography>
            {error && <Typography color="error" gutterBottom>{error}</Typography>}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <TextField
                    label="Category Name"
                    value={newCategory ?? ''}
                    onChange={(e) => setNewCategory(e.target.value)}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel id="category-type-label">Category Type</InputLabel>
                    <Select
                        labelId="category-type-label"
                        value={categoryType ?? 'expense'}
                        label="Category Type"
                        onChange={(e) => setCategoryType(e.target.value)}
                    >
                        <MenuItem value="expense">Expense</MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                >
                    {editingCategory ? 'Update' : 'Add'}
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', margin: '0 auto' }}>
                <Table sx={{ overflowX: 'auto' }}>
                    <TableHead sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">
                        <TableRow>
                            <StyledTableCell>Category Name</StyledTableCell>
                            <StyledTableCell>Category Type</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.categoryId}>
                                <TableCell>{category.categoryName}</TableCell>
                                <TableCell>{category.categoryType}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEditCategory(category)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteCategory(category.categoryId)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MyCategories;
