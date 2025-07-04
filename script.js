import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCart } from './cart.js';
import { initModals } from './modals.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all modules
    const showNotification = initTheme();
    initNavigation();
    initCart(showNotification);
    initModals(showNotification);
    initAnimations();

});