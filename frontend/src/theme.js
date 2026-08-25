import { createTheme } from '@mui/material/styles';

const palette = {
  navy: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#1e1b4b',
    950: '#0f0d2e',
  },
  gold: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },
  emerald: {
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
  },
  rose: {
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
  },
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.navy[600],
      light: palette.navy[400],
      dark: palette.navy[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: palette.gold[500],
      light: palette.gold[400],
      dark: palette.gold[600],
      contrastText: '#1e1b4b',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: 'rgba(0,0,0,0.06)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 500 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.6 },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
    '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -4px rgba(0,0,0,0.05)',
    '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
    '0 25px 50px -12px rgba(0,0,0,0.12)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        '::-webkit-scrollbar': { width: 8, height: 8 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: 4,
          '&:hover': { background: '#94a3b8' },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': { transform: 'translateY(-1px)' },
        },
        contained: {
          background: `linear-gradient(135deg, ${palette.navy[600]} 0%, ${palette.navy[700]} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${palette.navy[500]} 0%, ${palette.navy[600]} 100%)`,
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': { borderWidth: 2 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.06), 0 8px 10px -6px rgba(0,0,0,0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20 },
        elevation0: { boxShadow: 'none' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            transition: 'all 0.2s ease',
            '&:hover': { backgroundColor: '#fafbfc' },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: `0 0 0 2px ${palette.navy[100]}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 24 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBottom: 4,
          transition: 'all 0.2s ease',
        },
      },
    },
  },
});

export { palette };
export default theme;
