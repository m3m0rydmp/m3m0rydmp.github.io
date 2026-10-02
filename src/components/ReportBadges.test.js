import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReportBadges, { isBountyReport } from './ReportBadges';

test.each([
  ['P1', 'critical'], ['P2', 'high'], ['P3', 'medium'], ['P4', 'low'], ['P5', 'informational'],
  ['Critical', 'critical'], ['High', 'high'], ['Medium', 'medium'], ['Low', 'low'], ['Informational', 'informational']
])('renders %s with a readable severity label', (severity, level) => {
  const markup = renderToStaticMarkup(<ReportBadges writeup={{ bountyPlatform: 'Bugcrowd', severity, category: 'Broken Access Control' }} />);
  expect(markup).toContain(`Severity: ${severity} (${level})`);
  expect(markup).toContain(`severity-${level}`);
  expect(markup.indexOf('Bugcrowd')).toBeLessThan(markup.indexOf('Broken Access Control'));
  expect(markup).not.toContain('N/A');
});

test.each(['Bugcrowd', 'HackerOne', 'YesWeHack', 'Intigriti', 'HackenProof'])('recognizes %s without case sensitivity', platform => {
  const markup = renderToStaticMarkup(<ReportBadges writeup={{ bountyPlatform: platform.toUpperCase() }} />);
  expect(markup).toContain(`platform-${platform.toLowerCase()}`);
  expect(markup).toContain(platform);
});

test('keeps unknown values readable and scopes report presentation to bug bounty', () => {
  const markup = renderToStaticMarkup(<ReportBadges writeup={{ bountyPlatform: 'Other platform', severity: 'Pending', category: 'New type' }} />);
  expect(markup).toContain('platform-other');
  expect(markup).toContain('Other platform');
  expect(markup).toContain('severity-unknown');
  expect(markup).toContain('vulnerability-other');
  expect(isBountyReport({ platform: 'Bug Bounty Reports' })).toBe(true);
  expect(isBountyReport({ platform: 'HackTheBox' })).toBe(false);
});
