/* ============================================
   ECOBYTES - JAVASCRIPT
   ============================================
   This file adds interactivity to the website.
   Main feature: Smooth scrolling when clicking navigation links.
*/

/* ============================================
   SMOOTH SCROLLING NAVIGATION
   ============================================ */

// This code runs when the page finishes loading
document.addEventListener('DOMContentLoaded', function() {
    // DOMContentLoaded means "when the HTML is fully loaded"
    
    // Get all navigation links
    // querySelectorAll finds all elements that match the selector
    const navLinks = document.querySelectorAll('.nav-link, .footer-link');
    
    // Loop through each navigation link
    // forEach is like saying "for each link, do something"
    navLinks.forEach(function(link) {
        // Add a click event listener to each link
        // When someone clicks the link, this function runs
        link.addEventListener('click', function(event) {
            // event.preventDefault() stops the default behavior
            // (which would be jumping instantly to the section)
            event.preventDefault();
            
            // Get the target section ID from the link's href
            // For example, if href="#about", targetId = "about"
            const targetId = this.getAttribute('href');
            
            // If the link points to a section on this page (starts with #)
            if (targetId.startsWith('#')) {
                // Find the target section element
                const targetSection = document.querySelector(targetId);
                
                // If the section exists, scroll to it smoothly
                if (targetSection) {
                    // scrollIntoView scrolls the page to show the element
                    // behavior: 'smooth' makes it animate instead of jumping
                    // block: 'start' aligns the section to the top of the viewport
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // If it doesn't start with #, it's an external link (like mailto:)
            // In that case, let the browser handle it normally
        });
    });
});

/* ============================================
   HEADER SCROLL EFFECT (OPTIONAL ENHANCEMENT)
   ============================================ */

// This makes the header slightly more transparent when you scroll down
// and more opaque when you're at the top

// Listen for scroll events (when the user scrolls the page)
window.addEventListener('scroll', function() {
    // Get the header element
    const header = document.querySelector('.header');
    
    // Check how far down the page has been scrolled
    // window.scrollY gives the number of pixels scrolled from the top
    if (window.scrollY > 50) {
        // If scrolled more than 50 pixels, make header more solid
        header.style.background = 'rgba(10, 14, 39, 0.95)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
    } else {
        // If near the top, make it less transparent
        header.style.background = 'rgba(10, 14, 39, 0.85)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    }
    
    // Update active navigation link based on scroll position
    updateActiveNavLink();
});

/* ============================================
   ACTIVE NAVIGATION LINK HIGHLIGHTING
   ============================================ */

// This function highlights which section you're currently viewing
function updateActiveNavLink() {
    // Get all sections on the page
    const sections = document.querySelectorAll('section[id]');
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Find which section is currently in view
    let currentSection = '';
    
    // Loop through each section to see which one is visible
    sections.forEach(function(section) {
        // getBoundingClientRect() gives us the position of the section
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        // If the section is in the viewport (visible on screen)
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Remove active class from all nav links
    navLinks.forEach(function(link) {
        link.classList.remove('active');
    });
    
    // Add active class to the current section's nav link
    if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

/* ============================================
   SCROLL ANIMATIONS FOR ELEMENTS
   ============================================ */

// This makes elements fade in as you scroll to them
function initScrollAnimations() {
    // Get all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .explanation-box, .stats-box, .goals-box');
    
    // Create an Intersection Observer
    // This watches when elements enter the viewport (become visible)
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            // If the element is visible
            if (entry.isIntersecting) {
                // Add a class that triggers the animation
                entry.target.classList.add('animate-in');
                // Stop observing this element once it's animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Trigger animation when element is 20% visible
        threshold: 0.2
    });
    
    // Start observing each animated element
    animatedElements.forEach(function(element) {
        // Initially make elements slightly transparent
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        // Start watching this element
        observer.observe(element);
    });
}

// Run scroll animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initInteractiveGraph();
});

/* ============================================
   INTERACTIVE CARBON FOOTPRINT GRAPH
   ============================================ */

// Helper function to calculate pie slice path
function createPieSlice(cx, cy, radius, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function initInteractiveGraph() {
    // Calculate and update pie slice paths
    const total = 2286; // Total CO₂ emissions
    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    
    // Calculate angles for each device
    let currentAngle = 0;
    
    // Smartphone: 58kg
    const smartphoneAngle = (58 / total) * 360;
    const smartphoneSlice = document.querySelector('.pie-slice[data-device="Smartphone"]');
    if (smartphoneSlice) {
        smartphoneSlice.setAttribute('d', createPieSlice(centerX, centerY, radius, currentAngle, currentAngle + smartphoneAngle));
        currentAngle += smartphoneAngle;
    }
    
    // Tablet: 96kg
    const tabletAngle = (96 / total) * 360;
    const tabletSlice = document.querySelector('.pie-slice[data-device="Tablet"]');
    if (tabletSlice) {
        tabletSlice.setAttribute('d', createPieSlice(centerX, centerY, radius, currentAngle, currentAngle + tabletAngle));
        currentAngle += tabletAngle;
    }
    
    // Laptop: 287kg
    const laptopAngle = (287 / total) * 360;
    const laptopSlice = document.querySelector('.pie-slice[data-device="Laptop"]');
    if (laptopSlice) {
        laptopSlice.setAttribute('d', createPieSlice(centerX, centerY, radius, currentAngle, currentAngle + laptopAngle));
        currentAngle += laptopAngle;
    }
    
    // TV: 897kg
    const tvAngle = (897 / total) * 360;
    const tvSlice = document.querySelector('.pie-slice[data-device="TV"]');
    if (tvSlice) {
        tvSlice.setAttribute('d', createPieSlice(centerX, centerY, radius, currentAngle, currentAngle + tvAngle));
        currentAngle += tvAngle;
    }
    
    // Desktop: 948kg
    const desktopAngle = (948 / total) * 360;
    const desktopSlice = document.querySelector('.pie-slice[data-device="Desktop"]');
    if (desktopSlice) {
        desktopSlice.setAttribute('d', createPieSlice(centerX, centerY, radius, currentAngle, currentAngle + desktopAngle));
    }
    
    // Handle pie slice interactions
    const pieSlices = document.querySelectorAll('.pie-slice');
    
    pieSlices.forEach(function(slice) {
        slice.addEventListener('mouseenter', function() {
            const device = this.getAttribute('data-device');
            const total = this.getAttribute('data-total');
            const production = this.getAttribute('data-production');
            const use = this.getAttribute('data-use');
            const lifetime = this.getAttribute('data-lifetime');
            const percentage = this.getAttribute('data-percentage');
            
            // Create tooltip with readable format
            let tooltip = document.createElement('div');
            tooltip.className = 'graph-tooltip';
            tooltip.innerHTML = `
                <strong>${device}</strong>
                <span class="tooltip-total">Total: ${total} kg CO₂</span>
                <span class="tooltip-percentage">${percentage}% of total</span>
                <span class="tooltip-phase">Production: ${production} kg</span>
                <span class="tooltip-phase">Use: ${use} kg</span>
                <span class="tooltip-lifetime">Lifetime: ${lifetime} years</span>
            `;
            document.body.appendChild(tooltip);
            
            // Position tooltip
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            let top = rect.top + scrollTop + (rect.height / 2) - tooltipRect.height / 2;
            let left = rect.right + scrollLeft + 15;
            
            // Adjust if tooltip goes off screen
            if (left + tooltipRect.width > scrollLeft + window.innerWidth) {
                left = rect.left + scrollLeft - tooltipRect.width - 15;
            }
            
            tooltip.style.position = 'absolute';
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        });
        
        slice.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.graph-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
        
        slice.addEventListener('click', function() {
            const device = this.getAttribute('data-device');
            const production = this.getAttribute('data-production');
            const use = this.getAttribute('data-use');
            const lifetime = this.getAttribute('data-lifetime');
            const total = this.getAttribute('data-total');
            const percentage = this.getAttribute('data-percentage');
            
            alert(`${device} Carbon Footprint:\n\n` +
                  `Total: ${total} kg CO₂ (${percentage}%)\n` +
                  `Production Phase: ${production} kg CO₂\n` +
                  `Use Phase: ${use} kg CO₂\n` +
                  `Average Lifetime: ${lifetime} years`);
        });
    });
    
    // Handle legend item interactions
    const legendItems = document.querySelectorAll('.legend-item-pie');
    
    legendItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const device = this.getAttribute('data-device');
            // Find corresponding pie slice and trigger its click
            const slice = document.querySelector(`.pie-slice[data-device="${device}"]`);
            if (slice) {
                slice.dispatchEvent(new MouseEvent('click'));
            }
        });
    });
}

/* ============================================
   EXPLANATION OF KEY CONCEPTS
   ============================================

   1. document.addEventListener('DOMContentLoaded', ...)
      - Waits for the HTML to fully load before running code
      - This prevents errors if JavaScript tries to find elements before they exist

   2. querySelectorAll('.nav-link')
      - Finds all elements with the class "nav-link"
      - Returns a list (array) of all matching elements

   3. forEach(function(link) { ... })
      - Loops through each item in the list
      - For each navigation link, it adds a click listener

   4. event.preventDefault()
      - Stops the browser's default action
      - Without this, clicking a link would instantly jump to the section
      - We want smooth scrolling instead

   5. scrollIntoView({ behavior: 'smooth' })
      - Scrolls the page to show a specific element
      - 'smooth' makes it animate instead of jumping instantly

   6. window.addEventListener('scroll', ...)
      - Listens for when the user scrolls the page
      - Runs the function every time the scroll position changes

   ============================================ */

