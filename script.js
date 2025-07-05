import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCart } from './cart.js';
import { initModals } from './modals.js';
import { initAnimations, animateMenuCards } from './animations.js';
import { initMenu } from './menu.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all modules
    const showNotification = initTheme();
    initNavigation();
    initMenu(); // This will build the menu cards
    initCart(showNotification); // initMapModal is called inside initCart
    initModals(showNotification);
    initAnimations();
    animateMenuCards(); // Animate the menu cards after they are built

    // Set dynamic copyright year
    const copyrightYearEl = document.getElementById('copyright-year');
    if(copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
});