/* ═══════════════════════════════════════
   Portfolio — Clean Interactive Features
   Typing · Scroll Reveals · Dark Mode
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ─── DARK/LIGHT THEME ───
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    });

    // ─── MOBILE NAVIGATION ───
    const mobileMenu = document.getElementById('mobileMenu');
    const navMenu = document.getElementById('navMenu');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ─── SMOOTH SCROLLING ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPos = target.offsetTop - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ─── SCROLL EVENTS ───
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;

        // Scroll progress bar
        scrollProgress.style.width = scrollPercent + '%';

        // Navbar styling
        navbar.classList.toggle('scrolled', scrollY > 50);

        // Back to top button
        backToTop.classList.toggle('visible', scrollY > 500);

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── TYPING EFFECT ───
    const typingElement = document.getElementById('typingText');
    const typingTexts = [
        'Web Developer',
        'UI/UX Designer',
        'Creative Thinker',
        'Problem Solver',
        'Front-End Enthusiast'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const current = typingTexts[textIndex];

        if (isDeleting) {
            typingElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing effect
    setTimeout(typeEffect, 600);

    // ─── SCROLL REVEAL ───
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Animate skill bars when skills section is visible
                if (entry.target.closest('.skills')) {
                    animateSkillBars();
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── SKILL BAR ANIMATION ───
    let skillsAnimated = false;
    function animateSkillBars() {
        if (skillsAnimated) return;
        skillsAnimated = true;
        document.querySelectorAll('.skill-progress').forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, index * 120);
        });
    }

    // ─── PROJECT CAROUSELS ───
    const allCarousels = document.querySelectorAll('.project-carousel');

    allCarousels.forEach((carousel) => {
        const track = carousel.querySelector('.carousel-track');
        const dots = carousel.querySelectorAll('.carousel-dot');
        const slides = track.querySelectorAll('img');
        const totalSlides = slides.length;
        const card = carousel.closest('.project-card');
        let currentSlide = 0;
        let isPaused = false;

        function updateDots(index) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function showSlide(index) {
            slides.forEach(img => img.classList.remove('carousel-active'));
            slides[0].style.opacity = index === 0 ? '1' : '0';
            if (index > 0) {
                slides[index].classList.add('carousel-active');
            }
            updateDots(index);
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }

        // Auto-scroll every 3.5s
        setInterval(() => {
            if (!isPaused) nextSlide();
        }, 3500);

        // Pause on hover (desktop)
        if (card) {
            card.addEventListener('mouseenter', () => isPaused = true);
            card.addEventListener('mouseleave', () => isPaused = false);
        }

        // Click dots to navigate
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(currentSlide);
            });
        });

        // Mobile: Swipe support
        let touchStartX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isPaused = true;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    currentSlide = (currentSlide + 1) % totalSlides;
                } else {
                    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                }
                showSlide(currentSlide);
            }
            setTimeout(() => { isPaused = false; }, 5000);
        }, { passive: true });

        // Mobile: Tap card to toggle zoom out
        if (card) {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a, button, .carousel-dot, .project-info')) return;
                if (window.innerWidth <= 768) {
                    card.classList.toggle('carousel-zoomed');
                }
            });
        }
    });

    // ─── PROJECT FILTER ───
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ─── CONTACT FORM → EMAIL (Web3Forms) ───
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const WEB3FORMS_KEY = '528ea59b-8070-49fd-b6e0-595378b4a48f';

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Validation
            if (!name || !email || !subject || !message) {
                showToast('Mohon lengkapi semua field!', false);
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast('Email tidak valid!', false);
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_KEY,
                        name: name,
                        email: email,
                        subject: '[Portfolio] ' + subject,
                        message: message,
                        from_name: 'Portfolio Contact Form',
                    }),
                });

                const result = await response.json();

                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                if (result.success) {
                    contactForm.reset();
                    showToast('Pesan berhasil dikirim!', true);
                } else {
                    showToast('Gagal mengirim pesan. Coba lagi.', false);
                }
            } catch (error) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                showToast('Terjadi kesalahan jaringan. Coba lagi.', false);
            }
        });
    }

    function showToast(message, success) {
        const toastMsg = toast.querySelector('.toast-message');
        toastMsg.textContent = message;
        toast.style.background = success ? '#00c853' : '#ff5252';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    // ─── KEYBOARD ACCESSIBILITY ───
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ─── CSS Animations (injected) ───
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
