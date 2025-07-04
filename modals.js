function initModals(showNotification) {
    // --- Quote Modal Logic ---
    const quoteModal = document.getElementById('quote-modal');
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const headerQuoteBtn = document.getElementById('header-quote-btn');
    const mobileQuoteBtn = document.getElementById('mobile-quote-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const quoteForm = document.getElementById('quote-form');
    const successMessage = document.getElementById('form-success-message');

    const openModal = () => {
        quoteModal.classList.add('open');
        quoteForm.style.display = 'block';
        successMessage.style.display = 'none';
        quoteForm.reset();
    };
    const closeModal = () => quoteModal.classList.remove('open');

    getQuoteBtn.addEventListener('click', openModal);
    headerQuoteBtn.addEventListener('click', openModal);
    mobileQuoteBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    quoteModal.addEventListener('click', (e) => {
        if(e.target === quoteModal) {
            closeModal();
        }
    });

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        quoteForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        showNotification("Quote request sent. We'll be in touch!");

        setTimeout(() => {
            closeModal();
        }, 3000); // Close modal after 3 seconds
    });

    // --- Email Modal Logic ---
    const emailModal = document.getElementById('email-modal');
    const emailUsBtn = document.getElementById('email-us-btn');
    const closeEmailModalBtn = document.getElementById('close-email-modal-btn');
    const emailForm = document.getElementById('email-form');
    const emailSuccessMessage = document.getElementById('email-form-success-message');

    const openEmailModal = () => {
        emailModal.classList.add('open');
        emailForm.style.display = 'block';
        emailSuccessMessage.style.display = 'none';
        emailForm.reset();
    };
    const closeEmailModal = () => emailModal.classList.remove('open');

    emailUsBtn.addEventListener('click', openEmailModal);
    closeEmailModalBtn.addEventListener('click', closeEmailModal);
    emailModal.addEventListener('click', (e) => {
        if (e.target === emailModal) {
            closeEmailModal();
        }
    });

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you would send this data to a server
        emailForm.style.display = 'none';
        emailSuccessMessage.style.display = 'block';
        
        showNotification("Your message has been sent!");
        
        setTimeout(() => {
            closeEmailModal();
        }, 3000);
    });
}

export { initModals };