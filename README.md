# m3m0rydmp Cyberpunk Portfolio

A modern, cyberpunk-themed portfolio showcasing CTF writeups and cybersecurity explorations. Built with React and styled with a Cyberpunk 2077 color palette.

## Quick Start

### Prerequisites
- Node.js 14+ 
- npm 6+

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000` with hot reload enabled.

## Configuration

All site content is managed in a single file: `src/config.js`

Edit this file to customize:
- Profile information
- Social media links
- Writeups and projects
- Skills and bio
- Theme colors

## Building & Deployment

### Production Build
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

This requires `gh-pages` to be installed (already in devDependencies).

## Project Structure

```
src/
├── config.js              # Centralized configuration
├── App.js                 # Main component
├── index.js              # React entry point
├── index.css             # Global styles & theme
└── components/           # React components
    ├── Header.js
    ├── Hero.js
    ├── Writeups.js
    ├── Projects.js
    ├── About.js
    └── Footer.js
```

## Features

✨ **Matrix Rain Animation** - Falling ASCII characters in hero section  
🎨 **Cyberpunk 2077 Theme** - Authentic color palette and styling  
📱 **Fully Responsive** - Works on mobile, tablet, and desktop  
⚡ **Fast & Optimized** - React app with lazy loading  
🔗 **Social Integration** - GitHub, LinkedIn, HackTheBox, TryHackMe  

## Adding Writeups

Edit `src/config.js` and add items to the `writeups.items` array:

```javascript
{
  id: 1,
  title: "Your Challenge Name",
  category: "CTF",
  difficulty: "hard",
  date: "Nov 01, 2024",
  readTime: "~15 min",
  description: "Challenge description..."
}
```

## Security

- Content Security Policy headers configured
- No external dependencies for core functionality
- Environment variables properly gitignored
- Code optimized and minified in production

## License

© 2025 m3m0rydmp. All rights reserved.
