// Datos de las tarjetas

const TYPE = {
    TITLE: 'title',
    MESSAGE: 'message'
}

const cardsData = [
    {
        type: TYPE.TITLE,
        content: {
            title: 'Feliz Cumpleaños N° 20',
            subtitle: 'mi amor ❤️'
        }
    },
    {
        type: TYPE.MESSAGE,
        content: 'Quiero desearte lo mejor en este día especial, que todos tus sueños se hagan realidad (obviamente a mi lado)🎉'
    },
    {
        type: TYPE.MESSAGE,
        content: 'Quiero que sepas que me haces mucho más feliz cada día que pasamos juntos y que deseo que esta felicidad dure hasta que nuestros corazones no puedan latir 💖'
    },
    {
        type: TYPE.MESSAGE,
        content: 'Eres la persona más increíble que conozco y me siento afortunado de tenerte en mi vida'
    },
    {
        type: TYPE.MESSAGE,
        content: 'Espero que este nuevo año de vida esté lleno de aventuras, amor y mucha felicidad (a mi lado tambien jeje)🎂'
    },
    {
        type: TYPE.MESSAGE,
        content: 'Es tu primer cumpleaños a mi lado y quiero que sepas que es solo un primer paso para una vida llena de esta celebración.'
    }, 
    {
        type: TYPE.MESSAGE,
        content: 'Siempre estaré aquí para apoyarte en cada paso de tu camino'
    },
    {
        type: TYPE.MESSAGE,
        content: 'Gracias por ser esa mujer maravillosa que me quiere y soporta a pesar de todos mis defectos 😊'
    },
    {
        type: TYPE.MESSAGE,
        content: 'Siempre que estoy en tus brazos pienso "aqui es donde pertenezco", y espero que dure para siempre 🎵'
    }, 
    {
        type: TYPE.MESSAGE,
        content: "Ahora que estoy contigo, quiero recordar este momento para toda mi vida porque realmente amo tu compañia."
    },
    {
        type: TYPE.MESSAGE,
        content: 'Estar o no estar contigo es la unidad de medida de mi tiempo.'
    }, 
    {
        type: TYPE.MESSAGE,
        content: 'Y te elegiría a ti; en cien vidas, en cien mundos, en cualquier versión de la realidad, te encontraría y te elegiría'
    },
    {
        type: TYPE.MESSAGE,
        content: "BTW, que hermosa te debes ver leyendo esto 🥰"
    }, 
    {
        type: TYPE.MESSAGE,
        content: 'Saber que estaras en mi futuro me llena de pasion para poder lograr cosas que quiero compartir contigo, te amo Karen y quiero que sepas que siempre estare de tu lado y para ti, gracias por llegar a mi vida y darme una razon para esforzarme, muaaa 💗'
    }
];

// Clase para el efecto de confeti
class ConfettiEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.confetti = [];
        this.animationId = null;
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    }

    createConfettiPiece() {
        const colors = ['#e3ca56', '#561c25', '#e1e3e0', '#f0d670', '#ff69b4', '#ff6b6b', '#4ecdc4'];
        return {
            x: Math.random() * this.canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 3,
            gravity: 0.1
        };
    }

    start() {
        this.createCanvas();
        
        // Crear confeti inicial
        for (let i = 0; i < 150; i++) {
            this.confetti.push(this.createConfettiPiece());
        }
        
        this.animate();
        
        // Remover el confeti después de 6 segundos
        setTimeout(() => {
            this.stop();
        }, 6000);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const piece = this.confetti[i];
            
            // Actualizar posición
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vy += piece.gravity;
            piece.rotation += piece.rotationSpeed;
            
            // Dibujar confeti
            this.ctx.save();
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate(piece.rotation * Math.PI / 180);
            this.ctx.fillStyle = piece.color;
            this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 3);
            this.ctx.restore();
            
            // Remover confeti que salió de la pantalla
            if (piece.y > this.canvas.height + 50) {
                this.confetti.splice(i, 1);
            }
        }
        
        if (this.confetti.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.stop();
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            document.body.removeChild(this.canvas);
        }
    }
}

class BirthdayCarousel {
    constructor() {
        this.currentIndex = 0;
        this.totalCards = cardsData.length;
        this.carouselTrack = document.getElementById('carouselTrack');
        this.carouselIndicators = document.getElementById('carouselIndicators');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.autoSlideInterval = null;
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.createCards();
        this.createIndicators();
        this.setupEventListeners();
        this.startAutoSlide();
        this.updateCarousel();
        this.checkFirstVisit();
    }

    checkFirstVisit() {
        // Verificar si es la primera visita
        const hasVisited = localStorage.getItem('birthdayPageVisited');
        
        if (!hasVisited) {
            // Marcar como visitado
            localStorage.setItem('birthdayPageVisited', 'true');
            
            // Iniciar confeti después de un pequeño delay
            setTimeout(() => {
                const confetti = new ConfettiEffect();
                confetti.start();
            }, 500);
        }
    }
    
    createCards() {
        this.carouselTrack.innerHTML = '';
        
        // Crear tarjetas duplicadas para efecto infinito
        // Agregamos las tarjetas originales + una copia al final + una copia al inicio
        const allCards = [...cardsData, ...cardsData, ...cardsData];
        
        allCards.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.className = `card ${cardData.type}-card`;
            
            if (cardData.type === 'title') {
                card.innerHTML = `
                    <h1>${cardData.content.title}</h1>
                    <p class="subtitle">${cardData.content.subtitle}</p>
                `;
            } else {
                card.innerHTML = `<p>${cardData.content}</p>`;
            }
            
            this.carouselTrack.appendChild(card);
        });
        
        // Comenzar desde el segundo set (índice 5) para tener copias en ambos lados
        this.currentIndex = this.totalCards;
        this.carouselTrack.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }
    
    createIndicators() {
        this.carouselIndicators.innerHTML = '';
        
        cardsData.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            this.carouselIndicators.appendChild(indicator);
        });
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.prevSlide();
            }
        });
        
        this.nextBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        });
        
        // Evento para detectar cuando termina la transición
        this.carouselTrack.addEventListener('transitionend', () => {
            this.handleTransitionEnd();
        });
        
        // Touch events para móvil
        let startX = 0;
        let endX = 0;
        
        this.carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.carouselTrack.addEventListener('touchmove', (e) => {
            endX = e.touches[0].clientX;
        });
        
        this.carouselTrack.addEventListener('touchend', () => {
            if (!this.isTransitioning) {
                const diff = startX - endX;
                if (Math.abs(diff) > 50) { // Mínimo 50px de desplazamiento
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }
        });
    }
    
    handleTransitionEnd() {
        this.isTransitioning = false;
        
        // Si estamos en la primera copia (índices 0-4), saltar al final del set original
        if (this.currentIndex < this.totalCards) {
            this.carouselTrack.style.transition = 'none';
            this.currentIndex = this.currentIndex + (this.totalCards * 2);
            this.carouselTrack.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            setTimeout(() => {
                this.carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
        
        // Si estamos en la última copia (índices 10-14), saltar al inicio del set original
        if (this.currentIndex >= this.totalCards * 2) {
            this.carouselTrack.style.transition = 'none';
            this.currentIndex = this.currentIndex - (this.totalCards * 2);
            this.carouselTrack.style.transform = `translateX(-${this.currentIndex * 100}%)`;
            setTimeout(() => {
                this.carouselTrack.style.transition = 'transform 0.5s ease-in-out';
            }, 50);
        }
    }
    
    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, 5000); // 5 segundos
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }
    
    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
    
    goToSlide(targetIndex) {
        if (this.isTransitioning) return;
        
        // Convertir el índice del indicador al índice real del carousel
        const realIndex = targetIndex + this.totalCards;
        this.currentIndex = realIndex;
        this.updateCarousel();
        this.restartAutoSlide();
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex++;
        this.updateCarousel();
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentIndex--;
        this.updateCarousel();
    }
    
    updateCarousel() {
        const translateX = -this.currentIndex * 100;
        this.carouselTrack.style.transform = `translateX(${translateX}%)`;
        
        // Actualizar indicadores basado en el índice real
        const indicatorIndex = this.currentIndex % this.totalCards;
        const indicators = this.carouselIndicators.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === indicatorIndex);
        });
    }
}

// Inicializar el carousel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayCarousel();
});