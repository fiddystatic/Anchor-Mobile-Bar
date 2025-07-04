import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initAnimations() {
    // --- Page Load Animations ---
    gsap.from('.main-header', { y: '-100%', duration: 1, ease: 'power3.out', delay: 0.2 });
    
    gsap.timeline({defaults: { duration: 0.8, ease: 'power2.out' }})
      .from('.hero-title', { opacity: 0, y: 30 }, 0.7)
      .from('.hero-subtitle', { opacity: 0, y: 30 }, 0.8)
      .from('.cta', { opacity: 0, y: 30 }, 0.9);

    // --- Scroll-triggered Animations ---
    const sectionsToAnimate = [
        { selector: '#about .about-image', from: { x: -100, opacity: 0 } },
        { selector: '#about .about-content', from: { x: 100, opacity: 0 } }
    ];

    gsap.from('.service-card', {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 85%',
        }
    });

    gsap.from('.menu-card', {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.menu-section .grid',
            start: 'top 85%',
        }
    });

    sectionsToAnimate.forEach(section => {
        gsap.from(section.selector, {
            ...section.from,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section.selector,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });
}

export { initAnimations };

