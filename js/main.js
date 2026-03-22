/* ==========================================================
   3D SOUND & ENTERTAINMENT — Main Script
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------
       NAV — scroll background + hamburger toggle
       -------------------------------------------------- */
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');

    // Solid nav on scroll
    const handleNavScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Fullscreen menu toggle
    menuToggle.addEventListener('click', () => {
        const isOpen = menuOverlay.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.menu-overlay__link').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    /* --------------------------------------------------
       SMOOTH SCROLL for anchor links
       -------------------------------------------------- */
    const isMobile = () => window.innerWidth <= 768;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = isMobile() ? 60 : 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    /* --------------------------------------------------
       SCROLL ANIMATIONS — Intersection Observer
       -------------------------------------------------- */
    const animElements = document.querySelectorAll('.anim-fade');

    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll(':scope > .anim-fade');
                let delay = 0;
                siblings.forEach((el, i) => {
                    if (el === entry.target) delay = i * (isMobile() ? 40 : 80);
                });
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: isMobile() ? 0.03 : 0.08,
        rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -40px 0px'
    });

    animElements.forEach(el => animObserver.observe(el));


    /* --------------------------------------------------
       COUNTER ANIMATION
       -------------------------------------------------- */
    const counters = document.querySelectorAll('[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(tick);
    }




    /* --------------------------------------------------
       SERVICES TABS
       -------------------------------------------------- */
    const serviceTabs = document.querySelectorAll('.services__tab');
    const servicePanels = document.querySelectorAll('.services__panel');

    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.service;

            serviceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            servicePanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `svc-${target}`) {
                    panel.classList.add('active');
                }
            });
        });
    });


    /* --------------------------------------------------
       TESTIMONIALS CAROUSEL
       -------------------------------------------------- */
    const slides = document.querySelectorAll('.testimonials__slide');
    const dotsContainer = document.getElementById('testimonialDots');
    let currentSlide = 0;
    let testimonialInterval;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonials__dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startCarousel() {
        testimonialInterval = setInterval(nextSlide, 5000);
    }

    function stopCarousel() {
        clearInterval(testimonialInterval);
    }

    startCarousel();

    // Pause on hover (desktop)
    const carousel = document.querySelector('.testimonials__carousel');
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // Touch swipe support for testimonials
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopCarousel();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left: next slide
                goToSlide((currentSlide + 1) % slides.length);
            } else {
                // Swipe right: previous slide
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
            }
        }
        startCarousel();
    }, { passive: true });


    /* --------------------------------------------------
       FOOTER EMAIL FORM
       -------------------------------------------------- */
    const footerForm = document.getElementById('footerForm');
    footerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = footerForm.querySelector('.footer__submit');
        const input = footerForm.querySelector('.footer__input');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '&#10003;';
        input.value = '';
        input.placeholder = 'Subscribed!';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            input.placeholder = 'Your email';
        }, 3000);
    });


    /* --------------------------------------------------
       ACTIVE NAV SECTION TRACKING
       -------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const menuLinks = document.querySelectorAll('.menu-overlay__link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                menuLinks.forEach(link => {
                    link.style.color = link.getAttribute('href') === `#${id}`
                        ? '#829cbc'
                        : '';
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -40% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

});
