const photoData = [
    { src: 'images/photo2.jpg', title: 'Radiant Portrait' },
    { src: 'images/photo3.jpg', title: 'Golden Moment' },
    { src: 'images/photo4.jpg', title: 'Joyful Day' },
    { src: 'images/photo5.jpg', title: 'Warm Smile' },
    { src: 'images/photo6.jpg', title: 'Soft Glow' },
    { src: 'images/photo7.jpg', title: 'Time Together' },
    { src: 'images/photo8.jpg', title: 'Happy Memories' }
];

const slider = document.getElementById('slider');
const sliderDots = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');
const surpriseButton = document.getElementById('surpriseButton');
const surpriseModal = document.getElementById('surpriseModal');
const closeModal = document.getElementById('closeModal');
const closeModalBottom = document.getElementById('closeModalBottom');
const letterText = document.getElementById('letterText');

let currentIndex = 0;
let slideInterval;

function createSlider() {
    photoData.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (index === currentIndex) slide.classList.add('active');
        slide.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}" />
            <h3>${photo.title}</h3>
        `;
        slide.addEventListener('click', () => openLightbox(photo));
        slider.appendChild(slide);

        const dot = document.createElement('button');
        dot.addEventListener('click', () => goToSlide(index));
        if (index === currentIndex) dot.classList.add('active');
        sliderDots.appendChild(dot);
    });
}

function updateSlider() {
    const slides = slider.querySelectorAll('.slide');
    const dots = sliderDots.querySelectorAll('button');
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

    const activeSlide = slides[currentIndex];
    if (activeSlide) {
        const slideCenter = activeSlide.offsetLeft + activeSlide.offsetWidth / 2;
        const targetScroll = slideCenter - slider.offsetWidth / 2;
        slider.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % photoData.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + photoData.length) % photoData.length;
    updateSlider();
}

function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetInterval();
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
}

function openLightbox(photo) {
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.title;
    lightboxCaption.textContent = photo.title;
    lightbox.classList.add('active');
}

function closeLightboxPanel() {
    lightbox.classList.remove('active');
}

function openSurprise() {
    surpriseModal.classList.add('active');
    createConfetti();
    const song = document.getElementById('birthdaySong');
    if (song) {
        song.currentTime = 0;
        song.play().catch(() => {
            // autoplay may be blocked; user can still press play manually.
        });
    }
}

function closeSurprise() {
    surpriseModal.classList.remove('active');
}

function createConfetti() {
    const colors = ['#f1c572', '#f4a3ca', '#ffffff', '#ffd27f'];
    for (let i = 0; i < 70; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        const size = Math.floor(Math.random() * 10) + 8;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * 0.4}px`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = `${Math.random() * 0.6}s`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4500);
    }
}

function revealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal-card');
    const windowHeight = window.innerHeight;
    revealElements.forEach((element) => {
        const top = element.getBoundingClientRect().top;
        if (top < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

function setupLetterAnimation() {
    const lines = [
        'Dear Amrutha,',
        'Your presence brings light to every moment.',
        'Your kindness turns ordinary days into extraordinary memories.',
        'On this special birthday, may you feel treasured, celebrated, and loved.',
        'Wishing you endless joy, warmth, and beautiful new adventures.',
        'Happy Birthday to the wonderful person you are.'
    ];

    lines.forEach((text, index) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        letterText.appendChild(paragraph);
        setTimeout(() => paragraph.classList.add('visible'), 1200 * (index + 1));
    });
}

function createVisibleObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.22 });

    document.querySelectorAll('.reveal-card').forEach((card) => observer.observe(card));
}

function resetHashAndScrollTop() {
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
}

function init() {
    resetHashAndScrollTop();
    createSlider();
    slideInterval = setInterval(nextSlide, 3000);
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    closeLightbox.addEventListener('click', closeLightboxPanel);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightboxPanel();
    });
    surpriseButton.addEventListener('click', openSurprise);
    closeModal.addEventListener('click', closeSurprise);
    closeModalBottom.addEventListener('click', closeSurprise);
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightboxPanel();
            closeSurprise();
        }
    });
    setupLetterAnimation();
    createVisibleObserver();
    revealOnScroll();
}

window.addEventListener('DOMContentLoaded', init);