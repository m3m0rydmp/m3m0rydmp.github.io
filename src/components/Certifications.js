import React, { useState, useEffect } from 'react';
import './Certifications.css';

const CERT_GROUPS = {
    industry: {
        label: 'Industry Certifications',
        description: 'Certifications earned on these following platforms.',
        items: [
            {
                id: 'crta',
                title: 'CRTA',
                alt: 'Certified Red Team Analyst',
                issuer: 'CyberWarfare Labs',
                image: '/certs/certification/CRTA.jpg'
            },
            {
                id: 'ejpt',
                title: 'eJPT',
                alt: 'eLearnSecurity Junior Penetration Tester',
                issuer: 'INE Security',
                image: '/certs/certification/eJPT.jpg'
            },
            {
                id: 'cap',
                title: 'CAP',
                alt: 'Certified AppSec Practitioner',
                issuer: 'The SecOps Group',
                image: '/certs/certification/CAP.jpg'
            },
            {
                id: 'pt1',
                title: 'PT1',
                alt: 'Penetration Testing 1',
                issuer: 'TryHackMe',
                image: '/certs/certification/PT1.jpg'
            }
        ]
    },
    ctf: {
        label: 'CTF and Platform Achievements',
        description: 'Hands-on challenge completions from labs and platform events.',
        items: [
            {
                id: 'ca2024',
                title: 'Cyber Apocalypse 2024',
                alt: 'Cyber Apocalypse 2024',
                issuer: 'Hack The Box',
                image: '/certs/Cyber Apocalypse.jpg'
            },
            {
                id: 'dante',
                title: 'Dante Pro Lab',
                alt: 'Red Team Operator Level 1',
                issuer: 'Hack The Box',
                image: '/certs/Dante.jpg'
            },
            {
                id: 'industrial',
                title: 'Industrial Intrusion',
                alt: 'Industrial Control Systems',
                issuer: 'TryHackMe',
                image: '/certs/Industrial Intrusion.jpg'
            },
            {
                id: 'mythical',
                title: 'Mythical',
                alt: 'Red Team Operator Level 1',
                issuer: 'Hack The Box',
                image: '/certs/Mythical.jpg'
            },
            {
                id: 'fullhouse',
                title: 'FullHouse',
                alt: 'Red Team Operator Level 1',
                issuer: 'Hack The Box',
                image: '/certs/FullHouse.jpg'
            },
            {
                id: 'poo',
                title: 'P.O.O.',
                alt: 'HTB Mini Pro Lab — Certificate of Completion',
                issuer: 'Hack The Box',
                image: '/certs/poo.jpg'
            },
            {
                id: 'cyberskills2026',
                title: 'Global Cyber Skills Benchmark 2026',
                alt: 'Project Nightfall — Certified CTF Player',
                issuer: 'Hack The Box',
                image: '/certs/cyber-skills-global.jpg'
            }
        ]
    }
};

function Certifications() {
    const [activeGroup, setActiveGroup] = useState('industry');
    const [focusedCert, setFocusedCert] = useState(null);

    const groupKeys = Object.keys(CERT_GROUPS);
    const activeGroupData = CERT_GROUPS[activeGroup];

    // Preload large certificate images during idle time to reduce modal open lag.
    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const allImages = Object.values(CERT_GROUPS).flatMap((group) =>
            group.items.map((item) => item.image)
        );

        const preload = () => {
            allImages.forEach((src) => {
                const image = new Image();
                image.decoding = 'async';
                image.src = src;
            });
        };

        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(preload, { timeout: 1500 });
            return () => window.cancelIdleCallback(id);
        }

        const timeoutId = window.setTimeout(preload, 250);
        return () => window.clearTimeout(timeoutId);
    }, []);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (focusedCert) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [focusedCert]);

    return (
        <section id="certifications" className="certifications-section">
            <div className="section-header">
                <h2 className="section-title">Certifications <span className="highlight-dot"></span></h2>
                <div className="title-underline"></div>
            </div>

            <div className="cert-shell fade-in">
                <div className="cert-overview">
                    <p className="cert-kicker">Credentials</p>
                </div>

                <div className="cert-tabs" role="tablist" aria-label="Certification category selector">
                    {groupKeys.map((groupKey) => {
                        const group = CERT_GROUPS[groupKey];
                        const isActive = groupKey === activeGroup;
                        return (
                            <button
                                key={groupKey}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className={`cert-tab ${isActive ? 'active' : ''}`}
                                onClick={() => setActiveGroup(groupKey)}
                            >
                                <span className="cert-tab-signal" aria-hidden="true"></span>
                                <span className="cert-tab-label">{group.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="cert-active-group" role="tabpanel" aria-live="polite">
                    <header className="cert-group-head">
                        <h3>{activeGroupData.label}</h3>
                        <p>{activeGroupData.description}</p>
                    </header>

                    <div className="cert-grid">
                        {activeGroupData.items.map((item) => (
                            <article key={item.id} className="cert-card">
                                <button
                                    type="button"
                                    className="cert-card-visual"
                                    onClick={() => setFocusedCert(item)}
                                    aria-label={`View ${item.title} certificate`}
                                >
                                    <img src={item.image} alt={item.alt} loading="lazy" />
                                </button>
                                <div className="cert-card-body">
                                    <p className="cert-issuer">{item.issuer}</p>
                                    <h4>{item.title}</h4>
                                    <p className="cert-detail">{item.alt}</p>
                                    <button
                                        type="button"
                                        className="cert-view-btn"
                                        onClick={() => setFocusedCert(item)}
                                    >
                                        Inspect credential
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {focusedCert && (
                <div className="cert-modal-overlay" onClick={() => setFocusedCert(null)}>
                    <div className="cert-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="cert-modal-close" onClick={() => setFocusedCert(null)}>×</button>
                        <img
                            src={focusedCert.image}
                            alt={focusedCert.alt}
                            className="cert-modal-image"
                            loading="eager"
                            decoding="async"
                        />
                        <div className="cert-modal-info">
                            <h3>{focusedCert.title}</h3>
                            <p>{focusedCert.alt}</p>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}

export default Certifications;
