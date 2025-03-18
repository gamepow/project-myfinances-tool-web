import { createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#1F363D', // Customize your primary color
      },
      secondary: {
        main: '#0A8754', // Customize your secondary color
      },
      background: {
        default: '#f0f0f0', // Customize your background color
      },
      text: {
        primary: '#000000', // Customize your primary text color
        secondary: '#56445D', // Customize your secondary text color
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif', // Customize your font family
    },
  });
  
  export default theme;