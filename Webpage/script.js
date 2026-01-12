// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
} else {
    // Fallback for very old browsers: reveal all elements
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    });
}

// Smooth scroll for anchor links (fallback for older browsers/Safari if needed, 
// though CSS scroll-behavior usually handles it)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Ensure external links opened in new tabs are safe (rel="noopener noreferrer")
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        let rel = a.getAttribute('rel') || '';
        if (!/noopener/.test(rel)) rel = (rel + ' noopener').trim();
        if (!/noreferrer/.test(rel)) rel = (rel + ' noreferrer').trim();
        a.setAttribute('rel', rel);
    });

    // Mobile nav toggle with focus trap, escape, and outside click close
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    let onKeyDown, onClickOutside;

    if (navToggle && primaryNav) {
        primaryNav.setAttribute('aria-hidden', 'true');

        const getFocusable = () => Array.from(primaryNav.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')).filter(el => !el.disabled && el.offsetParent !== null);

        const openNav = () => {
            primaryNav.classList.add('open');
            primaryNav.setAttribute('aria-hidden', 'false');
            navToggle.setAttribute('aria-expanded', 'true');
            const focusable = getFocusable();
            if (focusable.length) focusable[0].focus();

            onKeyDown = (e) => {
                if (e.key === 'Escape') {
                    closeNav();
                } else if (e.key === 'Tab') {
                    const focusable = getFocusable();
                    if (!focusable.length) return;
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            };

            onClickOutside = (e) => {
                if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
            };

            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('click', onClickOutside);
            window.addEventListener('resize', handleResize);
        };

        const closeNav = () => {
            primaryNav.classList.remove('open');
            primaryNav.setAttribute('aria-hidden', 'true');
            navToggle.setAttribute('aria-expanded', 'false');
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('click', onClickOutside);
            window.removeEventListener('resize', handleResize);
            navToggle.focus();
        };

        const handleResize = () => {
            if (window.innerWidth > 768 && primaryNav.classList.contains('open')) closeNav();
        };

        navToggle.addEventListener('click', () => {
            if (primaryNav.classList.contains('open')) closeNav(); else openNav();
        });

        // Close menu when any nav link is clicked (useful for single-page anchors)
        primaryNav.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') closeNav();
        });
    }
});
