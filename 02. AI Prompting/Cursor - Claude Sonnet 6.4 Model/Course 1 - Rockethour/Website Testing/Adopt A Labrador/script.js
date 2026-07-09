document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === window.location.pathname.split('/').pop()) {
                e.preventDefault();
                // We're already on the current page, so just scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

    const adoptButton = document.querySelector('.adopt-button');
    if (adoptButton) {
        adoptButton.addEventListener('click', function() {
            alert('Thank you for your interest in adopting a Labrador! Please contact your local animal shelter or Labrador rescue organization to start the adoption process.');
        });
    }
});