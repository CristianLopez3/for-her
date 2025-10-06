// Love Anniversary Web App
// Pinterest-style gallery with love letters and interactive questions

// Love letters for each image
const loveLetters = [
    "I still remember our first smile together 💕",
    "You make every ordinary moment feel magical ✨",
    "Your laugh is my favorite melody 🎵",
    "With you, I've found my forever home 🏡",
    "Every day with you is a new adventure 🌟",
    "Your eyes hold all my favorite memories 👀",
    "You're my sunshine on cloudy days ☀️",
    "Together we create the most beautiful story 📖",
    "Your love makes me the best version of myself 💖",
    "In your arms, I've found my peace 🕊️",
    "You're the reason I believe in fairy tales 🧚‍♀️",
    "Our love grows stronger with every heartbeat 💓"
];

// Romantic questions for the interactive section
const romanticQuestions = [
    "What's your favorite memory of us? 💭",
    "What do you love most about our relationship? 💕",
    "What dream would you like us to fulfill together? ✨",
    "Which song reminds you of us? 🎵",
    "Where would you like to travel with me? 🌍",
    "What made you fall in love with me? 💘",
    "What would you like to tell me today? 💌",
    "How do you imagine our future together? 🌅"
];

class LoveAnniversaryApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.totalImages = 12;
        this.isPlaying = false;
        this.init();
    }

    init() {
        this.createGallery();
        this.setupMusicPlayer();
        this.setupModal();
        this.setupQuestionsCarousel();
        this.animateTitle();
    }

    // Create Pinterest-style masonry gallery
    createGallery() {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;

        // Check for different image extensions
        const imageExtensions = ['jpg', 'jpeg'];
        
        for (let i = 1; i <= this.totalImages; i++) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = i - 1;
            
            // Try different extensions for each image
            let imageSrc = `./assets/img/image${i}.jpg`;
            if (i === 1 || i === 3 || i === 4 || i === 5 || i === 6) {
                imageSrc = `./assets/img/image${i}.jpeg`;
            }
            
            item.innerHTML = `
                <img class="gallery-img" src="${imageSrc}" alt="Memory ${i}" onerror="this.src='./assets/img/image${i}.jpeg'">
                <div class="gallery-overlay">
                    <span>${loveLetters[i - 1] || "Our love story continues... 💕"}</span>
                </div>
            `;
            
            // Add staggered animation delay
            item.style.animationDelay = `${(i - 1) * 0.1}s`;
            
            gallery.appendChild(item);
        }
    }

    // Setup music player functionality
    setupMusicPlayer() {
        const musicBtn = document.getElementById('music-btn');
        const bgMusic = document.getElementById('bg-music');
        
        if (!musicBtn || !bgMusic) return;

        musicBtn.addEventListener('click', () => {
            if (this.isPlaying) {
                bgMusic.pause();
                this.isPlaying = false;
                musicBtn.classList.remove('playing');
                musicBtn.textContent = '🎶';
            } else {
                bgMusic.play().catch(e => {
                    console.log('Audio play failed:', e);
                });
                this.isPlaying = true;
                musicBtn.classList.add('playing');
                musicBtn.textContent = '🎵';
            }
        });

        bgMusic.addEventListener('ended', () => {
            this.isPlaying = false;
            musicBtn.classList.remove('playing');
            musicBtn.textContent = '🎶';
        });

        bgMusic.addEventListener('pause', () => {
            this.isPlaying = false;
            musicBtn.classList.remove('playing');
            musicBtn.textContent = '🎶';
        });
    }

    // Setup modal for full image view
    setupModal() {
        const gallery = document.getElementById('gallery');
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modalImg');
        const modalMessage = document.getElementById('modalMessage');
        const closeModal = document.getElementById('closeModal');

        if (!gallery || !modal) return;

        // Open modal when clicking on gallery item
        gallery.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (!item) return;

            const index = parseInt(item.dataset.index);
            const imgSrc = item.querySelector('.gallery-img').src;
            
            modalImg.src = imgSrc;
            modalMessage.textContent = loveLetters[index] || "Our love story continues... 💕";
            modal.classList.add('active');
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        const closeModalHandler = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        closeModal.addEventListener('click', closeModalHandler);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModalHandler();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModalHandler();
            }
        });
    }

    // Setup interactive questions carousel
    setupQuestionsCarousel() {
        const questionText = document.getElementById('questionText');
        const questionInput = document.getElementById('questionInput');
        const prevButton = document.getElementById('prevQuestion');
        const nextButton = document.getElementById('nextQuestion');
        const saveButton = document.getElementById('saveQuestion');
        const currentQuestionNum = document.getElementById('currentQuestionNum');
        const totalQuestions = document.getElementById('totalQuestions');

        if (!questionText || !questionInput) return;

        // Initialize
        totalQuestions.textContent = romanticQuestions.length;
        this.updateQuestion();

        // Previous question
        prevButton.addEventListener('click', () => {
            if (this.currentQuestionIndex > 0) {
                this.saveCurrentAnswer();
                this.currentQuestionIndex--;
                this.updateQuestion();
            }
        });

        // Next question
        nextButton.addEventListener('click', () => {
            if (this.currentQuestionIndex < romanticQuestions.length - 1) {
                this.saveCurrentAnswer();
                this.currentQuestionIndex++;
                this.updateQuestion();
            }
        });

        // Save answer
        saveButton.addEventListener('click', () => {
            this.saveCurrentAnswer();
            this.showSaveConfirmation();
        });

        // Auto-save on input change
        questionInput.addEventListener('input', () => {
            this.saveCurrentAnswer();
        });

        // Navigate with arrow keys
        document.addEventListener('keydown', (e) => {
            if (questionInput === document.activeElement) return;
            
            if (e.key === 'ArrowLeft' && this.currentQuestionIndex > 0) {
                prevButton.click();
            } else if (e.key === 'ArrowRight' && this.currentQuestionIndex < romanticQuestions.length - 1) {
                nextButton.click();
            }
        });
    }

    updateQuestion() {
        const questionText = document.getElementById('questionText');
        const questionInput = document.getElementById('questionInput');
        const prevButton = document.getElementById('prevQuestion');
        const nextButton = document.getElementById('nextQuestion');
        const currentQuestionNum = document.getElementById('currentQuestionNum');

        // Update question text and number
        questionText.textContent = romanticQuestions[this.currentQuestionIndex];
        currentQuestionNum.textContent = this.currentQuestionIndex + 1;

        // Load saved answer
        const savedAnswer = localStorage.getItem(`answer_${this.currentQuestionIndex}`);
        questionInput.value = savedAnswer || '';

        // Update button states
        prevButton.disabled = this.currentQuestionIndex === 0;
        nextButton.disabled = this.currentQuestionIndex === romanticQuestions.length - 1;

        // Focus input
        setTimeout(() => questionInput.focus(), 100);
    }

    saveCurrentAnswer() {
        const questionInput = document.getElementById('questionInput');
        if (questionInput) {
            const answer = questionInput.value.trim();
            localStorage.setItem(`answer_${this.currentQuestionIndex}`, answer);
        }
    }

    showSaveConfirmation() {
        const saveButton = document.getElementById('saveQuestion');
        const originalText = saveButton.textContent;
        
        saveButton.textContent = '💕 Saved!';
        saveButton.style.background = 'var(--secondary)';
        saveButton.style.color = 'white';
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.style.background = 'var(--accent)';
            saveButton.style.color = 'var(--secondary)';
        }, 1500);
    }

    // Animate title with typing effect
    animateTitle() {
        const mainTitle = document.querySelector('.main-title');
        if (!mainTitle) return;

        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        mainTitle.style.opacity = '1';
        
        let index = 0;
        const typeNextChar = () => {
            if (index < text.length) {
                mainTitle.textContent += text[index];
                index++;
                setTimeout(typeNextChar, 80);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeNextChar, 500);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoveAnniversaryApp();
});

// Add some extra touches for better mobile experience
document.addEventListener('touchstart', function() {}, {passive: true});

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300 && !event.target.closest('.gallery-item')) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery-img');
    images.forEach((img, index) => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
    });
});