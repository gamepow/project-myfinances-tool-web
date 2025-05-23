// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for your app
const theme = createTheme({
  palette: {
    primary: {
      main: '#1A237E', // A deep indigo, good for finance apps
      header: '#007acc', // A slightly lighter shade for headers
    },
    secondary: {
      main: '#FF6F00', // A vibrant orange for accents/buttons
    },
    tertiary: { // If you want to keep using 'tertiary'
      main: '#FFFFFF', // White, for icons on dark background
      // Or an accent color like:
      // main: '#4CAF50', // Green
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#F4F6F8', // Light grey for page backgrounds
      paper: '#FFFFFF',   // White for cards, drawers, etc.
    },
    text: {
      primary: '#2C3E50', // Dark grey for primary text
      secondary: '#7F8C8D', // Lighter grey for secondary text
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none', // Less shouty buttons
      fontWeight: 600,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Example: to make it slightly less elevated or change background
          // boxShadow: 'none',
          // borderBottom: '1px solid #e0e0e0'
        }
      }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8, // Slightly more rounded buttons
            }
        }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Example: Modern drawer width
          // width: 280, // Already handled by PaperProps in your code, good.
        }
      }
    }
  }
});

export default theme;