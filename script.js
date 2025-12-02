/**
 * Benji's Deli & Restaurant
 * Interactive JavaScript
 * Est. 1963 - Milwaukee, WI
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initMobileMenu();
    initStickyNav();
    initTicketCounter();
    initScrollAnimations();
    initStatCounters();
    initOpenStatus();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');

        // Animate hamburger to X
        const spans = menuBtn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuBtn.classList.remove('active');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * Sticky Navigation with Hide on Scroll Down
 */
function initStickyNav() {
    const nav = document.querySelector('.main-nav');
    const banner = document.querySelector('.specials-banner');
    let lastScroll = 0;
    let bannerHeight = banner ? banner.offsetHeight : 40;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > bannerHeight) {
            nav.style.boxShadow = '0 4px 20px rgba(43, 24, 16, 0.15)';
        } else {
            nav.style.boxShadow = '0 4px 20px rgba(43, 24, 16, 0.1)';
        }

        // Hide/show nav on scroll (optional - currently disabled for better UX)
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     nav.style.transform = 'translateY(-100%)';
        // } else {
        //     nav.style.transform = 'translateY(0)';
        // }

        lastScroll = currentScroll;
    });
}

/**
 * "Now Serving" Ticket Counter Animation
 * Continuously cycles through numbers with a mechanical flip feel
 */
function initTicketCounter() {
    const ticketNumber = document.getElementById('ticketNumber');
    if (!ticketNumber) return;

    let currentNumber = Math.floor(Math.random() * 100);
    ticketNumber.textContent = currentNumber.toString().padStart(2, '0');

    // Flip through numbers rapidly before landing on target
    function flipToNumber(target) {
        const flipDuration = 800; // Total time for flip animation
        const flipSteps = 8 + Math.floor(Math.random() * 6); // 8-13 flips
        const stepDelay = flipDuration / flipSteps;
        let step = 0;

        function doFlip() {
            if (step < flipSteps) {
                // Random number during flip
                const randomNum = Math.floor(Math.random() * 100);
                ticketNumber.textContent = randomNum.toString().padStart(2, '0');
                ticketNumber.style.transform = `scaleY(${0.7 + Math.random() * 0.3}) translateY(${(Math.random() - 0.5) * 4}px)`;
                ticketNumber.style.opacity = 0.6 + Math.random() * 0.4;
                step++;
                setTimeout(doFlip, stepDelay);
            } else {
                // Land on target
                ticketNumber.textContent = target.toString().padStart(2, '0');
                ticketNumber.style.transform = 'scaleY(1) translateY(0)';
                ticketNumber.style.opacity = 1;

                // Brief overshoot animation
                ticketNumber.style.transform = 'scaleY(1.1)';
                setTimeout(() => {
                    ticketNumber.style.transform = 'scaleY(1)';
                }, 100);
            }
        }

        doFlip();
    }

    // Cycle to next number
    function nextNumber() {
        // Jump by 1-4 numbers randomly
        const jump = 1 + Math.floor(Math.random() * 4);
        currentNumber = (currentNumber + jump) % 100;

        flipToNumber(currentNumber);

        // Schedule next flip (1.5-3.5 seconds)
        const nextDelay = 1500 + Math.random() * 2000;
        setTimeout(nextNumber, nextDelay);
    }

    // Add CSS transition to the ticket number
    ticketNumber.style.transition = 'transform 0.08s ease, opacity 0.08s ease';

    // Start after brief delay
    setTimeout(nextNumber, 1500);
}

/**
 * Scroll-triggered Fade In Animations
 */
function initScrollAnimations() {
    // Add fade-in class to elements we want to animate
    const animatedElements = document.querySelectorAll(
        '.classic-card, .section-header, .story-container, .catering-showcase, .info-block, .polaroid'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // Add stagger classes for grouped elements
        if (el.classList.contains('classic-card')) {
            el.classList.add(`stagger-${(index % 4) + 1}`);
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Animated Stat Counters
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.dataset.count);
                animateCounter(target, countTo);
                countObserver.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => countObserver.observe(stat));
}

/**
 * Counter Animation Helper
 */
function animateCounter(element, target) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepDuration);
}

/**
 * Dynamic Open/Closed Status
 */
function initOpenStatus() {
    const openSign = document.getElementById('openSign');
    if (!openSign) return;

    const openText = openSign.querySelector('.open-text');

    function checkOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday
        const hour = now.getHours();

        let isOpen = false;

        // Hours: Mon-Sat 7am-7pm, Sunday 8am-5pm
        if (day === 0) {
            // Sunday
            isOpen = hour >= 8 && hour < 17;
        } else {
            // Monday - Saturday
            isOpen = hour >= 7 && hour < 19;
        }

        if (isOpen) {
            openText.textContent = 'OPEN';
            openSign.style.background = '#6b8e23';
        } else {
            openText.textContent = 'CLOSED';
            openSign.style.background = '#c41e3a';
            openSign.style.animation = 'none';
        }
    }

    checkOpenStatus();
    // Check every minute
    setInterval(checkOpenStatus, 60000);
}

/**
 * Smooth Scroll for Anchor Links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const bannerHeight = document.querySelector('.specials-banner').offsetHeight;
            const offset = navHeight + bannerHeight + 20;

            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Pickle Rating Hover Effect (Fun Easter Egg)
 */
document.querySelectorAll('.pickle-rating').forEach(rating => {
    const pickles = rating.querySelectorAll('.pickle');

    rating.addEventListener('mouseenter', () => {
        pickles.forEach((pickle, index) => {
            setTimeout(() => {
                pickle.style.transform = 'scale(1.3) rotate(10deg)';
            }, index * 50);
        });
    });

    rating.addEventListener('mouseleave', () => {
        pickles.forEach(pickle => {
            pickle.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

/**
 * Parallax Effect on Hero (Subtle)
 */
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-bg');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrolled < heroHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

/**
 * Add transition to pickle elements
 */
document.querySelectorAll('.pickle').forEach(pickle => {
    pickle.style.transition = 'transform 0.2s ease';
    pickle.style.display = 'inline-block';
});
