/* ═══════════════════════════════════════════════
   ✨ PORTFOLIO - Advanced Interactive Features
   Particles · Typing · Scroll Reveals · Dark Mode
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ─── LOADING SCREEN ───
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loaderProgress');
    const loaderPercent = document.getElementById('loaderPercent');

    let currentProgress = 0;
    const targetSteps = [25, 50, 75, 95, 100];
    let stepIndex = 0;

    const loadInterval = setInterval(() => {
        const target = targetSteps[stepIndex];
        if (currentProgress < target) {
            currentProgress += 5;
            if (currentProgress > target) currentProgress = target;
            loaderProgress.style.width = currentProgress + '%';
            loaderPercent.textContent = currentProgress + '%';
        } else if (stepIndex < targetSteps.length - 1) {
            stepIndex++;
        } else {
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                startHeroAnimations();
            }, 150);
        }
    }, 10);

    document.body.style.overflow = 'hidden';

    // ─── PARTICLE SYSTEM ───
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'dark' ? '59, 130, 246' : '37, 99, 235';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        const theme = document.documentElement.getAttribute('data-theme');
        const color = theme === 'dark' ? '59, 130, 246' : '37, 99, 235';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // ─── CURSOR GLOW ───
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ─── DARK/LIGHT THEME ───
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        // Re-initialize icons after theme change
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
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typingSpeed = 400; // Pause before typing
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // ─── HERO ANIMATIONS ───
    function startHeroAnimations() {
        // Start typing effect
        setTimeout(typeEffect, 500);

        // Animate stat counters
        animateCounters();
    }

    // ─── COUNTER ANIMATION ───
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

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
        rootMargin: '0px 0px -50px 0px'
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
            }, index * 150);
        });
    }

    // ─── PROJECT CAROUSELS (multiple) ───
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

        // Auto-scroll tiap 3 detik
        setInterval(() => {
            if (!isPaused) nextSlide();
        }, 3000);

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

        // ─── MOBILE: Swipe support ───
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

        // ─── MOBILE: Tap card to toggle zoom out ───
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
            // Update active button
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

    // ─── TILT EFFECT (Skill Cards) ───
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

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
