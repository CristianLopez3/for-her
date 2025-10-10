// Load highlights data and render icons
document.addEventListener('DOMContentLoaded', async function () {
    const highlightsRow = document.getElementById('highlightsRow');
    
    try {
        // Load highlights data from JSON
        const response = await fetch('./assets/data/highlightsData.json');
        const highlightsData = await response.json();
        
        // Render highlight icons
        renderHighlights(highlightsData);
    } catch (error) {
        console.error('Error loading highlights data:', error);
        highlightsRow.innerHTML = `
            <div style="color: rgba(255, 255, 255, 0.6); text-align: center; width: 100%; padding: 20px;">
                <p>No highlights available yet.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Add highlights by editing highlightsData.json</p>
            </div>
        `;
    }
});

function renderHighlights(highlightsData) {
    const highlightsRow = document.getElementById('highlightsRow');
    highlightsRow.innerHTML = '';
    
    highlightsData.forEach((highlight, index) => {
        const highlightElement = document.createElement('a');
        highlightElement.className = 'highlight-icon';
        highlightElement.href = `./carousel.html?index=${index}`;
        
        // Use the first slide's image as cover if coverImage is not set
        const coverImage = highlight.coverImage || (highlight.slides.length > 0 ? highlight.slides[0].image : '');
        
        highlightElement.innerHTML = `
            <div class="highlight-icon-image">
                <img src="${coverImage}" alt="${highlight.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%231db954%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2240%22 fill=%22white%22%3E%E2%98%85%3C/text%3E%3C/svg%3E'">
            </div>
            <span class="highlight-icon-title">${highlight.title}</span>
        `;
        
        highlightsRow.appendChild(highlightElement);
    });
}
