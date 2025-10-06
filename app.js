// Card data for the home page
const cardData = [
    {
        title: "Spotify Cards",
        description: "That time when we got 9 months",
        icon: "assets/img/house-icon.svg",
        route: "pages/spotify/index.html"
    },
    {
        title: "Love Notes",
        description: "Beautiful letters just for you",
        icon: "assets/img/house-icon.svg",
        route: "pages/cards/index.html"
    },
    {
        title: "Anniversary Pinterest",
        description: "Our special moments together",
        icon: "assets/img/house-icon.svg",
        route: "pages/aniversary-pinterest/index.html"
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
