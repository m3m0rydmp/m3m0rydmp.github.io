import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import writeupsData from '../data/writeupsData.json';
import WriteupDrawer from './WriteupDrawer';
import './PlatformCategory.css';

const PLATFORM_DEFINITIONS = {
  hackthebox: { label: 'Hack The Box', badge: 'HTB', logo: '/icons/htb.jpeg', description: 'Machines, challenges, sherlocks, and labs' },
  tryhackme: { label: 'TryHackMe', badge: 'THM', logo: '/icons/THM.png', description: 'Guided rooms, learning paths, and seasonal events.' },
  ctfs: { label: 'CTFs', badge: 'CTF', logo: '/icons/flag.png', description: 'Jeopardy and attack/defense events worth remembering.' },
  vulnlab: { label: 'VulnLab', badge: 'VL', logo: '/icons/vulnlab.jpg', description: 'Adversary-simulated nodes with enterprise-grade tradecraft.' },
  bugbountyreports: { label: 'Bug Bounty Reports', badge: 'BBR', logo: '/icons/bug.png', description: 'Disclosure-ready findings from real programs.' }
};

const normalizeLabel = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');

function PlatformCategory() {
  const { platform } = useParams();
  const normalizedPlatform = normalizeLabel(platform);
  const platformDef = PLATFORM_DEFINITIONS[normalizedPlatform];

  /**
   * @time O(n) where n is total writeups
   * @space O(k) where k is filtered writeups for this platform
   */
  const items = useMemo(() => {
    const allItems = writeupsData.items ?? [];
    return allItems.filter((writeup) => {
      const writeupPlatform = normalizeLabel(writeup.platform || '');
      return writeupPlatform === normalizedPlatform;
    });
  }, [normalizedPlatform]);

  if (!platformDef) {
    return <Navigate to="/" replace />;
  }

  const writingIllustration = '/images/writing.jpg';
  const placeholderMessage = 'Writeup is still in progress, or still solving. Come back later, or tomorrow or maybe an entire decade your choice.';

  return (
    <div className="platform-category-page">
      <div className="letter-glitch-background">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05 }} />
      </div>

      <div className="platform-category-shell">
        <WriteupDrawer isOpen showToggle={false} className="platform-sidebar" />

        <div className="platform-category-content">
          <div className="platform-category-header">
            <div className="platform-brand">
              {platformDef.logo && (
                <img src={platformDef.logo} alt={platformDef.label} className="platform-logo" />
              )}
              <p className="platform-flag">{platformDef.badge}</p>
            </div>
            <div>
              <h2>{platformDef.label}</h2>
              <p>{platformDef.description}</p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="writeups-placeholder">
              <div className="placeholder-art">
                <img src={writingIllustration} alt="Writing in progress" loading="lazy" />
              </div>
              <div className="placeholder-copy">
                <p className="placeholder-eyebrow">Status: pending</p>
                <h4>{platformDef.label} writeups are brewing...</h4>
                <p>{placeholderMessage}</p>
              </div>
            </div>
          ) : (
            <div className="platform-writeup-list">
              {items.map((writeup) => {
                const difficultyNormalized = (writeup.difficulty || 'unknown').toLowerCase().replace(/\s+/g, '-');
                const difficultyLabel = writeup.difficulty ? writeup.difficulty.toUpperCase() : 'UNKNOWN';
                
                const categoryNormalized = (writeup.category || '').toLowerCase();
                let categoryClass = '';
                if (categoryNormalized.includes('offensive') || categoryNormalized.includes('red')) {
                  categoryClass = 'offensive';
                } else if (categoryNormalized.includes('defensive') || categoryNormalized.includes('blue')) {
                  categoryClass = 'defensive';
                }
                
                return (
                  <Link key={writeup.id} to={`/writeups/${writeup.slug}`} className="platform-list-row">
                    <div className="platform-row-left">
                      <p className="platform-row-date">Added {writeup.displayDate}</p>
                      <h4>{writeup.title}</h4>
                    </div>
                    <div className="platform-row-right">
                      <span className={`platform-pill difficulty ${difficultyNormalized}`}>{difficultyLabel}</span>
                      <span className={`platform-pill category-pill ${categoryClass}`}>{writeup.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlatformCategory;
