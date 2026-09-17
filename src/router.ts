import { useState, useEffect } from 'react';

export interface ParsedRoute {
  path: string;
  params: Record<string, string>;
  fullHash: string;
}

export function parseHash(hash: string): ParsedRoute {
  // Clean hash: trim leading '#' and '/'
  let cleanHash = hash.replace(/^#\/?/, '');
  if (!cleanHash) {
    cleanHash = '';
  }

  // Separate route path from query parameters
  const [routePart, queryString] = cleanHash.split('?');
  const params: Record<string, string> = {};
  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  const parts = (routePart || '').split('/').filter(Boolean);

  // Simple matching logic
  // e.g. services/bridal-makeup -> path = "services/:slug", params = { slug: "bridal-makeup" }
  if (parts[0] === 'services' && parts[1]) {
    return {
      path: 'services/:slug',
      params: { ...params, slug: parts[1] },
      fullHash: hash
    };
  }

  if (parts[0] === 'artists' && parts[1]) {
    return {
      path: 'artists/:slug',
      params: { ...params, slug: parts[1] },
      fullHash: hash
    };
  }

  if (parts[0] === 'booking' && parts[1]) {
    return {
      path: 'booking',
      params: { ...params, service: parts[1] },
      fullHash: hash
    };
  }

  // Fallback to exact path mapping
  return {
    path: routePart || 'home',
    params,
    fullHash: hash
  };
}

export function useHashRoute() {
  const [route, setRoute] = useState<ParsedRoute>(() => {
    // If there's no hash but there is a pathname (like from Vercel fallback), migrate to hash
    let initialHash = window.location.hash;
    if (!initialHash && window.location.pathname && window.location.pathname !== '/') {
      initialHash = '#' + window.location.pathname;
      window.history.replaceState(null, '', '/' + initialHash);
    }
    return parseHash(initialHash);
  });

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
      // Scroll to top of page on hash transition for professional feel
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (hashPath: string) => {
    window.location.hash = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
  };

  return { ...route, navigate };
}
