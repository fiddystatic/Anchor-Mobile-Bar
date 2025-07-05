function initNavigation() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const mobileNavTooltip = document.getElementById('mobile-nav-tooltip');
    const sections = document.querySelectorAll('main section');

    mobileNavToggle.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Mobile nav tooltips
    if (mobileNavTooltip) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const text = link.dataset.text;
                mobileNavTooltip.textContent = text;
                mobileNavTooltip.style.display = 'block';
                const linkRect = e.currentTarget.getBoundingClientRect();
                const panelRect = mobileNavPanel.getBoundingClientRect();
                mobileNavTooltip.style.top = `${linkRect.top}px`;
                mobileNavTooltip.style.left = `${panelRect.right + 10}px`;
            });
            link.addEventListener('mouseleave', () => {
                mobileNavTooltip.style.display = 'none';
            });
        });
    }

    // Active link highlighting on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "-50% 0px -50% 0px" });

    sections.forEach(section => {
        observer.observe(section);
    });
}

export { initNavigation };