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
    resetsec: "https://resetsec.github.io/",
    pwndesal: "https://pwndesal.xyz",
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
    sectionDescription: "These are writeups from various platforms I've played or practiced on. The labs posted here are retired or have permission to be made public. In the future, any labs I've solved that aren't yet allowed to have public writeups will be password-protected until the platform permits their release."
  },

  // ========== PROJECTS SECTION ==========
  projects: {
    sectionTitle: "FEATURED PROJECTS",
    sectionDescription: "Some projects and stuffs that I made cause I'm bored",
    items: [
      {
        id: 1,
        title: "Clairvoyance",
        icon: "/images/clairvoyance.png",
        description: "A keylogger that captures keystrokes, screenshots, and sends data via Google Drive.",
        link: "https://github.com/m3m0rydmp/Clairvoyance"
      },
      {
        id: 2,
        title: "Security Tools",
        icon: "/images/radar.png",
        description: "A Free Vessel Tracker that uses AISstream OpenAPI to track vessels",
        link: "https://github.com/m3m0rydmp/AISstream-Vessel-Tracker"
      },
      {
        id: 3,
        title: "Research & Analysis",
        icon: "/images/admin.png",
        description: "A script meant to be used for USB-Drop Attack",
        link: "https://github.com/m3m0rydmp/Rev3nant"
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
    disclaimer: "DISCLAIMER: This website is Vibe Coded",
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
      },
      {
        name: "ResetSec",
        icon: "resetsec",
        url: "socialLinks.resetsec"
      },
      {
        name: "PWNDESAL",
        icon: "pwndesal",
        url: "socialLinks.pwndesal"
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
