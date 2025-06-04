// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the 3D background
    initThreeJS();
    
    // Initialize the navigation
    initNavigation();
    
    // Initialize the projects filter
    initProjectsFilter();
    
    // Initialize the contact form
    initContactForm();
    
    // Initialize scroll indicator
    initScrollIndicator();
    
    // Initialize scroll progress indicator
    initScrollProgress();
    
    // Hide loading screen after everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.querySelector('.loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.querySelector('.loading-screen').style.display = 'none';
            }, 500);
        }, 1500);
    });
});

// Initialize Three.js scene
function initThreeJS() {
    // Get the container element
    const container = document.getElementById('canvas-container');
    
    // Create a scene
    const scene = new THREE.Scene();
    
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
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
    
    // Material for particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotate particles slowly
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Move particles based on mouse position
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        // Render the scene
        renderer.render(scene, camera);
    };
    
    animate();
}

// Initialize navigation functionality
function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const sectionIndicator = document.getElementById('sectionIndicator');
    
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
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    hamburger.classList.remove('active');
                }
                
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveSection();
    });
    
    // Update active section based on scroll position
    function updateActiveSection() {
        const scrollPosition = window.scrollY;
        const dots = document.querySelectorAll('.section-indicator .dot');
        
        // Find the current section in view
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                const sectionId = section.getAttribute('id');
                
                // Update active nav link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update active dot in section indicator
                if (dots.length > 0) {
                    dots.forEach((dot, i) => {
                        dot.classList.remove('active');
                        if (i === index) {
                            dot.classList.add('active');
                        }
                    });
                }
                
                // Update URL hash without scrolling
                history.replaceState(null, null, `#${sectionId}`);
            }
        });
    }
    
    // Set initial active section based on URL hash or scroll position
    const setInitialActiveSection = () => {
        const hash = window.location.hash;
        if (hash) {
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
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filterValue = btn.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
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
        });
    });
}

// Initialize contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
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
        });
    }
}

// Add parallax effect to sections
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Parallax effect for different elements
    document.querySelectorAll('.parallax').forEach(element => {
        const speed = element.getAttribute('data-speed') || 0.1;
        element.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Parallax effect for background sections
    document.querySelectorAll('.parallax-bg').forEach(element => {
        const yPos = -(scrollY * 0.2);
        element.style.backgroundPosition = `50% ${yPos}px`;
    });
    
    // Add a subtle rotation to floating elements based on scroll
    document.querySelectorAll('.floating').forEach(element => {
        const rotateAmount = scrollY * 0.01;
        element.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 10}px) rotate(${rotateAmount}deg)`;
    });
});

// Add scroll reveal animations
function revealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate');
    
    revealElements.forEach(element => {
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
}

// Throttle function to limit how often the reveal function runs
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Use throttled version of the reveal function
const throttledReveal = throttle(revealOnScroll, 100);
window.addEventListener('scroll', throttledReveal);

// Initial check on page load
revealOnScroll();

// Initialize keyboard navigation for sections
function initScrollIndicator() {
    // Remove any existing scroll indicators
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    scrollIndicators.forEach(indicator => {
        indicator.remove();
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const sections = document.querySelectorAll('.section');
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
        const sections = document.querySelectorAll('.section');
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

// Initialize scroll progress indicator
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / windowHeight) * 100;
        
        scrollProgress.style.width = scrollPercentage + '%';
    });
}