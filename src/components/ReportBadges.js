import React from 'react';
import './ReportBadges.css';

const normalize = value => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const platforms = { bugcrowd: 'Bugcrowd', hackerone: 'HackerOne', yeswehack: 'YesWeHack', intigriti: 'Intigriti', hackenproof: 'HackenProof' };
const levels = { p1: 'critical', p2: 'high', p3: 'medium', p4: 'low', p5: 'informational', critical: 'critical', high: 'high', medium: 'medium', low: 'low', informational: 'informational', info: 'informational', none: 'informational' };
const types = { bac: 'access-control', brokenaccesscontrol: 'access-control', idor: 'access-control', authentication: 'authentication', brokenauthentication: 'authentication', xss: 'injection', crosssitescripting: 'injection', sqli: 'injection', sqlinjection: 'injection', injection: 'injection', ssrf: 'ssrf', serversiderequestforgery: 'ssrf', rce: 'execution', remotecodeexecution: 'execution', securitymisconfiguration: 'misconfiguration', informationdisclosure: 'disclosure', sensitivedataexposure: 'disclosure' };

export function isBountyReport(writeup) {
  return normalize(writeup.platform) === 'bugbountyreports';
}

export default function ReportBadges({ writeup }) {
  const platform = normalize(writeup.bountyPlatform);
  const level = levels[normalize(writeup.severity)];
  const type = types[normalize(writeup.category)] || 'other';
  return (
    <span className="report-badges" aria-label="Report details">
      <span className={`report-badge report-platform platform-${platforms[platform] ? platform : 'other'}`}>
        {platforms[platform] || writeup.bountyPlatform || 'Private disclosure'}
      </span>
      <span className={`report-badge report-severity severity-${level || 'unknown'}`} title={level ? `${writeup.severity} — ${level}` : 'Severity not specified'} aria-label={level ? `Severity: ${writeup.severity} (${level})` : 'Severity not specified'}>
        {writeup.severity || 'Unrated'}
      </span>
      <span className={`report-badge report-vulnerability vulnerability-${type}`}>
        {writeup.category || 'Unclassified'}
      </span>
    </span>
  );
}
