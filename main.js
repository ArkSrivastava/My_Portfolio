document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile or has touch capability
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Initialize the 3D background with device detection
    initThreeJS();
    
    // Loading screen
    setTimeout(function() {
        document.querySelector('.loading-screen').style.opacity = '0';
        setTimeout(function() {
            document.querySelector('.loading-screen').style.display = 'none';
        }, 500);
    }, 1500);
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Custom cursor - only for non-touch devices
    if (!hasTouch) {
        const cursor = document.querySelector('.custom-cursor');
        const cursorFollower = document.querySelector('.custom-cursor-follower');
        
        if (cursor && cursorFollower) {
            document.addEventListener('mousemove', function(e) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
                
                setTimeout(function() {
                    cursorFollower.style.left = e.clientX + 'px';
                    cursorFollower.style.top = e.clientY + 'px';
                }, 100);
            });
            
            // Cursor effects on interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .theme-switch, .scroll-to-top, input, textarea, .project-card, .skill-item');
            
            interactiveElements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    cursor.style.width = '30px';
                    cursor.style.height = '30px';
                    cursor.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.5)';
                    cursorFollower.style.width = '50px';
                    cursorFollower.style.height = '50px';
                });
                
                element.addEventListener('mouseleave', function() {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                    cursor.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.3)';
                    cursorFollower.style.width = '40px';
                    cursorFollower.style.height = '40px';
                });
            });
        }
    } else {
        // Hide custom cursor on touch devices
        const cursor = document.querySelector('.custom-cursor');
        const cursorFollower = document.querySelector('.custom-cursor-follower');
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }
    
    // Theme switcher
    const themeSwitch = document.querySelector('.theme-switch');
    const themeIcon = themeSwitch ? themeSwitch.querySelector('i') : null;
    
    // Scroll to top button with performance optimization
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        // Throttle function for scroll event
        const throttleScroll = (func, delay) => {
            let lastCall = 0;
            return function(...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) {
                    return;
                }
                lastCall = now;
                return func(...args);
            };
        };
        
        // Show/hide scroll-to-top button based on scroll position
        const toggleScrollToTopBtn = () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        };
        
        // Apply throttling with different values based on device type
        const throttledToggle = throttleScroll(toggleScrollToTopBtn, isMobile ? 200 : 100);
        window.addEventListener('scroll', throttledToggle, { passive: true });
        
        // Smooth scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Theme switcher with local storage for persistence
    if (themeSwitch && themeIcon) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        
        // Apply saved theme or default to dark
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeSwitch.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            
            if (document.body.classList.contains('light-theme')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // This theme preference check is redundant as it's already handled above
    // The implementation above is more complete with null checks for themeIcon
    
    // Scroll to top button - This is a duplicate and can be removed as it's already handled above
    // The implementation above with throttling is better for performance
    
    // Typing animation
    const typingElement = document.querySelector('.typing-text');
    
    // Check if typing element exists
    if (typingElement) {
        const words = ['Software Engineer', 'Full-Stack Developer', 'Problem Solver', 'Tech Enthusiast'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let typingTimeout = null;
        
        function typeEffect() {
            try {
                // Check if element still exists in DOM
                if (!document.body.contains(typingElement)) {
                    console.warn('Typing element no longer in DOM');
                    if (typingTimeout) clearTimeout(typingTimeout);
                    return;
                }
                
                const currentWord = words[wordIndex];
                
                if (isDeleting) {
                    typingElement.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 50;
                } else {
                    typingElement.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 150;
                }
                
                if (!isDeleting && charIndex === currentWord.length) {
                    isDeleting = true;
                    typingSpeed = 1000; // Pause at end of word
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typingSpeed = 500; // Pause before typing next word
                }
                
                typingTimeout = setTimeout(typeEffect, typingSpeed);
            } catch (error) {
                console.error('Error in typing effect:', error);
                if (typingTimeout) clearTimeout(typingTimeout);
            }
        }
        
        // Start after a delay
        typingTimeout = setTimeout(typeEffect, 1000);
    } else {
        console.warn('Typing element not found');
    }
    
    // Initialize navigation
    initNavigation();
    
    // Initialize the projects filter
    initProjectsFilter();
    
    // Initialize the contact form
    initContactForm();
    
    // Initialize scroll indicator
    initScrollIndicator();
    
    // Initialize scroll progress indicator
    initScrollProgress();
    
    // Reveal animations - with performance optimization for mobile
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    
    // Skip reveal animations on mobile devices to improve performance
    if (isMobile) {
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    } else {
        // Throttle function to limit how often a function can run
        function throttle(func, delay) {
            let lastCall = 0;
            return function(...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) {
                    return;
                }
                lastCall = now;
                return func(...args);
            };
        }
        
        function checkReveal() {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('active');
                }
            });
        }
        
        // Use throttled version of checkReveal for better performance
        const throttledCheckReveal = throttle(checkReveal, 100);
        window.addEventListener('scroll', throttledCheckReveal);
        checkReveal(); // Check on page load
    }
});


function initThreeJS() {
    // Check if device is mobile or has low performance
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPerformance = window.innerWidth <= 375;
    
    // Exit early for very small devices
    if (isLowPerformance) {
        const container = document.getElementById('canvas-container');
        if (container) container.style.display = 'none';
        return;
    }
    
    // Get the container element
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    // Create a scene
    const scene = new THREE.Scene();
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer with optimizations for mobile
    const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, // Disable antialiasing on mobile
        alpha: true,
        powerPreference: 'low-power' // Optimize for battery life
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? Math.min(1.5, window.devicePixelRatio) : window.devicePixelRatio); // Limit pixel ratio on mobile
    container.appendChild(renderer.domElement);
    
    // Create particles - reduce count on mobile
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = isMobile ? 800 : 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Set random positions and colors for particles
    for (let i = 0; i < particlesCount * 3; i++) {
        // Positions (x, y, z)
        posArray[i] = (Math.random() - 0.5) * 10;
        
        // Colors (r, g, b)
        if (i % 3 === 0) { // Red component
            colorsArray[i] = 0.4 + Math.random() * 0.2; // Primary color (purple-ish)
        } else if (i % 3 === 1) { // Green component
            colorsArray[i] = 0.2 + Math.random() * 0.2;
        } else { // Blue component
            colorsArray[i] = 0.8 + Math.random() * 0.2;
        }
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Material for particles - adjust size and opacity for mobile
    const particlesMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.03 : 0.02, // Slightly larger on mobile for visibility
        vertexColors: true,
        transparent: true,
        opacity: isMobile ? 0.6 : 0.8, // Reduce opacity on mobile
        sizeAttenuation: true
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Mouse movement effect - use touch events for mobile
    let mouseX = 0;
    let mouseY = 0;
    
    if (isMobile) {
        // Touch events for mobile
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
            }
        }, { passive: true }); // Add passive flag for better scroll performance
    } else {
        // Mouse events for desktop
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Check if device became very small
        if (window.innerWidth <= 375) {
            container.style.display = 'none';
            if (renderer) renderer.dispose();
            return;
        } else if (window.innerWidth > 375 && container.style.display === 'none') {
            container.style.display = 'block';
        }
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop with performance optimization
    let frameCount = 0;
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Skip frames on mobile for better performance
        if (isMobile && frameCount % 2 !== 0) {
            frameCount++;
            return;
        }
        frameCount++;
        
        // Rotate particles slowly - slower on mobile
        particlesMesh.rotation.x += isMobile ? 0.0003 : 0.0005;
        particlesMesh.rotation.y += isMobile ? 0.0003 : 0.0005;
        
        // Move particles based on mouse position - less responsive on mobile for better performance
        particlesMesh.rotation.x += mouseY * (isMobile ? 0.0003 : 0.0005);
        particlesMesh.rotation.y += mouseX * (isMobile ? 0.0003 : 0.0005);
        
        // Render the scene
        renderer.render(scene, camera);
    };
    
    animate();
}

// Initialize navigation functionality
function initNavigation() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Get all required elements with null checks
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const sectionIndicator = document.getElementById('sectionIndicator');
    
    // Check if essential elements exist
    if (!sections || sections.length === 0) {
        console.warn('No sections found for navigation');
        return;
    }
    
    if (!hamburger || !navLinksContainer) {
        console.warn('Navigation menu elements not found');
        // Continue with other functionality even if menu is missing
    }
    
    // Create section indicator dots
    if (sectionIndicator) {
        sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            });
            
            sectionIndicator.appendChild(dot);
        });
    }
    
    // Toggle mobile menu - with null checks
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
        
        // Close mobile menu when a link is clicked - with touch support
        if (navLinks && navLinks.length > 0) {
            navLinks.forEach(link => {
                // Use both click and touchend events for better mobile support
                ['click', 'touchend'].forEach(eventType => {
                    link.addEventListener(eventType, (e) => {
                        if (eventType === 'touchend') {
                            e.preventDefault(); // Prevent default touch behavior
                        }
                        hamburger.classList.remove('active');
                        navLinksContainer.classList.remove('active');
                    });
                });
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            // Check if menu is open and click is outside the menu and hamburger
            if (navLinksContainer.classList.contains('active') && 
                !navLinksContainer.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
        
        // Prevent menu from staying open on orientation change
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinksContainer.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks && anchorLinks.length > 0) {
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Close mobile menu if open
                    if (navLinksContainer && hamburger && navLinksContainer.classList.contains('active')) {
                        navLinksContainer.classList.remove('active');
                        hamburger.classList.remove('active');
                    }
                    
                    // Update active nav link
                    if (navLinks && navLinks.length > 0) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                        });
                        this.classList.add('active');
                    }
                    
                    // Scroll to the target section
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Add scroll effect to header with throttling for performance
    if (header) {
        const throttle = (func, delay) => {
            let lastCall = 0;
            return function(...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) {
                    return;
                }
                lastCall = now;
                return func(...args);
            };
        };
        
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Update active nav link based on scroll position
            updateActiveSection();
        };
        
        // Use throttled version of scroll handler for better performance
        // More aggressive throttling on mobile devices
        const throttledScrollHandler = throttle(handleScroll, isMobile ? 200 : 100);
        window.addEventListener('scroll', throttledScrollHandler);
    }
    
    // Update active section based on scroll position
    function updateActiveSection() {
        if (!sections || sections.length === 0) return;
        
        const scrollPosition = window.scrollY;
        const dots = document.querySelectorAll('.section-indicator .dot');
        
        // Find the current section in view
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                const sectionId = section.getAttribute('id');
                if (!sectionId) return;
                
                // Update active nav link
                if (navLinks && navLinks.length > 0) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
                
                // Update active dot in section indicator
                if (dots && dots.length > 0) {
                    dots.forEach((dot, i) => {
                        dot.classList.remove('active');
                        if (i === index) {
                            dot.classList.add('active');
                        }
                    });
                }
                
                // Update URL hash without scrolling
                try {
                    history.replaceState(null, null, `#${sectionId}`);
                } catch (error) {
                    console.warn('Could not update URL hash:', error);
                }
            }
        });
    }
    
    // Set initial active section based on URL hash or scroll position
    const setInitialActiveSection = () => {
        const hash = window.location.hash;
        if (hash && navLinks && navLinks.length > 0) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                // Scroll to the target section
                targetSection.scrollIntoView();
                
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === hash) {
                        link.classList.add('active');
                    }
                });
            }
        } else {
            // If no hash, set the first section as active
            updateActiveSection();
        }
    };
    
    setInitialActiveSection();
    window.addEventListener('hashchange', setInitialActiveSection);
}

// Initialize projects filter functionality
function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Check if filter buttons and project cards exist
    if (!filterBtns || filterBtns.length === 0) {
        console.warn('No filter buttons found for projects filter');
        return;
    }
    
    if (!projectCards || projectCards.length === 0) {
        console.warn('No project cards found for projects filter');
        return;
    }
    
    filterBtns.forEach(btn => {
        if (!btn) return;
        
        btn.addEventListener('click', () => {
            try {
                // Remove active class from all buttons
                filterBtns.forEach(btn => {
                    if (btn) btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get filter value
                const filterValue = btn.getAttribute('data-filter');
                if (filterValue === null) return;
                
                // Filter projects
                projectCards.forEach(card => {
                    if (!card) return;
                    
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            } catch (error) {
                console.error('Error filtering projects:', error);
            }
        });
    });
}

// Initialize contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('Contact form not found in the document');
        return;
    }
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // Here you would typically send the form data to a server
        // For demonstration purposes, we'll just log it and show a success message
        console.log('Form submitted:', formDataObj);
        
        try {
            // Store the original form HTML
            const originalFormHTML = contactForm.innerHTML;
            
            // Show success message (in a real application, you'd do this after successful submission)
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <p>Your message has been sent successfully!</p>
            `;
            
            // Replace form with success message
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
            
            // Reset form after 5 seconds (for demo purposes)
            setTimeout(() => {
                // Restore the original form
                contactForm.innerHTML = originalFormHTML;
                // Clear the input values
                const inputs = contactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => input.value = '');
            }, 5000);
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    });
}

// Parallax effect for various elements
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    const backgroundSections = document.querySelectorAll('.bg-parallax');
    
    // Check if parallax elements exist
    if ((!parallaxElements || parallaxElements.length === 0) && 
        (!backgroundSections || backgroundSections.length === 0)) {
        console.warn('No parallax elements found');
        return;
    }
    
    window.addEventListener('scroll', throttle(function() {
        try {
            const scrollY = window.scrollY;
            
            // Parallax for elements with .parallax class
            if (parallaxElements && parallaxElements.length > 0) {
                parallaxElements.forEach(element => {
                    if (!element) return;
                    
                    const speed = element.getAttribute('data-speed') || 0.1;
                    const yPos = -(scrollY * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
            }
            
            // Parallax for background sections
            if (backgroundSections && backgroundSections.length > 0) {
                backgroundSections.forEach(section => {
                    if (!section) return;
                    
                    const speed = section.getAttribute('data-speed') || 0.05;
                    const yPos = -(scrollY * speed);
                    section.style.backgroundPosition = `center ${yPos}px`;
                });
            }
        } catch (error) {
            console.error('Error in parallax effect:', error);
        }
    }, isMobile ? 100 : 10));
}

// Add scroll reveal animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    
    // Check if reveal elements exist
    if (!revealElements || revealElements.length === 0) {
        console.warn('No reveal elements found');
        return;
    }
    
    function revealOnScroll() {
        try {
            revealElements.forEach(element => {
                if (!element || !document.body.contains(element)) return;
                
                const elementTop = element.getBoundingClientRect().top;
                const elementBottom = element.getBoundingClientRect().bottom;
                const elementVisible = 100;
                
                // Check if element is in viewport
                if (elementTop < window.innerHeight - elementVisible && elementBottom > 0) {
                    element.classList.add('active');
                } else if (elementBottom < 0 || elementTop > window.innerHeight) {
                    // Optional: remove the active class when element is out of viewport
                    // Uncomment the next line if you want elements to animate again when scrolling back up
                    // element.classList.remove('active');
                }
            });
        } catch (error) {
            console.error('Error in reveal animation:', error);
        }
    }
    
    // Use throttled version of the reveal function
    const throttledReveal = throttle(revealOnScroll, isMobile ? 200 : 100);
    window.addEventListener('scroll', throttledReveal, { passive: true });
    
    // Initial check on page load
    setTimeout(revealOnScroll, 100); // Small delay to ensure DOM is fully ready
}

// Initialize keyboard navigation for sections
function initScrollIndicator() {
    // Remove any existing scroll indicators
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    if (scrollIndicators && scrollIndicators.length > 0) {
        scrollIndicators.forEach(indicator => {
            if (indicator) indicator.remove();
        });
    }
    
    // Check if sections exist before adding keyboard navigation
    const sections = document.querySelectorAll('.section');
    if (!sections || sections.length === 0) {
        console.warn('No sections found for scroll indicator');
        return;
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const currentSectionIndex = getCurrentSectionIndex();
        
        // Arrow Down or Page Down
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSectionIndex < sections.length - 1) {
                sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Arrow Up or Page Up
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (currentSectionIndex > 0) {
                sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Helper function to get current section index
    function getCurrentSectionIndex() {
        const scrollPosition = window.scrollY;
        
        for (let i = 0; i < sections.length; i++) {
            const sectionTop = sections[i].offsetTop;
            const sectionHeight = sections[i].offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                return i;
            }
        }
        
        return 0; // Default to first section
    }
}

// Initialize scroll progress indicator with performance optimization
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    if (!scrollProgress) {
        console.warn('Scroll progress element not found');
        return;
    }
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Throttle function to limit how often a function can run
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }
    
    // Update scroll progress function
    function updateScrollProgress() {
        try {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            
            // Avoid division by zero
            if (scrollHeight <= 0) return;
            
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            // Use requestAnimationFrame for smoother updates
            requestAnimationFrame(() => {
                if (scrollProgress) { // Double-check element still exists
                    scrollProgress.style.width = scrollPercent + '%';
                }
            });
        } catch (error) {
            console.error('Error updating scroll progress:', error);
        }
    }
    
    // Use throttled version with different delay based on device
    const throttledUpdateProgress = throttle(updateScrollProgress, isMobile ? 100 : 10);
    const scrollListener = window.addEventListener('scroll', throttledUpdateProgress, { passive: true });
    
    // Initial update
    updateScrollProgress();
}
