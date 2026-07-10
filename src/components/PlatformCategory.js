import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import writeupsData from '../data/writeupsData.json';
import WriteupDrawer from './WriteupDrawer';
import SearchBar from './SearchBar';
import './PlatformCategory.css';

function osTagFor(os) {
  const normalized = (os || '').toLowerCase();
  if (normalized.includes('win')) return 'WIN';
  if (normalized.includes('lin')) return 'LIN';
  if (normalized.includes('mac') || normalized.includes('osx')) return 'MAC';
  if (!os || normalized === 'n/a') return 'N/A';
  return os.toUpperCase();
}

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

  const items = useMemo(() => {
    const allItems = writeupsData.items ?? [];
    return allItems.filter((writeup) => {
      const writeupPlatform = normalizeLabel(writeup.platform || '');
      return writeupPlatform === normalizedPlatform;
    });
  }, [normalizedPlatform]);

  const [drawerOpen, setDrawerOpen] = useState(() => (
    typeof window === 'undefined' ? true : window.innerWidth > 1024
  ));

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!platformDef) {
    return <Navigate to="/" replace />;
  }

  const writingIllustration = '/images/writing.webp';
  const placeholderMessage = 'Writeup is still in progress, or still solving. Come back later, or tomorrow or maybe an entire decade your choice.';

  return (
    <div className="platform-category-page">
      <div className={`platform-category-shell ${drawerOpen ? 'drawer-open' : 'drawer-collapsed'}`}>
        <WriteupDrawer isOpen={drawerOpen} onToggle={toggleDrawer} showToggle={false} className="platform-sidebar" />
        <div
          className="drawer-overlay"
          aria-hidden="true"
          onClick={drawerOpen ? closeDrawer : undefined}
        ></div>
        <button
          type="button"
          className="drawer-floating-toggle"
          aria-label={drawerOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-expanded={drawerOpen}
          data-state={drawerOpen ? 'open' : 'closed'}
          onClick={toggleDrawer}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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
            <>
              <div className="platform-database-header">
                <span className="database-header-tag">{'// DATABASE:'}</span>{' '}
                {platformDef.label.toUpperCase()} — {items.length} RECORD{items.length === 1 ? '' : 'S'}
              </div>

              <div className="writeup-row-list" role="list">
                {items.map((writeup) => {
                  if (writeup.locked) {
                    return (
                      <Link
                        key={writeup.id}
                        to={`/writeups/${writeup.slug}`}
                        className="writeup-row writeup-row-locked"
                        role="listitem"
                      >
                        <span className="row-marker" aria-hidden="true"></span>
                        <div className="row-main">
                          <div className="row-title-line">
                            <span className="row-title">{writeup.title}</span>
                            <span className="row-locked-badge">
                              <Lock size={11} aria-hidden="true" /> [ENCRYPTED]
                            </span>
                          </div>
                          <div className="row-meta-line">
                            <span className="row-excerpt">{writeup.excerpt || 'ENCRYPTED // ACCESS RESTRICTED'}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  const difficultyNormalized = (writeup.difficulty || 'unknown').toLowerCase().replace(/\s+/g, '-');
                  const difficultyLabel = writeup.difficulty ? writeup.difficulty.toUpperCase() : 'UNKNOWN';
                  const osTag = osTagFor(writeup.os);
                  const tagsLine = writeup.tags && writeup.tags.length > 0
                    ? writeup.tags.join(' · ')
                    : (writeup.category || 'Uncategorized');

                  return (
                    <Link
                      key={writeup.id}
                      to={`/writeups/${writeup.slug}`}
                      className="writeup-row"
                      role="listitem"
                    >
                      <span className="row-marker" aria-hidden="true"></span>
                      <div className="row-main">
                        <div className="row-title-line">
                          <span className="row-title">{writeup.title}</span>
                          <span className={`row-pill difficulty ${difficultyNormalized}`}>[{difficultyLabel}]</span>
                          <span className="row-os">{osTag}</span>
                          <span className="row-date">{writeup.displayDate}</span>
                        </div>
                        <div className="row-meta-line">
                          <span className="row-tags">{tagsLine}</span>
                          <span className="row-readtime">{writeup.readTime}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlatformCategory;
