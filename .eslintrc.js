module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Make unused variables a warning instead of error for builds
    'no-unused-vars': 'warn',
    // Make missing dependencies a warning
    'react-hooks/exhaustive-deps': 'warn',
    // Make anchor validation a warning
    'jsx-a11y/anchor-is-valid': 'warn'
  }
};
