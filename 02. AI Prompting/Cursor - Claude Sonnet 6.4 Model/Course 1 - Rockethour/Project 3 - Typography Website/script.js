// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    // Get references to important elements
    const fontFamilySelector = document.getElementById('fontFamilySelector');
    const fontCards = document.getElementById('fontCards');
    const modal = document.getElementById('fontModal');
    const modalFontName = document.getElementById('modalFontName');
    const modalFontSample = document.getElementById('modalFontSample');
    const modalFontReview = document.getElementById('modalFontReview');
    const closeModal = document.querySelector('.close');

    // List of system fonts for each font family
    const fontFamilies = {
        serif: ['Georgia', 'Times New Roman', 'Palatino', 'Garamond', 'Bookman'],
        'sans-serif': ['Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Calibri'],
        monospace: ['Courier', 'Courier New', 'Lucida Console', 'Monaco', 'Consolas'],
        cursive: ['Comic Sans MS', 'Brush Script MT', 'Lucida Handwriting', 'Segoe Script'],
        fantasy: ['Impact', 'Papyrus', 'Copperplate', 'Luminari', 'Chalkduster']
    };

    // Function to generate font cards
    function generateFontCards(fontFamily) {
        fontCards.innerHTML = ''; // Clear existing cards

        fontFamilies[fontFamily].forEach(font => {
            const card = document.createElement('div');
            card.className = 'font-card';
            card.style.fontFamily = font;
            card.textContent = font;
            card.addEventListener('click', () => showModal(font));
            fontCards.appendChild(card);
        });
    }

    // Function to show the modal with font details
    function showModal(font) {
        modalFontName.textContent = font;
        modalFontSample.style.fontFamily = font;
        modalFontReview.textContent = generateFontReview(font);
        modal.style.display = 'block';
    }

    // Function to generate a unique 'opinionated' review for each font
    function generateFontReview(font) {
        const reviews = {
            'Georgia': "A classic serif with a modern twist. Georgia's readability on screens makes it a typographer's darling.",
            'Times New Roman': "The grandfather of digital fonts. Some call it boring, but its timeless elegance is undeniable.",
            'Arial': "The Swiss Army knife of sans-serifs. It's everywhere for a reason: clean, neutral, and always dependable.",
            'Helvetica': "The king of sans-serifs. Its perfect balance of form and function has made it a designer's go-to for decades.",
            'Courier': "The typewriter font that refuses to die. Its monospaced charm brings a touch of nostalgia to the digital age.",
            'Comic Sans MS': "The font everyone loves to hate. But let's be honest, its playful nature can brighten up any kindergarten newsletter.",
            'Impact': "Bold, brash, and impossible to ignore. It's the font equivalent of shouting, but sometimes that's exactly what you need."
        };

        return reviews[font] || "A font with character, waiting to make its mark on your next project.";
    }

    // Event listener for font family selection
    fontFamilySelector.addEventListener('change', (e) => {
        generateFontCards(e.target.value);
    });

    // Event listener to close the modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal if clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Generate initial font cards for the default selection (serif)
    generateFontCards('serif');
});