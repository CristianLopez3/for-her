// Fetch card data from JSON file
const cardDataUrl = "assets/data/cardsData.json";
let cardData = [];

fetch(cardDataUrl)
  .then((response) => response.json())
  .then((data) => {
    cardData = data;
    renderCards();
  })
  .catch((error) => {
    console.error("Error loading card data:", error);
  });

// Invitation data
const invitationData = {
  place: "Te recojo en tu trabajo para ir a Creeps!",
  date: "Sabado, Octubre 12 - 2:00 PM",
  dressCode: "Casual y comodo (yo ire con jean y camiseta blanca)",
  activity:
    "Comeremos, hablaremos y obvio te consentire mucho, quiero que celebremos como debe ser nuestro aniversario",
  whatsappNumber: "3133751604",
};

// Function to render cards dynamically
function renderCards() {
  const cardsContainer = document.getElementById("cardsContainer");
  if (!cardsContainer) return;

  cardData.forEach((card) => {
    const cardElement = document.createElement("a");
    cardElement.href = card.route;
    cardElement.className = "card";

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
  const profileIcon = document.getElementById("profileIcon");
  const modal = document.getElementById("invitationModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");

  // Populate modal with invitation data
  document.getElementById("invitationPlace").textContent = invitationData.place;
  document.getElementById("invitationDate").textContent = invitationData.date;
  document.getElementById("invitationDressCode").textContent =
    invitationData.dressCode;
  document.getElementById("invitationActivity").textContent =
    invitationData.activity;

  // Setup WhatsApp button
  const whatsappBtn = document.getElementById("whatsappBtn");
  const message = encodeURIComponent(`Hi! I got your invitation! 💕`);
  whatsappBtn.href = `https://wa.me/${invitationData.whatsappNumber}?text=${message}`;

  // Open modal when profile icon is clicked
  profileIcon.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close modal when close button is clicked
  modalClose.addEventListener("click", () => {
    closeModal();
  });

  // Close modal when overlay is clicked
  modalOverlay.addEventListener("click", () => {
    closeModal();
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderCards();
  setupInvitationModal();
});

/**
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 * HIGHLIGHTS PAGE SCRIPT
 */

// Load highlights data and render icons
document.addEventListener("DOMContentLoaded", async function () {
  const highlightsRow = document.getElementById("highlightsRow");

  try {
    // Load highlights data from JSON
    // const response = await fetch('./assets/data/highlightsData.json');
    const response = await fetch(
      "./pages/highlights/assets/data/highlightsData.json"
    );
    const highlightsData = await response.json();

    // Render highlight icons
    renderHighlights(highlightsData);
  } catch (error) {
    console.error("Error loading highlights data:", error);
    highlightsRow.innerHTML = `
            <div style="color: rgba(255, 255, 255, 0.6); text-align: center; width: 100%; padding: 20px;">
                <p>No highlights available yet.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Add highlights by editing highlightsData.json</p>
            </div>
        `;
  }
});

function renderHighlights(highlightsData) {
  const highlightsRow = document.getElementById("highlightsRow");
  highlightsRow.innerHTML = "";

  highlightsData.forEach((highlight, index) => {
    const highlightElement = document.createElement("a");
    highlightElement.className = "highlight-icon";
    highlightElement.href = `./pages/highlights/carousel.html?index=${index}`;

    // Use the first slide's image as cover if coverImage is not set
    const coverImage =
      highlight.coverImage ||
      (highlight.slides.length > 0 ? highlight.slides[0].image : "");

    highlightElement.innerHTML = `
            <div class="highlight-icon-image">
                <img src="${coverImage}" alt="${highlight.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%231db954%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2240%22 fill=%22white%22%3E%E2%98%85%3C/text%3E%3C/svg%3E'">
            </div>
            <span class="highlight-icon-title">${highlight.title}</span>
        `;

    highlightsRow.appendChild(highlightElement);
  });
}

/**
 * HIGHLIGHTS PAGE SCRIPT
 * ***************************************
 * ***************************************
 * ***************************************
 * ***************************************
 */
