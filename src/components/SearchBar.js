import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const CATEGORY_ICONS = {
    hackthebox: '/icons/htb.webp',
    tryhackme: '/icons/THM.webp',
    ctf: '/icons/flag.webp',
    ctfs: '/icons/flag.webp',
    vulnlab: '/icons/vulnlab.webp',
    bugbountyreports: '/icons/bug.webp',
    uncategorized: '/icons/title_icon.webp',
};

const normalizeLabel = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');

// Escape regex metacharacters so user input can't throw (or inject a pattern)
// when it's fed into `new RegExp(...)` for highlighting.
const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function getSnippet(content, query, contextLength = 40) {
    if (!content) return '';
    const matchIndex = content.toLowerCase().indexOf(query.toLowerCase());
    if (matchIndex === -1) return '';

    const start = Math.max(0, matchIndex - contextLength);
    const end = Math.min(content.length, matchIndex + query.length + contextLength);
    let snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet;
}

function SearchBar({ platformFilter = null, customClass = '' }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isActive, setIsActive] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [dataIndex, setDataIndex] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Load search index when the searchbar is first interacted with
    useEffect(() => {
        if ((isFocused || query.length > 0) && !dataIndex) {
            import('../data/searchIndex.json')
                .then((module) => {
                    setDataIndex(module.default?.items || module.items || []);
                })
                .catch((error) => {
                    console.error("Failed to load search index", error);
                });
        }
    }, [isFocused, query, dataIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsActive(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = useCallback((searchTerm) => {
        if (!dataIndex) return;

        if (searchTerm.length < 2) {
            setResults([]);
            return;
        }

        const lowerQuery = searchTerm.toLowerCase();

        // Filter index
        const matched = dataIndex.filter((item) => {
            // If platformFilter is provided, skip items that don't match
            if (platformFilter && normalizeLabel(item.platform) !== normalizeLabel(platformFilter)) {
                return false;
            }

            return (
                (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
                (item.content && item.content.toLowerCase().includes(lowerQuery)) ||
                (item.platform && item.platform.toLowerCase().includes(lowerQuery))
            );
        });

        const enrichedResults = matched.map((item) => {
            let matchContext = '';

            const inTitle = item.title && item.title.toLowerCase().includes(lowerQuery);

            if (!inTitle && item.content) {
                matchContext = getSnippet(item.content, lowerQuery);
            } else if (item.content) {
                matchContext = item.content.substring(0, 100) + '...';
            }

            return {
                ...item,
                snippet: matchContext
            };
        });

        setResults(enrichedResults.slice(0, 8)); // Return top 8 max
    }, [dataIndex, platformFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    const highlightText = (text, highlight) => {
        if (!highlight.trim()) return text;
        const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="search-highlight">
                    {part}
                </span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    const getIconForSection = (platform) => {
        const normalizedKey = normalizeLabel(platform);
        return CATEGORY_ICONS[normalizedKey] || '/icons/radar.webp';
    };

    return (
        <div className={`searchbar-container ${customClass}`.trim()} ref={dropdownRef}>
            <div className={`search-input-wrapper ${isActive ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder={platformFilter ? `Search ${platformFilter} writeups...` : "Search a keyword..."}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsActive(true);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        if (query.length > 0) setIsActive(true);
                    }}
                />
                {query && (
                    <button className="search-clear" onClick={() => {
                        setQuery('');
                        setResults([]);
                        setIsActive(false);
                    }}>
                        &times;
                    </button>
                )}
            </div>

            {isActive && query.length >= 2 && (
                <div className="search-dropdown">
                    {results.length > 0 ? (
                        <ul className="search-results-list">
                            {results.map((result) => (
                                <li
                                    key={result.id}
                                    className="search-result-item"
                                    onClick={() => {
                                        navigate(`/writeups/${result.slug}?q=${encodeURIComponent(query)}`);
                                        setIsActive(false);
                                    }}
                                >
                                    <div className="search-result-header">
                                        <img
                                            src={getIconForSection(result.platform)}
                                            alt={result.platform}
                                            className="search-result-logo"
                                        />
                                        <span className="search-result-platform">{result.platform}</span>
                                        <span className="search-result-title">{highlightText(result.title, query)}</span>
                                    </div>
                                    {result.snippet && (
                                        <div className="search-result-snippet">
                                            {highlightText(result.snippet, query)}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="search-no-results">
                            No results found for "{query}".
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
