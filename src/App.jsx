import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [info, setInfo] = useState(null);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [bgTheme, setBgTheme] = useState('green');
  const [seo, setSeo] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);

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
      setBgTheme(data.cpu < 40 ? 'green' : 'orange');
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
        { code: infoData.promoCode, discount: infoData.promoDiscount, desc: infoData.seoTitle },
        ...(seoData.additionalPromoCodes || []).map(c => ({
          code: c.code,
          discount: c.discount,
          desc: c.desc
        }))
      ];
      setPromoCodes(allCodes);
    } catch (err) {
      console.error('Error fetching SEO:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCpu();
    fetchSeo();
    const infoInterval = setInterval(fetchData, 30000);
    const cpuInterval = setInterval(fetchCpu, 2000);
    return () => {
      clearInterval(infoInterval);
      clearInterval(cpuInterval);
    };
  }, []);

  // Update document meta tags
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

      // Canonical
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = seo.canonicalUrl;

      // JSON-LD Schema
      let schemaScript = document.getElementById('schema-json-ld');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'schema-json-ld';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      // Will be updated separately via /api/schema
    }
  }, [seo]);

  // Update JSON-LD
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch('/api/schema');
        const schema = await res.json();
        const script = document.getElementById('schema-json-ld');
        if (script) {
          script.textContent = JSON.stringify(schema, null, 2);
        }
      } catch (err) {
        console.error('Error fetching schema:', err);
      }
    };
    fetchSchema();
  }, []);

  return (
    <div className={`app bg-${bgTheme}`}>
      <div className="overlay"></div>
      <div className="content">
        <h1 className="title">{info?.seoTitle || '🎁 Промокоды, Скидки и Купоны'}</h1>

        <div className="card date-card">
          <div className="card-label">Дата</div>
          <div className="card-value">{info?.date}</div>
        </div>

        <div className="card time-card">
          <div className="card-label">Время</div>
          <div className="card-value">{info?.time}</div>
        </div>

        {info?.promoCode && (
          <div className="card promo-banner">
            <div className="card-label">🔥 Ваш промокод на скидку</div>
            <div className="promo-code">{info.promoCode}</div>
            <div className="promo-discount">-{info.promoDiscount}%</div>
          </div>
        )}

        <div className="cards-row">
          <div className="card random-card">
            <div className="card-label">Случайное число</div>
            <div className="card-value">{info?.randomNum ?? '—'}</div>
          </div>

          <div className="card ip-card">
            <div className="card-label">IP адрес</div>
            <div className="card-value">{info?.ip ?? '—'}</div>
          </div>
        </div>

        <div className="card cpu-card">
          <div className="card-label">Загрузка CPU</div>
          <div className="card-value cpu-value">
            {cpuUsage.toFixed(1)}%
          </div>
          <div className="cpu-bar-container">
            <div
              className={`cpu-bar ${bgTheme}`}
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
        </div>

        {/* SEO Promo Codes Section */}
        {seo && (
          <div className="seo-section">
            <h2 className="seo-heading">{seo.h2 || 'Лучшие Актуальные Предложения'}</h2>

            {promoCodes.length > 0 && (
              <div className="promo-grid">
                {promoCodes.map((code, idx) => (
                  <div key={idx} className="promo-item">
                    <div className="promo-item-code">{code.code}</div>
                    <div className="promo-item-desc">{code.desc}</div>
                    {code.discount > 0 && (
                      <div className="promo-item-discount">Скидка {code.discount}%</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {seo.seoContent && seo.seoContent.map((block, idx) => (
              <div key={idx} className="seo-block">
                <h3 className="seo-block-heading">{block.heading}</h3>
                <p className="seo-block-text">{block.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
