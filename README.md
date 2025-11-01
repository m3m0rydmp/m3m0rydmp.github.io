# m3m0rydmp Cyberpunk Portfolio

A modern, cyberpunk-themed portfolio showcasing CTF writeups and cybersecurity explorations. Built with React and styled with a Cyberpunk 2077 color palette.

## 🌐 Live Site

Visit: **https://m3m0rydmp.github.io/**

## ✨ Features

- 🎬 **Matrix Rain Animation** - Falling ASCII characters in the hero section
- 🎨 **Cyberpunk 2077 Theme** - Dark background with neon cyan, yellow, and teal accents
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast & Optimized** - React app with optimized build
- 🔗 **Social Integration** - GitHub, LinkedIn, HackTheBox, TryHackMe buttons
- 📸 **Profile Picture** - Displayed in hero section with glitch effects
- 🌙 **Dark Mode** - Eye-friendly cyberpunk aesthetic

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm 6+

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000` with hot reload enabled.

### Production Build

```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📝 Configuration

All site content is managed in a single file: **`src/config.js`**

Edit this file to customize:
- **Profile information** - Name, title, bio, picture
- **Social media links** - GitHub, LinkedIn, HackTheBox, TryHackMe
- **Writeups** - Add/remove CTF writeups
- **Projects** - Featured projects showcase
- **Skills** - Technology and skill tags
- **Theme colors** - Cyberpunk 2077 palette
- **Navigation** - Menu links

### Example: Adding a Writeup

Edit `src/config.js`:

```javascript
writeups: {
  items: [
    {
      id: 1,
      title: "Your Challenge Name",
      category: "CTF",
      difficulty: "hard",
      date: "Nov 01, 2024",
      readTime: "~15 min",
      description: "Challenge description..."
    }
  ]
}
```

## 🏗️ Project Structure

```
src/
├── config.js              # ⭐ All configuration here
├── App.js                 # Main component
├── index.js              # React entry point
├── index.css             # Global styles & theme
├── App.css               # App layout
└── components/
    ├── Header.js         # Navigation
    ├── Hero.js           # Hero section (Matrix rain + profile)
    ├── Writeups.js       # Writeups grid
    ├── Projects.js       # Projects showcase
    ├── About.js          # About section
    └── Footer.js         # Footer with social buttons

public/
├── index.html            # React entry HTML
├── icons/                # Social media icons
│   ├── github.png
│   ├── linkedin.png
│   ├── htb.jpeg
│   └── THM.png
└── images/
    └── profile.jpg       # Your profile picture

build/                     # Production build (auto-generated)
```

## 🎨 Cyberpunk 2077 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Cyan | `#54c1e6` | Main accent, text secondary |
| Primary Yellow | `#fee801` | Primary text |
| Tertiary Green-Yellow | `#9a9f17` | Accent |
| Accent Teal | `#39c4b6` | Secondary accent |
| Dark BG | `#00060e` | Main background |

## 🚀 Deployment

### Automatic (GitHub Actions)

The repository includes an automated workflow that:
1. Triggers on every push to `main` branch
2. Installs dependencies
3. Builds the React app
4. Deploys to GitHub Pages

Just push your changes:

```bash
git add .
git commit -m "Update portfolio"
git push
```

The site updates automatically!

### Manual Deployment

```bash
npm run build      # Build React app
npm run deploy     # Deploy to GitHub Pages
```

## 📁 Adding Your Profile Picture

1. Place your image at: `public/images/profile.jpg`
2. Update in `src/config.js`:
   ```javascript
   profile: {
     profilePicture: "/images/profile.jpg"
   }
   ```
3. Deploy: `npm run deploy`

## 🛠️ Technologies Used

- **React 18.2.0** - UI framework
- **React Scripts 5.0.1** - Build tooling
- **gh-pages 5.0.0** - GitHub Pages deployment
- **CSS3** - Styling with animations
- **Vanilla JavaScript** - No extra dependencies

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

- Content Security Policy headers configured
- No external script dependencies
- Environment variables properly gitignored
- Production build optimized and minified

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Deployment troubleshooting
- **SECURITY_CLEANUP_REPORT.md** - Security audit details
- **CLEANUP_COMPLETE.md** - Repository cleanup report

## 🐛 Troubleshooting

### Site shows old content
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Open in incognito/private mode
- Clear browser cache

### Build fails locally
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### GitHub Pages not updating
1. Check Actions tab: https://github.com/m3m0rydmp/m3m0rydmp.github.io/actions
2. Verify workflow is green ✅
3. Wait 2-3 minutes for CDN update
4. Hard refresh your browser

## 📄 License

© 2025 m3m0rydmp. All rights reserved.

## 🤝 Contributing

Feel free to fork, modify, and create your own version!

---

**Last Updated**: November 1, 2025  
**Status**: ✅ Production Ready
