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
        icon: "assets/img/icons/pompompurin.png",
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
        description: "Our one year anniversary and three months of being a couple",
        icon: "assets/img/icons/taylor-2-swift.png",
        route: "pages/spotify-notes/index.html"
    },
    {
        title: "Highlight Stories",
        description: "Our special moments in stories - just like Instagram highlights",
        icon: "assets/img/icons/ophelia-icon.png",
        route: "pages/highlights/index.html"
    }
];

// Invitation data
const invitationData = {
    place: "Te recojo en tu trabajo para ir a Creeps!",
    date: "Sabado, Octubre 12 - 2:00 PM",
    dressCode: "Casual y comodo (yo ire con jean y camiseta blanca)",
    activity: "Comeremos, hablaremos y obvio te consentire mucho, quiero que celebremos como debe ser nuestro aniversario",
    whatsappNumber: "3133751604" // Replace with actual WhatsApp number
};

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

// Function to setup invitation modal
function setupInvitationModal() {
    const profileIcon = document.getElementById('profileIcon');
    const modal = document.getElementById('invitationModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    // Populate modal with invitation data
    document.getElementById('invitationPlace').textContent = invitationData.place;
    document.getElementById('invitationDate').textContent = invitationData.date;
    document.getElementById('invitationDressCode').textContent = invitationData.dressCode;
    document.getElementById('invitationActivity').textContent = invitationData.activity;
    
    // Setup WhatsApp button
    const whatsappBtn = document.getElementById('whatsappBtn');
    const message = encodeURIComponent(`Hi! I got your invitation! 💕`);
    whatsappBtn.href = `https://wa.me/${invitationData.whatsappNumber}?text=${message}`;
    
    // Open modal when profile icon is clicked
    profileIcon.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal when close button is clicked
    modalClose.addEventListener('click', () => {
        closeModal();
    });
    
    // Close modal when overlay is clicked
    modalOverlay.addEventListener('click', () => {
        closeModal();
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    setupInvitationModal();
});
