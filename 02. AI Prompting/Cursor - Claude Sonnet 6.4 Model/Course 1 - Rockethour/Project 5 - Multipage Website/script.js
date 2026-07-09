// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the form, hint button, and hint text elements
    const riddleForm = document.getElementById('riddleForm');
    const hintButton = document.getElementById('hintButton');
    const hintText = document.getElementById('hintText');

    // Add event listener for form submission
    if (riddleForm) {
        riddleForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the form from submitting normally
            
            // Get the user's answer
            const answer = document.getElementById('answer').value.toLowerCase().trim();
            
            // Check the answer based on the current page
            let correct = false;
            if (window.location.pathname.includes('page1.html') && answer === 'echo') {
                correct = true;
            } else if (window.location.pathname.includes('page2.html') && answer === 'map') {
                correct = true;
            } else if (window.location.pathname.includes('page3.html') && answer === 'fire') {
                correct = true;
            }

            // Redirect to the next page or show an error message
            if (correct) {
                const nextPage = window.location.pathname.includes('page1.html') ? 'page2.html' :
                                 window.location.pathname.includes('page2.html') ? 'page3.html' : 'page4.html';
                window.location.href = nextPage;
            } else {
                alert('Arr! That be incorrect, ye scurvy dog! Try again!');
            }
        });
    }

    // Add event listener for the hint button
    if (hintButton && hintText) {
        hintButton.addEventListener('click', function() {
            hintText.classList.toggle('hidden');
        });
    }
});