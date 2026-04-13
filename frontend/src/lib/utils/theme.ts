import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: any = {
  initialColorMode: 'dark',
};

const styles = {
  global: (props: any) => ({
    body: {
      bg: mode('#ffffff', '#09090b')(props),
      color: mode('#09090b', '#fafafa')(props),
    },
    'button': {
      _hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
      },
      transition: 'all 0.2s ease-in-out',
    }
  }),
};

const colors = {
  highlight: {
    standard: '#146ef5', // Webflow Blue
    hover: '#3b89ff',
    active: '#0055d4',
  },
  brandGray: {
    accent: '#a1a1aa',
    active: '#18181b',
    light: '#27272a',
    dark: '#18181b',
    darker: '#09090b',
    darkest: '#000000',
    hover: '#27272a',
  },
  brandGreen: '#10b981',
  labelGray: '#a1a1aa',
  menuRed: '#ef4444',
  brandBorder: '#27272a',
  accountBar: '#09090b',
  memberList: '#09090b',
  iconColor: '#e4e4e7',
  messageInput: '#18181b',
  secondary: {
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    yellow: '#f59e0b',
  }
};

const fonts = {
  // Using Arial as fallback per DESIGN.md (WF Visual Sans Variable would need to be imported in index.css)
  body: "'WF Visual Sans Variable', Arial, sans-serif",
  heading: "'WF Visual Sans Variable', Arial, sans-serif",
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: '4px',
    },
    variants: {
      solid: (props: any) => ({
        bg: mode('#146ef5', '#146ef5')(props),
        color: 'white',
        _hover: {
          bg: mode('#3b89ff', '#3b89ff')(props),
        },
      }),
      outline: {
        borderColor: '#27272a',
        color: '#fafafa',
      }
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: '4px',
        border: '1px solid #27272a',
        bg: '#18181b', // light shade of dark
      }
    }
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: '4px',
        borderColor: '#27272a',
        bg: '#09090b',
        color: '#fafafa',
        _hover: {
          borderColor: '#3f3f46',
        },
        _focus: {
          borderColor: '#146ef5',
        }
      }
    }
  }
};

const customTheme = extendTheme({
  colors,
  config,
  styles,
  fonts,
  components,
  breakpoints: {
    sm: '479px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  }
});

export default customTheme;

export const scrollbarCss = {
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#ffffff',
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#d8d8d8',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#ababab',
  },
};
