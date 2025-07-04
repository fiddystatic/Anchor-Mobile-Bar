function initTheme() {
    const notification = document.getElementById('theme-notification');
    const notificationText = document.getElementById('notification-text');
    let notificationTimeout;

    const showNotification = (message) => {
        if(notificationTimeout) clearTimeout(notificationTimeout);

        notificationText.textContent = message;
        notification.classList.add('show');
        
        notificationTimeout = setTimeout(() => {
            notification.classList.remove('show');
        }, 4000);
    }
    
    // Set body to dark theme by default in CSS, no JS needed for theme switching.
    document.body.className = '';

    return showNotification; // Export for other modules to use
}

export { initTheme };