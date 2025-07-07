import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initCart } from './cart.js';
import { initModals } from './modals.js';
import { initAnimations, animateMenuCards } from './animations.js';
import { initMenu } from './menu.js';
import { loadHTML } from './loader.js';

async function main() {
    // 1. Load all HTML partials into the DOM
    await loadHTML();

    // 2. Initialize all modules now that the DOM is ready
    const showNotification = initTheme();
    initNavigation();
    initMenu();
    initCart(showNotification);
    initModals(showNotification);
    initAnimations();
    animateMenuCards();

    // 3. Set dynamic copyright year
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', main);