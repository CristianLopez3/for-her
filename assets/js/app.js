// Card data for the home page
const cardData = [
    {
        title: "Spotify Cards",
        description: "That time when we celebrated our 9-month anniversary",
        icon: "assets/img/icons/ophelia-icon.png",
        route: "pages/spotify/index.html"
    },
    {
        title: "Love Letter",
        description: "Go and check, I wrote you a letter",
        icon: "assets/img/icons/kali-icon.png",
        route: "pages/cards/index.html"
    },
    {
        title: "Anniversary Pinterest",
        description: "Our special moments together - for our anniversary",
        icon: "assets/img/icons/twice-icon.png",
        route: "pages/aniversary-pinterest/index.html"
    },
    {
        title: "Spotify Notes",
        description: "Beautiful love notes with Spotify-inspired dropdown",
        icon: "assets/img/icons/kali-icon.png",
        route: "pages/spotify-notes/index.html"
    }
];

// Function to render cards dynamically
function renderCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) return;

    cardData.forEach(card => {
        const cardElement = document.createElement('a');
        cardElement.href = card.route;
        cardElement.className = 'card';
        
        cardElement.innerHTML = `
            <div class="card-icon">
                <img src="${card.icon}" alt="${card.title} icon">
            </div>
            <div class="card-content">
                <h3 class="card-title">${card.title}</h3>
                <p class="card-description">${card.description}</p>
            </div>
        `;
        
        cardsContainer.appendChild(cardElement);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', renderCards);
