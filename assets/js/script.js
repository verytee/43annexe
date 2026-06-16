// ============================================
// 43 ANNEXE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initParallax();
    initMobileMenu();
    initInteractions();
});

// ============================================
// NAVIGATION ACTIVE LINK
// ============================================

function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const toggler = document.querySelector('.navbar-toggler');
                        toggler.click();
                    }
                    
                    // Smooth scroll with offset for navbar
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate on scroll
                    if (entry.target.classList.contains('feature-card')) {
                        entry.target.style.animation = `slideInUp 0.8s ease forwards`;
                        entry.target.style.animationDelay = `${Array.from(entry.target.parentElement.children).indexOf(entry.target) * 0.1}s`;
                    } else if (entry.target.classList.contains('accommodation-card')) {
                        entry.target.style.animation = `slideInUp 0.8s ease forwards`;
                        entry.target.style.animationDelay = `${Array.from(entry.target.parentElement.children).indexOf(entry.target) * 0.1}s`;
                    } else {
                        entry.target.classList.add('animate-on-scroll');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animated elements
        document.querySelectorAll('.about-section, .accommodation-section, .features-section, .feature-card, .accommodation-card').forEach(el => {
            observer.observe(el);
        });
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================

function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }
}

// ============================================
// MOBILE MENU
// ============================================

function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler) {
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

function initInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Feature cards stagger on hover
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            featureCards.forEach((c, i) => {
                if (i !== index) {
                    c.style.opacity = '0.8';
                    c.style.transform = 'scale(0.98)';
                }
            });
        });
        card.addEventListener('mouseleave', function() {
            featureCards.forEach((c) => {
                c.style.opacity = '1';
                c.style.transform = 'scale(1)';
            });
        });
    });

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.animation = 'fadeIn 0.6s ease';
        });
        
        // If image is already cached, trigger animation immediately
        if (img.complete) {
            img.style.animation = 'fadeIn 0.6s ease';
        }
    });

    // Scroll reveal numbers (if any counters are added later)
    const counters = document.querySelectorAll('[data-target]');
    if (counters.length > 0) {
        initCounters();
    }
}

// ============================================
// COUNTER ANIMATION (Optional)
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    const observerOptions = {
        threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target'));
                const increment = targetValue / 30;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetValue) {
                        target.textContent = targetValue;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current);
                    }
                }, 50);

                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Add scroll class to navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 59, 92, 0.15)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    }
});

// Prevent layout shift on scroll
document.documentElement.style.scrollPaddingTop = '80px';

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Use passive listeners for better scroll performance
window.addEventListener('scroll', () => {
    // Scroll logic here
}, { passive: true });

// ============================================
// LAZY LOADING IMAGES (Enhanced)
// ============================================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading when page loads
window.addEventListener('load', initLazyLoading);

// ============================================
// FORM INTERACTIONS (for booking or contact)
// ============================================

function initFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.style.borderColor = 'var(--ocean)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.borderColor = '';
            });
        });

        // Add form submission handling
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add visual feedback
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.textContent = 'Sent!';
                submitBtn.style.backgroundColor = 'var(--sage)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    form.reset();
                }, 2000);
            }, 1500);
        });
    });
}

// Initialize form interactions when page loads
window.addEventListener('load', initFormInteractions);

console.log('43 Annexe website initialised successfully!');