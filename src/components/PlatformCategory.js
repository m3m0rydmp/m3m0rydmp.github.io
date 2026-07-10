import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import writeupsData from '../data/writeupsData.json';
import WriteupDrawer from './WriteupDrawer';
import SearchBar from './SearchBar';
import BorderGlow from './BorderGlow';
import './PlatformCategory.css';

const PLATFORM_DEFINITIONS = {
  hackthebox: { label: 'Hack The Box', badge: 'HTB', logo: '/icons/htb.webp', description: 'Machines, challenges, sherlocks, and labs' },
  tryhackme: { label: 'TryHackMe', badge: 'THM', logo: '/icons/THM.webp', description: 'Guided rooms, learning paths, and seasonal events.' },
  ctfs: { label: 'CTFs', badge: 'CTF', logo: '/icons/flag.webp', description: 'Jeopardy and attack/defense events worth remembering.' },
  vulnlab: { label: 'VulnLab', badge: 'VL', logo: '/icons/vulnlab.webp', description: 'Adversary-simulated nodes with enterprise-grade tradecraft.' },
  bugbountyreports: { label: 'Bug Bounty Reports', badge: 'BBR', logo: '/icons/bug.webp', description: 'Disclosure-ready findings from real programs.' }
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

  const writingIllustration = '/images/writing.webp';
  const placeholderMessage = 'Writeup is still in progress, or still solving. Come back later, or tomorrow or maybe an entire decade your choice.';

  return (
    <div className="platform-category-page">
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

          <SearchBar platformFilter={platformDef.label} />

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
            <div className="platform-writeup-grid">
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
                  <BorderGlow
                    key={writeup.id}
                    className="platform-card-glow"
                    edgeSensitivity={34}
                    glowColor="188 68 62"
                    backgroundColor="#0a0e27"
                    borderRadius={14}
                    glowRadius={34}
                    glowIntensity={1.0}
                    coneSpread={24}
                    animated={false}
                    colors={['#2f9ac2', '#54c1e6', '#39c4b6']}
                    fillOpacity={0.3}
                  >
                    <Link
                      to={`/writeups/${writeup.slug}`}
                      className="platform-card"
                    >
                      {writeup.coverImage && (
                        <div className="platform-card-image" style={{ backgroundImage: `url(${writeup.coverImage})` }}>
                          <div className="platform-card-image-overlay"></div>
                        </div>
                      )}
                      <div className="platform-card-header">
                        <p className="platform-card-date"><span className="bracket">[</span> {writeup.displayDate} <span className="bracket">]</span></p>
                      </div>
                      <div className="platform-card-body">
                        <h4>{writeup.title}</h4>
                        <p className="platform-card-excerpt">{writeup.excerpt || 'No description available for this writeup.'}</p>
                      </div>
                      <div className="platform-card-footer">
                        <span className={`platform-pill difficulty ${difficultyNormalized}`}>{difficultyLabel}</span>
                        <span className={`platform-pill category-pill ${categoryClass}`}>{writeup.category}</span>
                      </div>
                    </Link>
                  </BorderGlow>
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
