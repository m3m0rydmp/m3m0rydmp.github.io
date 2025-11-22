import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import config from '../config';
import writeupsData from '../data/writeupsData.json';
import './Writeups.css';

const PLATFORM_SECTIONS = [
  {
    key: 'HackTheBox',
    label: 'HackTheBox',
    description: 'Machines, challenges, and labs straight from the green screen.',
    badge: 'HTB'
  },
  {
    key: 'TryHackMe',
    label: 'TryHackMe',
    description: 'Guided rooms, learning paths, and seasonal events.',
    badge: 'THM'
  },
  {
    key: 'CTFs',
    label: 'CTFs',
    description: 'Jeopardy and attack/defense events worth remembering.',
    badge: 'CTF'
  },
  {
    key: 'VulnLab',
    label: 'VulnLab',
    description: 'Adversary-simulated nodes with enterprise-grade tradecraft.',
    badge: 'VL'
  },
  {
    key: 'Bug Bounty Reports',
    label: 'Bug Bounty Reports',
    description: 'Disclosure-ready findings from real programs.',
    badge: 'BBR'
  }
];

const normalizeLabel = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const CATEGORY_ICONS = {
  hackthebox: '/icons/htb.jpeg',
  tryhackme: '/icons/THM.png',
  ctf: '/icons/flag.png',
  ctfs: '/icons/flag.png',
  vulnlab: '/icons/vulnlab.jpg',
  bugbountyreports: '/icons/bug.png',
  uncategorized: '/icons/title_icon.jpg'
};

function Writeups() {
  const items = useMemo(() => writeupsData.items ?? [], []);
  
  /**
   * @time O(n * m) where n is writeups, m is platform sections (typically <10)
   * @space O(n) for grouped sections with references
   */
  const groupedSections = useMemo(() => {
    const claimedIds = new Set();

    const sections = PLATFORM_SECTIONS.map((section) => {
      const normalizedKey = normalizeLabel(section.key);
      const sectionItems = items.filter((writeup) => {
        const normalizedPlatform = normalizeLabel(writeup.platform || '');
        const matches = normalizedPlatform === normalizedKey;
        if (matches) {
          claimedIds.add(writeup.id);
        }
        return matches;
      });

      return { ...section, items: sectionItems };
    });

    const uncategorized = items.filter((writeup) => !claimedIds.has(writeup.id));

    if (uncategorized.length) {
      sections.push({
        key: 'Uncategorized',
        label: 'Uncategorized',
        description: 'Writeups waiting to be assigned to a platform.',
        badge: 'UNC',
        items: uncategorized
      });
    }

    return sections;
  }, [items]);

  const getIconForSection = (sectionKey) => {
    const normalizedKey = normalizeLabel(sectionKey);
    return CATEGORY_ICONS[normalizedKey] || '/icons/radar.png';
  };

  const getPlatformRoute = (sectionKey) => {
    return `/writeups/platform/${normalizeLabel(sectionKey)}`;
  };

  return (
    <section id="writeups" className="writeups">
      <div className="section-header">
        <div>
          <h2 className="section-title">{config.writeups.sectionTitle}</h2>
          {config.writeups.sectionDescription && (
            <p className="section-subtitle">{config.writeups.sectionDescription}</p>
          )}
        </div>
        <div className="title-underline"></div>
      </div>

      <div className="platform-tile-grid">
        {groupedSections.map((section) => (
          <Link
            key={section.key}
            to={getPlatformRoute(section.key)}
            className="platform-tile"
          >
            <span className="platform-tile-media">
              <img src={getIconForSection(section.key)} alt={`${section.label} icon`} loading="lazy" />
            </span>
            <span className="platform-tile-copy">
              <h3>{section.label}</h3>
            </span>
            <span className="platform-count-chip">
              {section.items.length} {section.items.length === 1 ? 'report' : 'reports'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Writeups;
