// Get references to the image and button elements
const challengeImage = document.getElementById('challengeImage');
const revealButton = document.getElementById('revealButton');

// Function to check if the correct image is linked
function checkImage() {
    // Only activate if they linked the specific correct nested path
    if (challengeImage.src.endsWith('images/animals/mammels/land/rat.png')) {
        revealButton.disabled = false;
        console.log('✅ Correct! images/animals/mammels/land/rat.png found and linked properly. Button activated.');
    } else {
        revealButton.disabled = true;
        console.log('❌ Wrong image. You need to find and link images/animals/mammels/land/rat.png');
    }
}

// When the image loads successfully, check if it's the CORRECT image
challengeImage.onload = function() {
    checkImage();
};

// When the image fails to load, keep the button disabled
challengeImage.onerror = function() {
    revealButton.disabled = true;
    console.log('⚠️ Image not found. Check your file path and make sure the file exists.');
};

// Check immediately when script loads (in case image is already loaded/cached)
if (challengeImage.complete && challengeImage.naturalWidth !== 0) {
    checkImage();
}

// Add click event to the button (for when it becomes active)
revealButton.addEventListener('click', function() {
    // Password is stored encoded using Base64
    const encoded = "U01BUlQtUkFU";
    const password = atob(encoded); // Decode from Base64

    // Show password with animation
    const passwordDisplay = document.getElementById('passwordDisplay');
    const passwordValue = document.getElementById('passwordValue');

    passwordValue.textContent = password;
    passwordDisplay.classList.add('show');

    // Disable and update button
    revealButton.disabled = true;
    revealButton.textContent = '✅ Password Revealed';

    console.log('🎉 Password revealed: ' + password);
});
