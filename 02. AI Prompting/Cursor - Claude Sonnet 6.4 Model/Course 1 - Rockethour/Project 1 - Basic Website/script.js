// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get the CTA button element
    var ctaButton = document.getElementById('ctaButton');

    // Add a click event listener to the button
    ctaButton.addEventListener('click', function() {
        // Show an alert message when the button is clicked
        alert('Hello, World!You have clicked the button!');
    });
});