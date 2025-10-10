# Highlight Stories Feature

This feature provides Instagram-style highlight stories with a Spotify-inspired design.

## Features

- **Horizontal scrollable row** of highlight icons
- **Carousel view** with auto-advancing slides
- **Progress bars** showing current slide position
- **Audio playback** per slide (optional)
- **Swipe gestures** for mobile navigation
- **Infinite loop** - carousel loops back to first slide after the last
- **Auto-advance** - slides change every 3 seconds automatically
- **Keyboard navigation** - Arrow keys and Escape

## File Structure

```
pages/highlights/
├── index.html                    # Highlights overview page
├── carousel.html                 # Story carousel viewer
├── assets/
│   ├── css/
│   │   ├── style.css            # Styles for overview page
│   │   └── carousel.css         # Styles for carousel
│   ├── js/
│   │   ├── app.js               # Logic for overview page
│   │   └── carousel.js          # Logic for carousel
│   └── data/
│       └── highlightsData.json  # Story content
└── README.md                     # This file
```

## Adding New Highlights

Edit `assets/data/highlightsData.json`:

```json
[
  {
    "title": "Your Highlight Title",
    "coverImage": "../../path/to/cover-image.jpg",
    "slides": [
      {
        "image": "../../path/to/slide1.jpg",
        "audio": "../../path/to/audio1.mp3",
        "text": "Description of what happened"
      },
      {
        "image": "../../path/to/slide2.jpg",
        "audio": "",
        "text": "Another moment in the story"
      }
    ]
  }
]
```

### Field Descriptions

- `title`: Name displayed under the highlight icon
- `coverImage`: Thumbnail image (uses first slide's image if not set)
- `slides`: Array of story slides
  - `image`: Path to the slide image
  - `audio`: Path to audio file (optional, leave empty string if none)
  - `text`: Overlay text describing the moment

## Usage

### Navigation Controls

**Carousel View:**
- **Click right side** of screen: Next slide
- **Click left side** of screen: Previous slide
- **Swipe left**: Next slide
- **Swipe right**: Previous slide
- **Arrow Right key**: Next slide
- **Arrow Left key**: Previous slide
- **Escape key**: Exit to highlights overview
- **Back button**: Return to highlights overview

**Auto-advance:**
- Slides automatically change every 3 seconds
- Pauses when user interacts
- Pauses when tab is not visible

### Mobile Optimization

- Touch/swipe gestures supported
- Responsive design adapts to screen size
- Progress bars adjust to number of slides
- Full-screen immersive experience

## Technical Details

### Auto-Advance Timer
- Duration: 3000ms (3 seconds) per slide
- Clears when user navigates manually
- Restarts after user interaction completes
- Pauses when page is hidden

### Audio Playback
- Plays automatically when slide is shown
- Resets to beginning for each slide
- Gracefully handles missing audio files
- Maximum recommended duration: 30 seconds

### Infinite Loop
- After last slide, returns to first slide
- Before first slide, goes to last slide
- Seamless transitions

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Touch events for mobile devices
- Keyboard navigation for desktop
- Visibility API for pause/resume

## Customization

### Timing
Edit `carousel.js` line with setTimeout:
```javascript
autoAdvanceTimer = setTimeout(() => {
    nextSlide();
}, 3000); // Change 3000 to desired milliseconds
```

### Colors
Edit the CSS files to match your design:
- `style.css`: Highlight icons and overview page
- `carousel.css`: Story carousel appearance

### Progress Bar Style
Edit `.story-progress-bar` in `carousel.css`

## Notes

- Images should be optimized for web (recommended max 1920x1080)
- Audio files should be MP3 format
- Keep text descriptions concise for better readability
- Test on mobile devices for best experience
