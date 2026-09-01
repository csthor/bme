import { useEffect } from 'react';

export default function Seo({ title, description, path = '/', noindex = false, type = 'website' }) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let node = document.head.querySelector(selector);
      if (!node) { node = document.createElement('meta'); node.setAttribute(property ? 'property' : 'name', name); document.head.appendChild(node); }
      node.setAttribute('content', content);
    };
    setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('og:title', title, true); setMeta('og:description', description, true); setMeta('og:type', type, true); setMeta('og:url', `https://kupon4uk.ru${path}`, true);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `https://kupon4uk.ru${path}`;
    
    // Yandex.Metrika pageview tracking on route change
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(112142650, 'hit', document.location.href);
    }
  }, [title, description, path, noindex, type]);
  return null;
}
