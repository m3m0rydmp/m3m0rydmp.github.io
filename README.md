# m3m0rydmp Cyberpunk Portfolio

A cyberpunk-themed portfolio and writeup showcase built with React. This site serves as a central hub for cybersecurity content, featuring CTF writeups, penetration testing walkthroughs, and security research documentation from various platforms including HackTheBox, TryHackMe, and custom CTF challenges.

The site automatically processes markdown writeups, extracts metadata (difficulty, OS, category), and presents them in an organized, platform-categorized interface with full detail views, making it easy to browse and share security research and educational content.

## Live Site

**https://m3m0rydmp.github.io/**

## Features

- **Dynamic Writeup System**: Markdown-powered writeups with automatic metadata extraction and categorization
- **Platform Organization**: Separate sections for HackTheBox, TryHackMe, CTFs, VulnLab, and Bug Bounty Reports
- **Interactive UI**: Matrix rain hero section, glitch effects, and cyberpunk-themed animations
- **Responsive Design**: Fully responsive layout optimized for desktop and mobile devices
- **Automatic Deployment**: GitHub Pages integration with automated build and sync processes
- **Metadata Display**: Color-coded difficulty levels, OS indicators, and category badges
- **Search & Filter**: Navigate writeups by platform with detailed filtering options

## Styling Reference

### CSS Custom Properties

```css
:root {
  /* Primary Colors - Cyberpunk 2077 Palette */
  --primary-cyan: #54c1e6;          /* Secondary text, accents, links */
  --primary-magenta: #fee801;       /* Headlines, primary text */
  --primary-purple: #9a9f17;        /* Additional accent color */
  --accent-green: #39c4b6;          /* Buttons, pills, highlights */

  /* Neutrals */
  --dark-bg: #00060e;               /* Page background */
  --darker-bg: #000000;             /* Deepest black for overlays */
  --darker-bg-alt: #0a0c15;         /* Alternative dark background */
  --text-primary: #fee801;          /* Primary text (yellow) */
  --text-secondary: #54c1e6;        /* Secondary text (cyan) */
  --text-muted: #39c4b6;            /* Muted text (teal) */

  /* Borders & Accents */
  --border-color: #1a1f2e;          /* Default border color */
  --border-glow: #54c1e6;           /* Glowing border effect */

  /* Spacing */
  --spacing-xs: 0.5rem;             /* 8px */
  --spacing-sm: 1rem;               /* 16px */
  --spacing-md: 1.5rem;             /* 24px */
  --spacing-lg: 2rem;               /* 32px */
  --spacing-xl: 3rem;               /* 48px */

  /* Typography */
  --font-family: 'Courier New', 'JetBrains Mono', monospace;
  --font-size-base: 1rem;           /* 16px */
  --font-size-sm: 0.875rem;         /* 14px */
  --font-size-lg: 1.125rem;         /* 18px */
  --font-size-xl: 1.5rem;           /* 24px */
  --font-size-2xl: 2rem;            /* 32px */
  --font-size-3xl: 3rem;            /* 48px */

  /* Transitions */
  --transition-fast: 0.2s ease;     /* Quick interactions */
  --transition-normal: 0.3s ease;   /* Standard transitions */
  --transition-slow: 0.5s ease;     /* Smooth animations */
}
```

### Color Usage Guide

| Color Variable | Hex Code | Primary Usage |
|----------------|----------|---------------|
| `--primary-cyan` | `#54c1e6` | Links, secondary headings, icons, sidebar accents |
| `--primary-magenta` | `#fee801` | Main headings, titles, primary text emphasis |
| `--primary-purple` | `#9a9f17` | Tertiary accents, special highlights |
| `--accent-green` | `#39c4b6` | Buttons, interactive elements, success states |
| `--dark-bg` | `#00060e` | Main page background |
| `--darker-bg` | `#000000` | Modal overlays, deep backgrounds |
| `--darker-bg-alt` | `#0a0c15` | Card backgrounds, section dividers |
| `--text-primary` | `#fee801` | Body text, primary content |
| `--text-secondary` | `#54c1e6` | Secondary content, labels |
| `--text-muted` | `#39c4b6` | Timestamps, metadata, footer text |
| `--border-color` | `#1a1f2e` | Default borders, separators |
| `--border-glow` | `#54c1e6` | Hover effects, focus states |

### Special Effects

- **Scanline Animation**: Continuous scrolling scanline overlay for CRT monitor effect
- **Matrix Rain**: Animated falling characters in hero section
- **Glitch Effects**: Text and border glitch animations on interactive elements
- **Gradient Overlays**: Radial gradients for depth and visual interest
- **Hover Transitions**: Smooth color and transform transitions on all interactive elements

---

**Last Updated**: November 22, 2025 