// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Function to scroll to the contact section when the CTA button is clicked
    function scrollToContact() {
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Add click event listener to the CTA button
    const ctaButton = document.getElementById('ctaButton');
    ctaButton.addEventListener('click', scrollToContact);

    // Array of project data
    const projects = [
        { title: 'Project 1', description: 'A brief description of Project 1' },
        { title: 'Project 2', description: 'A brief description of Project 2' },
        { title: 'Project 3', description: 'A brief description of Project 3' },
        { title: 'Project 4', description: 'A brief description of Project 4' },
        { title: 'Project 5', description: 'A brief description of Project 5' },
        { title: 'Project 6', description: 'A brief description of Project 6' },
        { title: 'Project 7', description: 'A brief description of Project 7' },
        { title: 'Project 8', description: 'A brief description of Project 8' }
    ];

    // Function to generate a random color
    function getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 60%)`;
    }

    // Function to generate an SVG with random shapes
    function generateSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 100 100');

        const shapes = ['circle', 'rect', 'polygon'];
        for (let i = 0; i < 5; i++) {
            const shape = document.createElementNS('http://www.w3.org/2000/svg', shapes[Math.floor(Math.random() * shapes.length)]);
            shape.setAttribute('fill', getRandomColor());

            switch (shape.tagName) {
                case 'circle':
                    shape.setAttribute('cx', Math.random() * 100);
                    shape.setAttribute('cy', Math.random() * 100);
                    shape.setAttribute('r', Math.random() * 20 + 5);
                    break;
                case 'rect':
                    shape.setAttribute('x', Math.random() * 80);
                    shape.setAttribute('y', Math.random() * 80);
                    shape.setAttribute('width', Math.random() * 30 + 10);
                    shape.setAttribute('height', Math.random() * 30 + 10);
                    break;
                case 'polygon':
                    const points = [];
                    for (let j = 0; j < 3; j++) {
                        points.push(`${Math.random() * 100},${Math.random() * 100}`);
                    }
                    shape.setAttribute('points', points.join(' '));
                    break;
            }

            svg.appendChild(shape);
        }

        return svg;
    }

    // Function to create project cards
    function createProjectCards() {
        const projectGrid = document.querySelector('.project-grid');

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const title = document.createElement('h3');
            title.textContent = project.title;

            const description = document.createElement('p');
            description.textContent = project.description;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'project-image';
            imageContainer.appendChild(generateSVG());

            card.appendChild(imageContainer);
            card.appendChild(title);
            card.appendChild(description);

            projectGrid.appendChild(card);
        });
    }

    // Call the function to create project cards
    createProjectCards();

    // Add submit event listener to the contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Form submitted! (This is a demo, so no actual submission occurs)');
        contactForm.reset();
    });
});