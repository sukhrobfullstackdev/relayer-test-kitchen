export const MuiThemeConfig = {
  palette: {
    mode: 'dark' as const,
    primary: {
      main: '#A799FF',
      light: '#A799FF',
      dark: '#A799FF08',
    },
    error: {
      main: '#FF9B80',
      dark: '#FF9B8008',
      light: '#FF9B80',
    },
    warning: {
      main: '#FFD594',
      dark: '#FFD59408',
      light: '#FFD594',
    },
    success: {
      main: '#90F0D3',
      dark: '#90F0D308',
      light: '#90F0D3',
    },
    background: {
      default: '#19191A',
      paper: '#252525',
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        variant: 'contained' as const,
        size: 'small' as const,
        sx: (t: { palette: { primary: { main: any; dark: any } } }) => ({
          '&:hover': { backgroundColor: t.palette.primary.main },
          '&:active': { backgroundColor: t.palette.primary.dark },
          px: 2,
          py: 1,
          borderRadius: 32,
          textTransform: 'none',
        }),
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small' as const,
        style: {
          width: '100%',
        },
      },
    },
    MuiTableCell: {
      defaultProps: {
        align: 'left' as const,
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          transition: 'all ease-in 150ms',
        },
      },
    },
  },
};
