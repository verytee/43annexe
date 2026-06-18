// ============================================
// 43 ANNEXE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initActiveLink();
    initReveal();
    initMobileNavClose();
    initYear();
});

/* --- Nav: add scrolled class --- */
function initNavScroll() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    const onScroll = () => {
        if (window.scrollY > 30) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Active link highlighting --- */
function initActiveLink() {
    const links = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = Array.from(links)
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = () => {
        const y = window.scrollY + 140;
        let current = sections[0].id;
        sections.forEach(sec => {
            if (sec.offsetTop <= y) current = sec.id;
        });
        links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
        });
    };
    setActive();
    window.addEventListener('scroll', setActive, { passive: true });
}

/* --- Reveal on scroll --- */
function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    // Tag elements to reveal
    const selectors = [
        '.section-about .col-lg-6',
        '.section-gallery .annexe-carousel',
        '.chip-card',
        '.info-tile',
        '.story-card',
        '.dest-card',
        '.map-wrap',
        '.cta-card',
        '.feature-list-item'
    ];
    const targets = document.querySelectorAll(selectors.join(','));
    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(t => io.observe(t));
}

/* --- Close mobile nav on link click --- */
function initMobileNavClose() {
    const links = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn');
    const collapse = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');
    if (!collapse || !toggler) return;
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (collapse.classList.contains('show')) toggler.click();
        });
    });
}

/* --- Footer year --- */
function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}