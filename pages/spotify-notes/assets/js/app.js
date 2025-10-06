1; // Notes data - JSON structure for love notes
const notesData = [
  {
    icon: "./assets/img/one.png",
    title: "Love Notes",
    overview: "Beautiful letters just for you",
    description:
      "Every word I write comes from the deepest part of my heart. These notes are my way of expressing the love that words sometimes struggle to capture. You mean everything to me, and I hope these messages remind you of that every single day.",
  },
  {
    icon: "./assets/img/two.png",
    title: "Special Moments",
    overview: "Memories we've created together",
    description:
      "Each moment we spend together becomes a treasured memory. From our first conversation to our latest adventure, every second with you is precious. These are the moments I hold close to my heart, the ones that make me smile even on the hardest days.",
  },
  {
    icon: "./assets/img/three.png",
    title: "Why I Love You",
    overview: "All the reasons you're amazing",
    description:
      "Your smile lights up my world. Your laugh is my favorite sound. Your kindness inspires me to be better. Your love gives me strength. You are intelligent, beautiful, caring, and everything I could ever hope for. I love you for who you are and who you help me become.",
  },
  {
    icon: "./assets/img/four.png",
    title: "Our Songs",
    overview: "Music that reminds me of us",
    description:
      "Every song we share becomes a soundtrack to our love story. These melodies capture our journey, our emotions, and our connection. When I hear them, I'm transported back to the moments we shared, dancing, laughing, and simply being together.",
  },
  {
    icon: "./assets/img/five.png",
    title: "Dreams Together",
    overview: "The future I imagine with you",
    description:
      "I dream of all the adventures we'll have, all the places we'll see, and all the memories we'll create. I see us growing old together, supporting each other through everything, and building a beautiful life filled with love, laughter, and endless happiness.",
  },
  {
    icon: "./assets/img/six.png",
    title: "My Bad Things",
    overview: "An apology from my heart",
    description:
      "I want to take a moment to acknowledge the times I've hurt you, even unintentionally. My words and actions haven't always reflected the love I feel for you. For the moments I've let you down, I'm truly sorry. You deserve the best of me, and I'm committed to being better for you every day and every way, I love that of you, and I will always strive to show you that love in all that I do.",
  },
  {
    icon: "./assets/img/five.png",
    title: "Our Future",
    overview: "The future I imagine with you",
    description:
      "It's quite a odyssey to think about the future - we're young and I'm still learning about life and love, and over all not perfect, however I know something for sure and it's that I love you and I want to be with you, that's kinda stupid to say because you think I don't, but I really do, words aren't enough to express my feelings and to make you feel sure about me and my love for you, but I want to try and give my everything on it even though I can commit mistakes I will resolve them and always give you the corresponding respect and confidence that you deserve, Karen, if you have doubts about us don't doubt and tell me because my objective is to make you happy and if that includes me being part of your life then I will be very happy however if that't not the case I will understand and I will try to support you in the best way I can.",
  },
];

// Render notes dynamically
function renderNotes() {
  const notesContainer = document.getElementById("notesContainer");
  if (!notesContainer) return;

  notesData.forEach((note, index) => {
    const noteElement = document.createElement("div");
    noteElement.className = "note-item";
    noteElement.dataset.index = index;

    noteElement.innerHTML = `
            <div class="note-header">
                <div class="note-icon">
                   <img src="${note.icon}" alt="${note.title} icon" />
                </div>
                <div class="note-content">
                    <h3 class="note-title">${note.title}</h3>
                    <p class="note-overview">${note.overview}</p>
                </div>
                <div class="note-toggle">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="note-description">
                <p>${note.description}</p>
            </div>
        `;

    // Add click event for accordion behavior
    noteElement.addEventListener("click", function () {
      toggleNote(this);
    });

    notesContainer.appendChild(noteElement);
  });
}

// Toggle note expansion (accordion behavior)
function toggleNote(clickedNote) {
  const allNotes = document.querySelectorAll(".note-item");
  const isCurrentlyActive = clickedNote.classList.contains("active");

  // Close all notes
  allNotes.forEach((note) => {
    note.classList.remove("active");
  });

  // Open clicked note if it wasn't already open
  if (!isCurrentlyActive) {
    clickedNote.classList.add("active");
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", renderNotes);

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close all notes on Escape key
    const allNotes = document.querySelectorAll(".note-item");
    allNotes.forEach((note) => {
      note.classList.remove("active");
    });
  }
});
