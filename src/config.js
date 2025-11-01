/**
 * SITE CONFIGURATION FILE
 * =====================
 * Centralized configuration for all site content, links, and details.
 * Edit this file to update your portfolio information across the entire site.
 */

export const config = {
  // ========== SITE METADATA ==========
  siteName: "m3m0rydmp",
  taglines: [
    "Pwning machines one at a time...",
    "powershell -nop -W hidden -noni -ep bypass",
    "You don't have to learn everything, just keep going..."
  ],
  description: "Writeups | Labs | Explorations",
  
  // ========== PROFILE INFORMATION ==========
  profile: {
    name: "m3m0rydmp",
    title: "Penetration Tester | Active Directory Specialist",
    bio: "Welcome to my digital space. This page will be a showcase of my writeups from CTF competitions, labs, courses or maybe Bug bounty (if I will ever get one). This space is a knowledge sharing for anyone who is interested.\n\nI try to be more detailed as much as possible with my writeups, so as to be understandable for beginners and seasoned pros alike.",
    // Profile picture URL - set this to your image path
    // Example: "/images/profile.jpg" or "https://example.com/profile.jpg"
    profilePicture: "/images/profile.jpg",
    // Add alt text for the profile picture
    profileAlt: "m3m0rydmp profile picture"
  },

  // ========== SOCIAL & EXTERNAL LINKS ==========
  socialLinks: {
    github: "https://github.com/m3m0rydmp",
    linkedin: "https://linkedin.com/in/robsacote",
    hackthebox: "https://app.hackthebox.com/profile/m3m0rydmp",
    tryhackme: "https://tryhackme.com/p/Res0nanc3",
    email: "robwilssacote@gmail.com"
  },

  // ========== SKILLS DISPLAYED IN ABOUT SECTION ==========
  skills: [
    "Active Directory",
    "Networking",
    "Web Security",
    "Boot2Root"
  ],

  // ========== HERO SECTION TEXT ==========
  hero: {
    mainTitle: "m3m0rydmp",
    subtitle: "System Online",
    primaryButtonText: "ACCESS WRITEUPS",
    secondaryButtonText: "LEARN MORE"
  },

  // ========== WRITEUPS SECTION ==========
  writeups: {
    sectionTitle: "WRITEUPS & EXPLORATIONS",
    sectionDescription: "Detailed walkthroughs of CTF challenges and security explorations",
    // Example writeups - add/remove as needed
    items: [
      {
        id: 1,
        title: "Your First Writeup",
        category: "CTF",
        difficulty: "medium",
        date: "Nov 01, 2024",
        readTime: "~10 min",
        description: "Add your CTF writeups here. Edit this config file to update."
      },
      {
        id: 2,
        title: "Challenge 2",
        category: "Web",
        difficulty: "hard",
        date: "Coming Soon",
        readTime: "~15 min",
        description: "Your next challenge writeup will appear here."
      }
    ]
  },

  // ========== PROJECTS SECTION ==========
  projects: {
    sectionTitle: "FEATURED PROJECTS",
    sectionDescription: "Notable projects and research work",
    items: [
      {
        id: 1,
        title: "Writeups Hub",
        icon: "◆",
        description: "A collection of detailed cybersecurity and CTF writeups",
        link: "#writeups"
      },
      {
        id: 2,
        title: "Security Tools",
        icon: "◇",
        description: "Custom scripts and tools for security research and penetration testing",
        link: "#"
      },
      {
        id: 3,
        title: "Research & Analysis",
        icon: "▥",
        description: "Technical documentation and security findings from my explorations",
        link: "#"
      }
    ]
  },

  // ========== ABOUT SECTION ==========
  about: {
    sectionTitle: "ABOUT THIS SYSTEM",
    mainText: "Welcome to my digital space. This page will be a showcase of my writeups from CTF competitions, labs, courses or maybe Bug bounty (if I will ever get one).",
    additionalText: "This space is a knowledge sharing for anyone who is interested. I try to be more detailed as much as possible with my writeups, so as to be understandable for beginners and seasoned pros alike.",
    statusBoxes: [
      {
        title: "STATUS",
        value: "ACTIVE"
      },
      {
        title: "FOCUS",
        value: "Active Directory"
      }
    ]
  },

  // ========== FOOTER SECTION ==========
  footer: {
    copyrightText: "© 2025 m3m0rydmp. All rights reserved.",
    socialButtons: [
      {
        name: "GitHub",
        icon: "github",
        url: "socialLinks.github"
      },
      {
        name: "LinkedIn",
        icon: "linkedin",
        url: "socialLinks.linkedin"
      },
      {
        name: "HackTheBox",
        icon: "hackthebox",
        url: "socialLinks.hackthebox"
      },
      {
        name: "TryHackMe",
        icon: "tryhackme",
        url: "socialLinks.tryhackme"
      }
    ]
  },

  // ========== THEME COLORS ==========
  theme: {
    colors: {
      primary: "#54c1e6",      // Cyan - Cyberpunk 2077
      secondary: "#fee801",    // Yellow - Cyberpunk 2077
      tertiary: "#9a9f17",     // Green-Yellow - Cyberpunk 2077
      accent: "#39c4b6",       // Teal - Cyberpunk 2077
      darkBg: "#00060e",       // Main background
      darkerBg: "#000000",     // Secondary background
      darkerBgAlt: "#0a0c15",  // Alternative dark
      textPrimary: "#fee801",  // Primary text - Yellow
      textSecondary: "#54c1e6", // Secondary text - Cyan
      textMuted: "#39c4b6",    // Muted text - Teal
      borderColor: "#1a1f2e",  // Border color
      borderGlow: "#54c1e6"    // Border glow - Cyan
    },
    
    // Animation speeds (in seconds)
    transitions: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5
    }
  },

  // ========== NAVIGATION ==========
  navigation: {
    links: [
      { name: "HOME", href: "#home" },
      { name: "WRITEUPS", href: "#writeups" },
      { name: "PROJECTS", href: "#projects" },
      { name: "ABOUT", href: "#about" }
    ]
  }
};

export default config;
