# For Her - Birthday Card Web Application

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This is a static HTML/CSS/JavaScript birthday card web application that displays a romantic carousel with messages and a photo gallery with interactive modals. No build process is required - it serves directly as static files.

## Working Effectively

### Quick Start (Validated Commands)
- `cd /home/runner/work/for-her/for-her` - Navigate to repository root
- `python3 -m http.server 8000` - Start local development server (takes 2-3 seconds)
- Open http://localhost:8000 in browser to view the application

### Core Application Structure
- **index.html** - Main HTML file with carousel, gallery, modal, and music controls
- **assets/css/style.css** - Styling with CSS variables and responsive design
- **assets/js/app.js** - JavaScript with carousel logic, modal interactions, and confetti effects
- **assets/img/** - 12 images (image1.jpeg through image12.jpg) with mixed .jpeg/.jpg extensions
- **assets/music/** - Background music files for the application

### Image File Extensions (Critical)
The application has mixed image extensions that must be handled correctly:
- Images 1,3,4,5,6: `.jpeg` extension
- Images 2,7,8,9,10,11,12: `.jpg` extension
- The JavaScript includes a mapping object `imageExtensions` to handle this correctly
- Missing icon.png file is created by copying image1.jpeg

### Dependencies and External Resources
- **Font Awesome 6.0.0** - Icon fonts (may be blocked by CDN filters)
- **Google Fonts (Poppins, Tangerine)** - Typography (may be blocked by CDN filters) 
- **External CDN dependencies may fail** in restricted environments - application still functions with fallback fonts

## Validation and Testing

### ALWAYS Test These User Scenarios After Changes
1. **Application Loading**:
   - Start server with `python3 -m http.server 8000`
   - Navigate to http://localhost:8000
   - Verify carousel displays birthday messages
   - Verify gallery shows 12 images correctly
   - Expected time: 5-10 seconds for full load

2. **Carousel Navigation**:
   - Click previous/next buttons to navigate messages
   - Auto-advance should work (5-second intervals)
   - Verify smooth transitions between message cards
   - Expected behavior: Infinite scroll with title and message cards

3. **Gallery Modal Interaction**:
   - Click any image in the gallery
   - Modal should open with image and romantic question
   - Type answer in textarea and verify text persistence
   - Close modal with Escape key (×  button has CSS layering issues)
   - Expected behavior: Modal opens, question displays, localStorage saves answers

4. **Music Controls**:
   - Click music button (🎵)
   - Background music should start/stop (MP3 files in assets/music/)
   - Button state should change visually when active
   - Expected behavior: Music plays/pauses, button changes color

5. **Final Message**:
   - Click "Ver mensaje final" button
   - Should scroll to final letter section
   - Expected behavior: Smooth scroll animation to letter content

### Known Issues and Workarounds
- **Modal Close Button**: Use Escape key instead of clicking × due to CSS z-index issues
- **External CDN Resources**: FontAwesome and Google Fonts may be blocked - application works with fallback fonts
- **Confetti Animation**: JavaScript console error about removeChild is cosmetic and doesn't affect functionality
- **Music Playback**: Requires user interaction to start due to browser autoplay policies

### Performance Characteristics
- **Server startup**: 2-3 seconds
- **Page load time**: 5-10 seconds (includes image loading)
- **Image loading**: 12 images total, ~2MB combined size
- **Interactive response**: Immediate for buttons, modals, carousel navigation
- **NO BUILD PROCESS** - Direct file serving only

## Development Guidelines

### File Structure Validation
Always verify this exact structure exists:
```
/home/runner/work/for-her/for-her/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   ├── img/
│   │   ├── icon.png (created from image1.jpeg)
│   │   ├── image1.jpeg
│   │   ├── image2.jpg
│   │   ├── image3.jpeg
│   │   ├── image4.jpeg
│   │   ├── image5.jpeg
│   │   ├── image6.jpeg
│   │   ├── image7.jpg
│   │   ├── image8.jpg
│   │   ├── image9.jpg
│   │   ├── image10.jpg
│   │   ├── image11.jpg
│   │   ├── image12.jpg
│   │   └── pompompurin-wallpaper.jpg
│   └── music/
│       ├── Kali Uchis - For_ You (Audio).mp3
│       └── Kali Uchis - Its Just Us (Lyrics).mp3
```

### Making Changes
- **NO BUILD REQUIRED** - Edit files directly and refresh browser
- **Test immediately** after any HTML/CSS/JS changes
- **Validate image paths** when modifying gallery or carousel code
- **Check console** for JavaScript errors after changes
- **Verify mobile responsiveness** - application includes touch event handlers

### Critical HTML Elements
Always ensure these elements exist in index.html with correct IDs:
- `carouselTrack`, `carouselIndicators`, `prevBtn`, `nextBtn`
- `gallery`, `modal`, `modalImg`, `modalQuestion`, `modalAnswer`
- `closeModal`, `saveAnswer`, `music-btn`, `bg-music`
- `finalMsgBtn`, `finalLetter`

### Browser Compatibility
- **Modern browsers required** for CSS Grid, Flexbox, ES6+ JavaScript
- **Mobile touch events** supported for swipe navigation
- **Audio element** requires user interaction for autoplay compliance
- **LocalStorage** used for saving user answers to questions

## Common Tasks

### Starting Development Server
```bash
cd /home/runner/work/for-her/for-her
python3 -m http.server 8000
# Access at http://localhost:8000
```

### Testing Application Functionality
```bash
# 1. Start server (if not running)
python3 -m http.server 8000 &

# 2. Use playwright or browser to test:
# - Load http://localhost:8000
# - Click through carousel navigation
# - Test image gallery modal interactions
# - Verify music controls
# - Test final message button
```

### Debugging Issues
1. Check browser console for JavaScript errors
2. Verify all image files exist with correct extensions
3. Test with network tab to see failed resource loads
4. Use browser dev tools to check CSS layout issues

### Performance Optimization
- Images are already optimized (mixed JPEG formats)
- No compression or minification needed for static files
- Consider lazy loading for images if adding more content
- Audio files are compressed MP3 format

## Repository Information
- **Type**: Static web application
- **Framework**: Vanilla HTML/CSS/JavaScript
- **Server**: Python built-in HTTP server for development
- **No package.json**: No npm dependencies or build process
- **No CI/CD**: Direct file serving, no compilation needed
- **No linting setup**: Manual code review process
- **No automated tests**: Manual browser testing required