// Notes data - JSON structure for love notes
const notesData = [
    {
        icon: "💌",
        title: "Love Notes",
        overview: "Beautiful letters just for you",
        description: "Every word I write comes from the deepest part of my heart. These notes are my way of expressing the love that words sometimes struggle to capture. You mean everything to me, and I hope these messages remind you of that every single day."
    },
    {
        icon: "🌹",
        title: "Special Moments",
        overview: "Memories we've created together",
        description: "Each moment we spend together becomes a treasured memory. From our first conversation to our latest adventure, every second with you is precious. These are the moments I hold close to my heart, the ones that make me smile even on the hardest days."
    },
    {
        icon: "💝",
        title: "Why I Love You",
        overview: "All the reasons you're amazing",
        description: "Your smile lights up my world. Your laugh is my favorite sound. Your kindness inspires me to be better. Your love gives me strength. You are intelligent, beautiful, caring, and everything I could ever hope for. I love you for who you are and who you help me become."
    },
    {
        icon: "🎵",
        title: "Our Songs",
        overview: "Music that reminds me of us",
        description: "Every song we share becomes a soundtrack to our love story. These melodies capture our journey, our emotions, and our connection. When I hear them, I'm transported back to the moments we shared, dancing, laughing, and simply being together."
    },
    {
        icon: "✨",
        title: "Dreams Together",
        overview: "The future I imagine with you",
        description: "I dream of all the adventures we'll have, all the places we'll see, and all the memories we'll create. I see us growing old together, supporting each other through everything, and building a beautiful life filled with love, laughter, and endless happiness."
    }
];

// Render notes dynamically
function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer) return;

    notesData.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.dataset.index = index;

        noteElement.innerHTML = `
            <div class="note-header">
                <div class="note-icon">
                    ${note.icon}
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
        noteElement.addEventListener('click', function() {
            toggleNote(this);
        });

        notesContainer.appendChild(noteElement);
    });
}

// Toggle note expansion (accordion behavior)
function toggleNote(clickedNote) {
    const allNotes = document.querySelectorAll('.note-item');
    const isCurrentlyActive = clickedNote.classList.contains('active');

    // Close all notes
    allNotes.forEach(note => {
        note.classList.remove('active');
    });

    // Open clicked note if it wasn't already open
    if (!isCurrentlyActive) {
        clickedNote.classList.add('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', renderNotes);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close all notes on Escape key
        const allNotes = document.querySelectorAll('.note-item');
        allNotes.forEach(note => {
            note.classList.remove('active');
        });
    }
});
