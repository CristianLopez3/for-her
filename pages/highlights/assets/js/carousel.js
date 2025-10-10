// Carousel functionality with auto-advance, progress bars, and audio
document.addEventListener('DOMContentLoaded', async function () {
    const progressBars = document.getElementById('progressBars');
    const storySlides = document.getElementById('storySlides');
    const backBtn = document.getElementById('backBtn');
    const navLeft = document.getElementById('navLeft');
    const navRight = document.getElementById('navRight');
    const audioPlayer = document.getElementById('storyAudio');
    
    let highlightsData = [];
    let currentHighlight = null;
    let currentSlideIndex = 0;
    let autoAdvanceTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let isPaused = false;
    
    // Get highlight index from URL
    const urlParams = new URLSearchParams(window.location.search);
    const highlightIndex = parseInt(urlParams.get('index') || '0');
    
    // Load highlights data
    try {
        const response = await fetch('./assets/data/highlightsData.json');
        highlightsData = await response.json();
        
        if (highlightIndex >= 0 && highlightIndex < highlightsData.length) {
            currentHighlight = highlightsData[highlightIndex];
            initializeCarousel();
        } else {
            showError('Highlight not found');
        }
    } catch (error) {
        console.error('Error loading highlights data:', error);
        showError('Failed to load highlight');
    }
    
    function initializeCarousel() {
        if (!currentHighlight || !currentHighlight.slides || currentHighlight.slides.length === 0) {
            showError('No slides available');
            return;
        }
        
        renderProgressBars();
        renderSlides();
        showSlide(0);
        setupEventListeners();
    }
    
    function renderProgressBars() {
        progressBars.innerHTML = '';
        currentHighlight.slides.forEach((slide, index) => {
            const bar = document.createElement('div');
            bar.className = 'story-progress-bar';
            bar.dataset.index = index;
            bar.innerHTML = '<div class="story-progress-fill"></div>';
            progressBars.appendChild(bar);
        });
    }
    
    function renderSlides() {
        storySlides.innerHTML = '';
        currentHighlight.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'story-slide';
            slideElement.dataset.index = index;
            
            slideElement.innerHTML = `
                <img src="${slide.image}" alt="Slide ${index + 1}" class="story-slide-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23191414%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%231db954%22%3EImage not found%3C/text%3E%3C/svg%3E'">
                <div class="story-slide-text">${slide.text}</div>
            `;
            
            storySlides.appendChild(slideElement);
        });
    }
    
    function showSlide(index) {
        // Clear any existing timer
        clearAutoAdvance();
        
        // Update current slide index
        currentSlideIndex = index;
        
        // Update slides visibility
        const slides = document.querySelectorAll('.story-slide');
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update progress bars
        const bars = document.querySelectorAll('.story-progress-bar');
        bars.forEach((bar, i) => {
            const fill = bar.querySelector('.story-progress-fill');
            if (i < index) {
                bar.classList.add('completed');
                bar.classList.remove('active');
                fill.style.width = '100%';
            } else if (i === index) {
                bar.classList.add('active');
                bar.classList.remove('completed');
                fill.style.width = '0%';
            } else {
                bar.classList.remove('active', 'completed');
                fill.style.width = '0%';
            }
        });
        
        // Play audio for current slide
        playAudio(index);
        
        // Start auto-advance timer if not paused
        if (!isPaused) {
            startAutoAdvance();
        }
    }
    
    function playAudio(index) {
        const slide = currentHighlight.slides[index];
        if (slide.audio) {
            audioPlayer.src = slide.audio;
            audioPlayer.currentTime = 0;
            audioPlayer.play().catch(error => {
            console.log('Audio playback failed:', error);
            });

            // Wait 30 seconds before auto-advancing, regardless of audio length
            clearAutoAdvance();
            autoAdvanceTimer = setTimeout(() => {
            nextSlide();
            }, 30000);
        } else {
            audioPlayer.pause();
            audioPlayer.src = '';

            // Wait 30 seconds before auto-advancing
            clearAutoAdvance();
            autoAdvanceTimer = setTimeout(() => {
            nextSlide();
            }, 30000);
        }
    }
    
    function startAutoAdvance() {
        autoAdvanceTimer = setTimeout(() => {
            nextSlide();
        }, 30000); // 30 seconds per slide
    }
    
    function clearAutoAdvance() {
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }
    
    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % currentHighlight.slides.length;
        showSlide(nextIndex);
    }
    
    function previousSlide() {
        const prevIndex = (currentSlideIndex - 1 + currentHighlight.slides.length) % currentHighlight.slides.length;
        showSlide(prevIndex);
    }
    
    function setupEventListeners() {
        // Back button
        backBtn.addEventListener('click', () => {
            clearAutoAdvance();
            audioPlayer.pause();
            window.location.href = '../../../../index.html';
        });
        
        // Navigation areas
        navLeft.addEventListener('click', () => {
            previousSlide();
        });
        
        navRight.addEventListener('click', () => {
            nextSlide();
        });
        
        // Touch/swipe support
        storySlides.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isPaused = true;
            clearAutoAdvance();
        });
        
        storySlides.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            isPaused = false;
            startAutoAdvance();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'Escape') {
                clearAutoAdvance();
                audioPlayer.pause();
                window.location.href = './index.html';
            }
        });
        
        // Pause on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isPaused = true;
                clearAutoAdvance();
                audioPlayer.pause();
            } else {
                isPaused = false;
                startAutoAdvance();
                if (currentHighlight.slides[currentSlideIndex].audio) {
                    audioPlayer.play().catch(() => {});
                }
            }
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next slide
                nextSlide();
            } else {
                // Swiped right - previous slide
                previousSlide();
            }
        }
    }
    
    function showError(message) {
        storySlides.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; padding: 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #1db954; margin-bottom: 20px;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">${message}</p>
                <a href="./index.html" style="color: #1db954; text-decoration: underline; margin-top: 20px;">Return to Highlights</a>
            </div>
        `;
    }
});
