/**
 * Initializes the console easter egg.
 * Displays ASCII art and hiring information in the browser console.
 */
export const initConsoleEasterEgg = () => {
    console.log(`
      ██████       ██████      
    ██████           ██████    
  ██████               ██████  
██████                   ██████
  ██████               ██████  
    ██████           ██████    
      ██████       ██████
    `);
    console.log('%c👋 hey, you found the console.', 'font-size: 14px; font-weight: bold;');
    console.log('If you are interested to be a part of the core team. Contact us at contact@gdgustp.com. We are hiring applicants at every start of the 1st semester (Week of Welcome).');
};
