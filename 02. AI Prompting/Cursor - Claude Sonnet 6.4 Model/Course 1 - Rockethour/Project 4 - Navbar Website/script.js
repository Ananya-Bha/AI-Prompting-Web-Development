// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to important elements
    const heroTitle = document.getElementById('hero-title');
    const heroText = document.getElementById('hero-text');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const matrixBg = document.querySelector('.matrix-bg');

    // Function to update hero content based on the clicked navigation item
    function updateHeroContent(section) {
        switch (section) {
            case 'home':
                heroTitle.textContent = 'Welcome to the Matrix';
                heroText.textContent = 'Explore different navigation styles in this demo.';
                break;
            case 'about':
                heroTitle.textContent = 'About the Matrix';
                heroText.textContent = 'Discover the truth about your reality.';
                break;
            case 'contact':
                heroTitle.textContent = 'Contact Us';
                heroText.textContent = 'Join the resistance. Unplug from the Matrix.';
                break;
        }
    }

    // Add click event listeners to all navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const section = link.getAttribute('data-section');
            updateHeroContent(section);
        });
    });

    // Toggle hamburger menu when clicking the icon
    hamburgerIcon.addEventListener('click', () => {
        hamburgerMenu.style.display = hamburgerMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Create matrix rain effect
    function createMatrixRain() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        matrixBg.appendChild(canvas);

        canvas.width = matrixBg.offsetWidth;
        canvas.height = matrixBg.offsetHeight;

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff00';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 33);
    }

    // Initialize matrix rain effect
    createMatrixRain();
});