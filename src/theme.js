import { createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#433E3F',
      },
      secondary: {
        main: '#0A8754',
      },
      tertiary: {
        main: '#FFFFFF',
      },
      background: {
        default: '#77987F', // Customize your background color
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