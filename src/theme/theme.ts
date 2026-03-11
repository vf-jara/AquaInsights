import 'styled-components/native';

export const theme = {
    colors: {
        primary: '#0A74DA', // Ocean Blue
        secondary: '#00B4D8', // Light Blue
        background: '#F0F4F8', // Very light blue/gray
        card: '#FFFFFF',
        text: '#2B3A4A',
        textLight: '#7A8C9E',
        danger: '#E63946',
        success: '#2A9D8F',
        warning: '#F4A261',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 16,
        lg: 24,
        round: 9999,
    },
};

export type Theme = typeof theme;

