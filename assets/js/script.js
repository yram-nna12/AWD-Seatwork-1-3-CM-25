const dots = document.querySelectorAll('.dot');
const scrollContainer = document.querySelector('.scroll-container');

// Set active dot and move to the corresponding image
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = dot.getAttribute('data-index');
        
        // Move the scroll container to the corresponding image
        scrollContainer.style.transform = `translateX(-${index * 100}vw)`;
        
        // Update the active dot
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
});

// Initially activate the first dot
dots[0].classList.add('active');

document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function prevSlide() {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        showSlide(currentIndex);
    }

    function nextSlide() {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        showSlide(currentIndex);
    }

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    showSlide(currentIndex);
});