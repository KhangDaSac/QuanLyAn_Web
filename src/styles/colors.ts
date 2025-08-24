// Biến màu chủ đạo cho ứng dụng
export const colors = {
  // Màu xanh dương nhạt chủ đạo
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Màu chính
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Màu xanh lá bổ sung
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Màu accent
  accent: {
    50: '#fef7ff',
    100: '#fceeff',
    200: '#f9ddff',
    300: '#f4c2ff',
    400: '#ed98ff',
    500: '#e269ff',
    600: '#d946ef',
    700: '#be26d1',
    800: '#a21caf',
    900: '#86198f',
    950: '#581c87',
  },
  
  // Màu trung tính
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Màu thông báo
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// CSS Variables cho easy switching themes
export const cssVariables = {
  '--color-primary': colors.primary[500],
  '--color-primary-light': colors.primary[100],
  '--color-primary-dark': colors.primary[700],
  '--color-secondary': colors.secondary[500],
  '--color-accent': colors.accent[500],
  '--color-text': colors.gray[900],
  '--color-text-light': colors.gray[600],
  '--color-background': '#ffffff',
  '--color-surface': colors.gray[50],
  '--color-border': colors.gray[200],
  '--color-success': colors.success,
  '--color-warning': colors.warning,
  '--color-error': colors.error,
  '--color-info': colors.info,
};

// Utility function để apply theme
export const applyTheme = () => {
  const root = document.documentElement;
  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

export default colors;
