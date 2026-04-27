// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderText = document.querySelector('.loader-text');
    let percentage = 0;

    const interval = setInterval(() => {
        percentage += Math.floor(Math.random() * 15) + 1;
        if (percentage >= 100) {
            percentage = 100;
            clearInterval(interval);
            
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    loader.style.display = 'none';
                    initAnimations();
                }
            });
        }
    }, 40);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars-staggered');
        icon.classList.toggle('fa-xmark');
    });
}

// Close menu when link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars-staggered');
        icon.classList.remove('fa-xmark');
    });
});

function initAnimations() {
    // Hero Animations
    const tl = gsap.timeline();
    tl.from('.hero-text h2', {
        opacity: 0,
        x: -30,
        duration: 0.8
    })
    .from('.hero-text h1', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    }, "-=0.5")
    .from('.hero-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8
    }, "-=0.7")
    .from('.hero-image', {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
    }, "-=1")
    .from('.float-card', {
        opacity: 0,
        scale: 0.5,
        duration: 1,
        ease: "back.out(1.7)"
    }, "-=0.8")
    .from('.header', {
        y: -100,
        opacity: 0,
        duration: 0.8
    }, "-=1.2");

    // Section Reveal Animations
    gsap.utils.toArray('.glass-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Horizontal Scroll for Projects (Desktop only)
    const sections = gsap.utils.toArray('.project-slide');
    const projectSection = document.querySelector('.horizontal-container');
    const horizontalContent = document.querySelector('.horizontal-content');

    ScrollTrigger.matchMedia({
        "(min-width: 769px)": function() {
            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: projectSection,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + horizontalContent.offsetWidth
                }
            });
        },
        "(max-width: 768px)": function() {
            // Horizontal container becomes normal vertical flow on mobile
            gsap.set(sections, { xPercent: 0 });
        }
    });

    // Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    const xCursor = gsap.quickSetter(cursor, "x", "px");
    const yCursor = gsap.quickSetter(cursor, "y", "px");
    const xFollower = gsap.quickSetter(follower, "x", "px");
    const yFollower = gsap.quickSetter(follower, "y", "px");

    document.addEventListener('mousemove', (e) => {
        xCursor(e.clientX);
        yCursor(e.clientY);
        
        gsap.to({}, {
            duration: 0.1,
            onUpdate: () => {
                xFollower(e.clientX - 10);
                yFollower(e.clientY - 10);
            }
        });
    });

    // Cursor Hover Effects
    const interactiveElements = document.querySelectorAll('a, button, .glass-card, .tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 1.8,
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            });
        });
    });

    // Parallax for floating card
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 20;
        const y = (window.innerHeight / 2 - e.pageY) / 20;
        gsap.to('.float-card', {
            x: x,
            y: y,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Blob Movement
    const blob = document.getElementById('blob');
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        gsap.to(blob, {
            left: clientX - 250,
            top: clientY - 250,
            duration: 1.2,
            ease: "power1.out"
        });
    });
}



// Nav Link Click Fix for Lenis
document.querySelectorAll('.nav-link, .btn-contact').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            lenis.scrollTo(href);
        }
    });
});
