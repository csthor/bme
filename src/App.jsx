import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [info, setInfo] = useState(null);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [bgTheme, setBgTheme] = useState('gradient-1');
  const [seo, setSeo] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/info');
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      console.error('Error fetching info:', err);
    }
  };

  const fetchCpu = async () => {
    try {
      const res = await fetch('/api/cpu');
      const data = await res.json();
      setCpuUsage(data.cpu);
      const themes = ['gradient-1', 'gradient-2', 'gradient-3'];
      setBgTheme(themes[Math.floor(Math.random() * themes.length)]);
    } catch (err) {
      console.error('Error fetching CPU:', err);
    }
  };

  const fetchSeo = async () => {
    try {
      const [seoRes, infoRes] = await Promise.all([
        fetch('/api/seo'),
        fetch('/api/info')
      ]);
      const seoData = await seoRes.json();
      const infoData = await infoRes.json();
      setSeo(seoData);

      const allCodes = [
        { code: infoData.promoCode, discount: infoData.promoDiscount, desc: infoData.seoTitle, isMain: true },
        ...(seoData.additionalPromoCodes || []).map(c => ({
          code: c.code,
          discount: c.discount,
          desc: c.desc,
          isMain: false
        }))
      ];
      setPromoCodes(allCodes);
    } catch (err) {
      console.error('Error fetching SEO:', err);
    }
  };

  const copyToClipboard = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCpu();
    fetchSeo();
    const infoInterval = setInterval(fetchData, 30000);
    const cpuInterval = setInterval(fetchCpu, 5000);
    return () => {
      clearInterval(infoInterval);
      clearInterval(cpuInterval);
    };
  }, []);

  useEffect(() => {
    if (seo) {
      document.title = seo.title;

      const updateMeta = (name, content, attr = 'name') => {
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute(attr, name);
          document.head.appendChild(el);
        }
        el.content = content;
      };

      updateMeta('description', seo.description);
      updateMeta('keywords', seo.keywords);
      updateMeta('og:title', seo.ogTitle, 'property');
      updateMeta('og:description', seo.ogDescription, 'property');
      updateMeta('og:image', seo.ogImage, 'property');
      updateMeta('twitter:card', 'summary_large_image');
      updateMeta('twitter:title', seo.ogTitle);
      updateMeta('twitter:description', seo.ogDescription);

      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = seo.canonicalUrl;
    }
  }, [seo]);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch('/api/schema');
        const schema = await res.json();
        let script = document.getElementById('schema-json-ld');
        if (!script) {
          script = document.createElement('script');
          script.id = 'schema-json-ld';
          script.type = 'application/ld+json';
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(schema, null, 2);
      } catch (err) {
        console.error('Error fetching schema:', err);
      }
    };
    fetchSchema();
  }, []);

  return (
    <div className={`app ${bgTheme}`}>
      <div className="bg-animation"></div>
      <div className="content">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-icon">🎁</span>
            <h1 className="title">{seo?.h1 || 'Промокоды, Скидки и Купоны'}</h1>
          </div>
          <p className="subtitle">{seo?.description?.substring(0, 100)}...</p>
        </header>

        {/* Featured Promo (Main) */}
        {promoCodes.find(c => c.isMain) && (
          <div className="featured-promo">
            <div className="featured-badge">⭐ Лучший промокод дня</div>
            <div className="featured-code-block">
              <div className="featured-label">{info?.seoTitle}</div>
              <button
                className="featured-code-btn"
                onClick={() => copyToClipboard(promoCodes.find(c => c.isMain)?.code, -1)}
              >
                <span className="code-text">{promoCodes.find(c => c.isMain)?.code}</span>
                <span className={`copy-icon ${copiedIndex === -1 ? 'copied' : ''}`}>
                  {copiedIndex === -1 ? '✓' : '📋'}
                </span>
              </button>
              <div className="featured-discount">
                Скидка до {promoCodes.find(c => c.isMain)?.discount}%
              </div>
            </div>
          </div>
        )}

        {/* Promo Grid */}
        {promoCodes.length > 0 && (
          <div className="promo-section">
            <h2 className="section-title">{seo?.h2 || 'Все промокоды'}</h2>
            <div className="promo-grid">
              {promoCodes.map((code, idx) => (
                <button
                  key={idx}
                  className={`promo-card ${code.isMain ? 'featured' : ''}`}
                  onClick={() => copyToClipboard(code.code, idx)}
                >
                  <div className="promo-card-header">
                    <span className="promo-discount-badge">
                      {code.discount > 0 ? `-${code.discount}%` : 'FREE'}
                    </span>
                    {code.discount === 0 && <span className="promo-free-badge">🚚</span>}
                  </div>
                  <div className="promo-card-code">{code.code}</div>
                  <div className="promo-card-desc">{code.desc}</div>
                  <div className={`copy-status ${copiedIndex === idx ? 'show' : ''}`}>
                    {copiedIndex === idx ? '✓ Скопировано!' : 'Нажмите для копирования'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEO Content */}
        {seo?.seoContent && (
          <div className="seo-section">
            {seo.seoContent.map((block, idx) => (
              <div key={idx} className="seo-block">
                <h3 className="seo-block-heading">{block.heading}</h3>
                <p className="seo-block-text">{block.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 Kupon4UK — Все права защищены</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
