document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const heartIcon = document.getElementById('heartIcon');

    // Progress elements
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.getElementById('progressFill');
    const progressHandle = document.getElementById('progressHandle');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');

    // Volume elements
    const volumeBar = document.querySelector('.volume-bar');
    const volumeFill = document.getElementById('volumeFill');
    const volumeHandle = document.getElementById('volumeHandle');

    // Song info elements
    const songTitle = document.getElementById('songTitle');
    const artistName = document.getElementById('artistName');
    const albumCover = document.getElementById('albumCover');

    // State variables
    let isPlaying = false;
    let isShuffled = false;
    let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
    let isLiked = false;
    let currentVolume = 0.7;
    let isDraggingProgress = false;
    let isDraggingVolume = false;
    // Sample playlist
    const playlist = [
        {
            title: "Every Second",
            artist: "Mina Okabe",
            src: "./assets/mp3/every-second-mina-okabe.mp3",
            cover: "./assets/img/us.jpg"
        },
        {
            title: "A Million Signs",
            artist: "Vividy",
            src: "./assets/mp3/a-million-signs.mp3", // Replace with actual song URL
            cover: "./assets/img/her.jpg"
        }
    ];

    let currentSongIndex = 0;

    // Initialize
    function init() {
        loadSong(currentSongIndex);
        audioPlayer.volume = currentVolume;
        updateVolumeDisplay();
    }

    // Load song
    function loadSong(index) {
        const song = playlist[index];
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumCover.src = song.cover;
        audioPlayer.src = song.src;
    }

    // Play/Pause functionality
    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
    }

    // Update play button icon
    function updatePlayButton() {
        if (isPlaying) {
            playIcon.className = 'fas fa-pause';
            playBtn.classList.add('playing');
        } else {
            playIcon.className = 'fas fa-play';
            playBtn.classList.remove('playing');
        }
    }

    // Format time
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Update progress bar
    function updateProgress() {
        if (!isDraggingProgress && audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = progress + '%';
            progressHandle.style.left = progress + '%';
            currentTime.textContent = formatTime(audioPlayer.currentTime);
        }
    }

    // Update volume display
    function updateVolumeDisplay() {
        const volumePercent = currentVolume * 100;
        volumeFill.style.width = volumePercent + '%';
        volumeHandle.style.left = volumePercent + '%';
    }

    // Previous song
    function previousSong() {
        currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : playlist.length - 1;
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }

    // Next song
    function nextSong() {
        if (isShuffled) {
            currentSongIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentSongIndex = currentSongIndex < playlist.length - 1 ? currentSongIndex + 1 : 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            audioPlayer.play();
        }
    }

    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.style.color = isShuffled ? '#1db954' : '#b3b3b3';
    }

    // Toggle repeat
    function toggleRepeat() {
        repeatMode = (repeatMode + 1) % 3;
        const colors = ['#b3b3b3', '#1db954', '#1db954'];
        const icons = ['fas fa-redo', 'fas fa-redo', 'fas fa-redo-alt'];

        repeatBtn.style.color = colors[repeatMode];
        repeatBtn.querySelector('i').className = icons[repeatMode];
    }

    // Toggle like
    function toggleLike() {
        isLiked = !isLiked;
        heartIcon.className = isLiked ? 'fas fa-heart liked' : 'far fa-heart';
    }

    // Progress bar click handler
    function handleProgressClick(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickedTime = (clickX / width) * audioPlayer.duration;

        if (!isNaN(clickedTime)) {
            audioPlayer.currentTime = clickedTime;
        }
    }

    // Volume bar click handler
    function handleVolumeClick(e) {
        const rect = volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        currentVolume = Math.max(0, Math.min(1, clickX / width));

        audioPlayer.volume = currentVolume;
        updateVolumeDisplay();
    }

    // Progress drag handlers
    function handleProgressMouseDown(e) {
        isDraggingProgress = true;
        handleProgressClick(e);
    }

    function handleProgressMouseMove(e) {
        if (isDraggingProgress) {
            handleProgressClick(e);
        }
    }

    function handleProgressMouseUp() {
        isDraggingProgress = false;
    }

    // Volume drag handlers
    function handleVolumeMouseDown(e) {
        isDraggingVolume = true;
        handleVolumeClick(e);
    }

    function handleVolumeMouseMove(e) {
        if (isDraggingVolume) {
            handleVolumeClick(e);
        }
    }

    function handleVolumeMouseUp() {
        isDraggingVolume = false;
    }

    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    heartIcon.addEventListener('click', toggleLike);

    // Audio event listeners
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        updatePlayButton();
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayButton();
    });

    audioPlayer.addEventListener('timeupdate', updateProgress);

    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 2) {
            // Repeat one
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else if (repeatMode === 1 || currentSongIndex < playlist.length - 1) {
            // Repeat all or not last song
            nextSong();
        } else {
            // Stop at end
            isPlaying = false;
            updatePlayButton();
        }
    });

    // Progress bar event listeners
    progressBar.addEventListener('click', handleProgressClick);
    progressBar.addEventListener('mousedown', handleProgressMouseDown);
    document.addEventListener('mousemove', handleProgressMouseMove);
    document.addEventListener('mouseup', handleProgressMouseUp);

    // Volume bar event listeners
    volumeBar.addEventListener('click', handleVolumeClick);
    volumeBar.addEventListener('mousedown', handleVolumeMouseDown);
    document.addEventListener('mousemove', handleVolumeMouseMove);
    document.addEventListener('mouseup', handleVolumeMouseUp);

    // Touch events for mobile
    progressBar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDraggingProgress = true;
        const touch = e.touches[0];
        const rect = progressBar.getBoundingClientRect();
        const clickX = touch.clientX - rect.left;
        const width = rect.width;
        const clickedTime = (clickX / width) * audioPlayer.duration;

        if (!isNaN(clickedTime)) {
            audioPlayer.currentTime = clickedTime;
        }
    });

    progressBar.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isDraggingProgress) {
            const touch = e.touches[0];
            const rect = progressBar.getBoundingClientRect();
            const clickX = touch.clientX - rect.left;
            const width = rect.width;
            const clickedTime = (clickX / width) * audioPlayer.duration;

            if (!isNaN(clickedTime)) {
                audioPlayer.currentTime = clickedTime;
            }
        }
    });

    progressBar.addEventListener('touchend', () => {
        isDraggingProgress = false;
    });

    volumeBar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDraggingVolume = true;
        const touch = e.touches[0];
        const rect = volumeBar.getBoundingClientRect();
        const clickX = touch.clientX - rect.left;
        const width = rect.width;
        currentVolume = Math.max(0, Math.min(1, clickX / width));

        audioPlayer.volume = currentVolume;
        updateVolumeDisplay();
    });

    volumeBar.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isDraggingVolume) {
            const touch = e.touches[0];
            const rect = volumeBar.getBoundingClientRect();
            const clickX = touch.clientX - rect.left;
            const width = rect.width;
            currentVolume = Math.max(0, Math.min(1, clickX / width));

            audioPlayer.volume = currentVolume;
            updateVolumeDisplay();
        }
    });

    volumeBar.addEventListener('touchend', () => {
        isDraggingVolume = false;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSong();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSong();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    currentVolume = Math.min(1, currentVolume + 0.1);
                    audioPlayer.volume = currentVolume;
                    updateVolumeDisplay();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    currentVolume = Math.max(0, currentVolume - 0.1);
                    audioPlayer.volume = currentVolume;
                    updateVolumeDisplay();
                    break;
            }
        }
    });

    // Initialize the player
    init();    // Carousel functionality
    const carouselData = [
        {
            title: "Nuestros Recuerdos",
            text: "Cada instante contigo ha sido un regalo del universo. Desde nuestra primera cita hasta las pequeñas locuras que compartimos, cada risa, cada mirada, y cada palabra han quedado grabadas en mi alma. Son recuerdos que abrazo con el corazón y que me acompañan en cada paso. Tú has hecho que mi vida se llene de momentos que valen la pena recordar por siempre."
        },
        {
            title: "Tu Sonrisa",
            text: "Tu sonrisa tiene el poder de transformar todo a su alrededor. Cuando sonríes, el mundo se detiene por un segundo, y en ese instante solo existimos tú y yo. Es la luz que me guía, el refugio en mis días difíciles y la melodía que llena mi vida de paz. Tu sonrisa es, sin duda, una de las razones más puras por las que me enamoro de ti una y otra vez."
        },
        {
            title: "Nuestro Futuro",
            text: "Imagino nuestro futuro y no puedo evitar sonreír. Me veo a tu lado construyendo una vida donde cada sueño se convierte en realidad, donde las dificultades se enfrentan tomados de la mano y el amor crece con cada día que pasa. Quiero vivirlo todo contigo: los días tranquilos, las aventuras inesperadas y esos momentos sencillos que terminan siendo los más valiosos."
        },
        {
            title: "Felices 9 Meses",
            text: "Hoy celebramos nueve meses de amor, de aprendizajes, de pequeños grandes momentos. Aunque el tiempo no parezca mucho, lo que siento por ti no deja de crecer. Sé que el camino no siempre ha sido perfecto, pero quiero que sepas que cada día a tu lado me inspira a ser mejor. Gracias por tu paciencia, tu amor incondicional y por permitirme seguir construyendo este nosotros contigo."
        }

    ];

    let currentCardIndex = 0;
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselIndicators = document.getElementById('carouselIndicators');
    const prevCardBtn = document.getElementById('prevCard');
    const nextCardBtn = document.getElementById('nextCard');

    // Create carousel cards
    function createCarouselCards() {
        carouselTrack.innerHTML = '';
        carouselIndicators.innerHTML = '';

        carouselData.forEach((card, index) => {
            // Create card
            const cardElement = document.createElement('div');
            cardElement.className = 'carousel-card';
            cardElement.innerHTML = `
                <div class="carousel-card-header">
                    <h3 class="carousel-card-title">${card.title}</h3>
                    <i class="fas fa-heart carousel-heart"></i>
                </div>
                <p class="carousel-card-text">${card.text}</p>
            `;
            carouselTrack.appendChild(cardElement);

            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => goToCard(index));
            carouselIndicators.appendChild(indicator);
        });
    }    // Update carousel position
    function updateCarousel() {
        const translateX = -currentCardIndex * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentCardIndex);
        });
    }

    // Go to specific card
    function goToCard(index) {
        currentCardIndex = index;
        updateCarousel();
    }

    // Previous card
    function previousCard() {
        currentCardIndex = currentCardIndex > 0 ? currentCardIndex - 1 : carouselData.length - 1;
        updateCarousel();
    }

    // Next card
    function nextCard() {
        currentCardIndex = currentCardIndex < carouselData.length - 1 ? currentCardIndex + 1 : 0;
        updateCarousel();
    }

    // Auto-play carousel
    function startAutoPlay() {
        setInterval(() => {
            nextCard();
        }, 5000); // Change card every 5 seconds
    }

    // Carousel event listeners
    prevCardBtn.addEventListener('click', previousCard);
    nextCardBtn.addEventListener('click', nextCard);

    // Touch support for carousel
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return;

        const diffX = startX - currentX;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextCard();
            } else {
                previousCard();
            }
        }

        isDragging = false;
    });

    // Initialize carousel
    createCarouselCards();
    startAutoPlay();

    // Keyboard navigation for carousel
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            switch (e.code) {
                case 'ArrowLeft':
                    if (e.shiftKey) {
                        e.preventDefault();
                        previousCard();
                    }
                    break;
                case 'ArrowRight':
                    if (e.shiftKey) {
                        e.preventDefault();
                        nextCard();
                    }
                    break;
            }
        }
    });
});
