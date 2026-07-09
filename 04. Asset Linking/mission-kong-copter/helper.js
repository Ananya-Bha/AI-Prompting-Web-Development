// Get references to all three image elements and button
const animalImage = document.getElementById('animalImage');
const hatImage = document.getElementById('hatImage');
const animalInHatImage = document.getElementById('animalInHatImage');
const revealButton = document.getElementById('revealButton');

// Function to check if ALL THREE images are correctly linked
function checkAllImages() {
    // Check each image path
    const animalCorrect = animalImage.src.endsWith('images/animal/monkey.png');
    const hatCorrect = hatImage.src.endsWith('images/hat/propeller-cap.png');
    const comboCorrect = animalInHatImage.src.endsWith('images/hat-on-animal/monkey-propeller-cap.png');

    // Only activate button if ALL THREE are correct
    if (animalCorrect && hatCorrect && comboCorrect) {
        revealButton.disabled = false;
        console.log('✅ All three images correct! Button activated.');
        console.log('   Animal: images/animal/monkey.png ✓');
        console.log('   Hat: images/hat/propeller-cap.png ✓');
        console.log('   Combination: images/hat-on-animal/monkey-propeller-cap.png ✓');
    } else {
        revealButton.disabled = true;
        console.log('❌ Need all 3 images correct:');
        console.log('   Animal: ' + (animalCorrect ? '✓' : '✗') + ' (need images/animal/monkey.png)');
        console.log('   Hat: ' + (hatCorrect ? '✓' : '✗') + ' (need images/hat/propeller-cap.png)');
        console.log('   Combination: ' + (comboCorrect ? '✓' : '✗') + ' (need images/hat-on-animal/monkey-propeller-cap.png)');
    }
}

// Set up event listeners for all three images
animalImage.onload = function() {
    checkAllImages();
};

hatImage.onload = function() {
    checkAllImages();
};

animalInHatImage.onload = function() {
    checkAllImages();
};

// Handle errors for all three images
animalImage.onerror = function() {
    revealButton.disabled = true;
    console.log('⚠️ Animal image not found. Check your file path.');
};

hatImage.onerror = function() {
    revealButton.disabled = true;
    console.log('⚠️ Hat image not found. Check your file path.');
};

animalInHatImage.onerror = function() {
    revealButton.disabled = true;
    console.log('⚠️ Animal-in-hat image not found. Check your file path.');
};

// Check immediately when script loads (in case images are already loaded/cached)
if (animalImage.complete && animalImage.naturalWidth !== 0 &&
    hatImage.complete && hatImage.naturalWidth !== 0 &&
    animalInHatImage.complete && animalInHatImage.naturalWidth !== 0) {
    checkAllImages();
}

// Add click event to reveal button
revealButton.addEventListener('click', function() {
    // Password is stored encoded using Base64
    const encoded = "RkxZSU5HLUtPTkc=";
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
