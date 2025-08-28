// Cosmolux Interactive Features with Full-Screen Sections and Dynamic Transitions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initFullScreenNavigation();
    initSectionTransitions();
    initAccordion();
    initTeamCarousel();
    initScrollEffects();
    initNavigationEffects();
    initDynamicBackgrounds();
});

// Full-Screen Section Navigation
function initFullScreenNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = 0;
    let isTransitioning = false;
    
    // Section mapping
    const sectionMap = {
        '#home': 0,
        '#orrery': 1,
        '#about': 2,
        '#team': 3
    };
    
    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (isTransitioning) return;
            
            const targetHref = this.getAttribute('href');
            const targetIndex = sectionMap[targetHref];
            
            if (targetIndex !== undefined && targetIndex !== currentSection) {
                navigateToSection(targetIndex);
            }
        });
    });
    
    // Scroll-based navigation
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking && !isTransitioning) {
            requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                navigateToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSection > 0) {
                navigateToSection(currentSection - 1);
            }
        }
    });
    
    function navigateToSection(targetIndex) {
        if (targetIndex < 0 || targetIndex >= sections.length) return;
        
        isTransitioning = true;
        currentSection = targetIndex;
        
        // Trigger transition effect
        triggerSectionTransition(() => {
            // Scroll to target section
            sections[targetIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update navigation state
            updateNavigation(targetIndex);
            
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        });
    }
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                if (currentSection !== index) {
                    currentSection = index;
                    updateNavigation(index);
                }
            }
        });
    }
    
    function updateNavigation(activeIndex) {
        navLinks.forEach((link, index) => {
            link.classList.remove('active');
        });
        
        const sectionKeys = Object.keys(sectionMap);
        const activeHref = sectionKeys[activeIndex];
        const activeLink = document.querySelector(`[href="${activeHref}"]`);
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Advanced Section Transitions
function initSectionTransitions() {
    const transitionOverlay = document.querySelector('.transition-overlay');
    
    window.triggerSectionTransition = function(callback) {
        // Create ripple effect
        transitionOverlay.classList.add('ripple-active');
        
        // Execute callback during transition
        setTimeout(() => {
            if (callback) callback();
        }, 300);
        
        // Remove transition effect
        setTimeout(() => {
            transitionOverlay.classList.remove('ripple-active');
        }, 800);
    };
    
    // Mouse-based ripple origin
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        transitionOverlay.style.background = `radial-gradient(circle at ${x}% ${y}%, var(--cosmic-teal) 0%, var(--nebula-purple) 50%, var(--deep-space-blue) 100%)`;
    });
}

// Accordion Functionality
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all accordions
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                otherContent.style.maxHeight = '0';
            });
            
            // Toggle current accordion
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                
                // Add ripple effect to header
                createRipple(header, event);
            }
        });
    });
    
    // Open first accordion by default
    setTimeout(() => {
        if (accordionItems.length > 0) {
            accordionItems[0].querySelector('.accordion-header').click();
        }
    }, 500);
}

// Advanced Team Carousel
function initTeamCarousel() {
    const teamTrack = document.querySelector('.team-track');
    const teamMembers = document.querySelectorAll('.team-member');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentIndex = 0;
    const totalMembers = teamMembers.length;
    let autoPlayInterval;
    
    function updateCarousel() {
        // Move track
        const translateX = -(currentIndex * 332); // 300px width + 32px margin
        teamTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update active states
        teamMembers.forEach((member, index) => {
            member.classList.remove('active');
            if (index === currentIndex) {
                member.classList.add('active');
            }
        });
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
        
        // Add entrance animations
        const activeMember = teamMembers[currentIndex];
        activeMember.style.animation = 'none';
        activeMember.offsetHeight; // Trigger reflow
        activeMember.style.animation = 'fadeInScale 0.6s ease forwards';
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalMembers;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalMembers) % totalMembers;
        updateCarousel();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
        createRipple(nextBtn, event);
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
        createRipple(prevBtn, event);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
            createRipple(dot, event);
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    // Pause on hover
    const teamCarousel = document.querySelector('.team-carousel');
    teamCarousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    teamCarousel.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    // Initialize
    updateCarousel();
    startAutoPlay();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInScale {
            0% {
                opacity: 0.7;
                transform: scale(0.9) translateY(20px);
            }
            100% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Advanced Scroll Effects
function initScrollEffects() {
    // Parallax for hero elements
    const heroContent = document.querySelector('.hero-content');
    const stars = document.querySelector('.stars');
    const nebula = document.querySelector('.nebula');
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Staggered animations for accordion items
                if (entry.target.classList.contains('accordion-item')) {
                    const items = document.querySelectorAll('.accordion-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effects
    const sectionsToObserve = document.querySelectorAll('.orrery-section, .about-section, .team-section');
    sectionsToObserve.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // Observe accordion items
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
    
    // Smooth parallax on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                if (scrolled < window.innerHeight && heroContent && stars && nebula) {
                    const parallaxSpeed = scrolled * 0.5;
                    const starsSpeed = scrolled * 0.2;
                    const nebulaSpeed = scrolled * 0.3;
                    
                    heroContent.style.transform = `translateY(${parallaxSpeed}px)`;
                    stars.style.transform = `translateY(${starsSpeed}px)`;
                    nebula.style.transform = `translateY(${nebulaSpeed}px)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Navigation Effects
function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Dynamic navbar background
        if (currentScrollY > 50) {
            navbar.style.background = 'rgba(11, 20, 38, 0.95)';
            navbar.style.borderBottom = '1px solid rgba(78, 205, 196, 0.3)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(11, 20, 38, 0.9)';
            navbar.style.borderBottom = '1px solid rgba(78, 205, 196, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Logo click handler
    const logo = document.querySelector('.nav-logo a');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            triggerSectionTransition(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // CTA button functionality
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            createRipple(ctaButton, e);
            
            // Navigate to orrery section
            triggerSectionTransition(() => {
                const orrerySection = document.querySelector('#orrery');
                if (orrerySection) {
                    orrerySection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Dynamic Background Effects
function initDynamicBackgrounds() {
    // Enhanced star field
    createDynamicStars();
    
    // Shooting stars
    createShootingStars();
    
    // Mouse interaction with nebula
    initNebulaInteraction();
    
    // Orbital animations enhancement
    enhanceOrbitalAnimations();
}

function createDynamicStars() {
    const starsContainer = document.querySelector('.stars');
    
    if (!starsContainer) return;
    
    // Create additional dynamic stars
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: white;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: twinkle ${Math.random() * 3 + 2}s infinite;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
            z-index: 1;
        `;
        starsContainer.appendChild(star);
    }
}

function createShootingStars() {
    const sections = document.querySelectorAll('.section');
    
    function createShootingStar() {
        sections.forEach(section => {
            if (Math.random() < 0.3) { // 30% chance per section
                const shootingStar = document.createElement('div');
                shootingStar.className = 'shooting-star';
                
                const startX = Math.random() * window.innerWidth;
                const startY = Math.random() * (window.innerHeight * 0.6);
                
                shootingStar.style.cssText = `
                    position: absolute;
                    left: ${startX}px;
                    top: ${startY}px;
                    width: 2px;
                    height: 2px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px white, 0 0 20px rgba(78, 205, 196, 0.5);
                    pointer-events: none;
                    z-index: 5;
                `;
                
                section.appendChild(shootingStar);
                
                // Animate shooting star
                const animation = shootingStar.animate([
                    { 
                        transform: 'translateX(0) translateY(0) scale(1)', 
                        opacity: 0,
                        boxShadow: '0 0 10px white'
                    },
                    { 
                        transform: 'translateX(50px) translateY(25px) scale(1)', 
                        opacity: 1,
                        boxShadow: '0 0 20px white, 0 0 40px rgba(78, 205, 196, 0.8)'
                    },
                    { 
                        transform: 'translateX(300px) translateY(150px) scale(0)', 
                        opacity: 0,
                        boxShadow: '0 0 5px white'
                    }
                ], {
                    duration: 1500,
                    easing: 'ease-out'
                });
                
                animation.onfinish = () => {
                    shootingStar.remove();
                };
            }
        });
    }
    
    // Create shooting stars periodically
    setInterval(createShootingStar, Math.random() * 8000 + 3000);
}

function initNebulaInteraction() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const nebula = section.querySelector('.nebula, .nebula-variant');
        
        if (nebula) {
            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                nebula.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
            });
            
            section.addEventListener('mouseleave', () => {
                nebula.style.transform = 'translate(0, 0)';
            });
        }
    });
}

function enhanceOrbitalAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const orbitSystem = card.querySelector('.orbit-system');
        
        if (orbitSystem) {
            card.addEventListener('mouseenter', () => {
                const orbits = orbitSystem.querySelectorAll('.orbit');
                const planets = orbitSystem.querySelectorAll('.planet');
                
                orbits.forEach((orbit, index) => {
                    orbit.style.animationDuration = `${1 + index * 0.5}s`;
                    orbit.style.borderColor = 'rgba(78, 205, 196, 0.6)';
                });
                
                planets.forEach(planet => {
                    planet.style.boxShadow = `0 0 15px ${planet.style.background}`;
                });
            });
            
            card.addEventListener('mouseleave', () => {
                const orbits = orbitSystem.querySelectorAll('.orbit');
                const planets = orbitSystem.querySelectorAll('.planet');
                
                orbits.forEach((orbit, index) => {
                    orbit.style.animationDuration = `${4 + index * 2}s`;
                    orbit.style.borderColor = 'rgba(78, 205, 196, 0.3)';
                });
                
                planets.forEach(planet => {
                    planet.style.boxShadow = `0 0 10px ${planet.style.background}`;
                });
            });
        }
    });
}

// Utility Functions
function createRipple(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-effect 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple-effect {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Performance optimizations
function optimizeAnimations() {
    // Use transform3d for hardware acceleration
    const animatedElements = document.querySelectorAll('.orbit, .planet, .team-track');
    animatedElements.forEach(element => {
        element.style.transform += ' translateZ(0)';
    });
}

// Initialize performance optimizations
setTimeout(optimizeAnimations, 1000);

// Smooth resize handling
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions and sizes
        const teamCarousel = document.querySelector('.team-carousel');
        if (teamCarousel) {
            // Trigger carousel update
            const currentActive = document.querySelector('.team-member.active');
            if (currentActive) {
                const index = Array.from(document.querySelectorAll('.team-member')).indexOf(currentActive);
                const teamTrack = document.querySelector('.team-track');
                teamTrack.style.transform = `translateX(${-(index * 332)}px)`;
            }
        }
    }, 250);
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles for keyboard navigation
const focusStyles = document.createElement('style');
focusStyles.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--cosmic-teal) !important;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.3);
    }
`;
document.head.appendChild(focusStyles);