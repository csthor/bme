import { useState, useEffect } from 'react';
import './Admin.css';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('seo');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // SEO fields
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
    h1: '',
    h2: '',
    seoContent: [],
    additionalPromoCodes: []
  });

  // Main promo
  const [mainPromo, setMainPromo] = useState({
    promoCode: '',
    promoDiscount: 0,
    promoExpiry: '',
    promoDescription: ''
  });

  // Fetch data
  useEffect(() => {
    fetch('/api/seo/all')
      .then(r => r.json())
      .then(data => {
        setSeo({
          title: data.title || '',
          description: data.description || '',
          keywords: data.keywords || '',
          h1: data.h1 || '',
          h2: data.h2 || '',
          seoContent: data.seoContent || [],
          additionalPromoCodes: data.additionalPromoCodes || []
        });
        setMainPromo({
          promoCode: data.promoCode || '',
          promoDiscount: data.promoDiscount || 0,
          promoExpiry: data.promoExpiry || '',
          promoDescription: data.promoDescription || ''
        });
      })
      .catch(err => console.error('Error loading SEO data:', err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...seo,
          ...mainPromo
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Save error:', err);
    }
    setLoading(false);
  };

  const addContentBlock = () => {
    setSeo(prev => ({
      ...prev,
      seoContent: [...prev.seoContent, { heading: '', text: '' }]
    }));
  };

  const updateContentBlock = (idx, field, value) => {
    setSeo(prev => {
      const updated = [...prev.seoContent];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, seoContent: updated };
    });
  };

  const removeContentBlock = (idx) => {
    setSeo(prev => ({
      ...prev,
      seoContent: prev.seoContent.filter((_, i) => i !== idx)
    }));
  };

  const addPromoCode = () => {
    setSeo(prev => ({
      ...prev,
      additionalPromoCodes: [...prev.additionalPromoCodes, { code: '', discount: 0, desc: '', expires: '', active: true }]
    }));
  };

  const updatePromoCode = (idx, field, value) => {
    setSeo(prev => {
      const updated = [...prev.additionalPromoCodes];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, additionalPromoCodes: updated };
    });
  };

  const removePromoCode = (idx) => {
    setSeo(prev => ({
      ...prev,
      additionalPromoCodes: prev.additionalPromoCodes.filter((_, i) => i !== idx)
    }));
  };

  // SEO Preview
  const getSeoScore = () => {
    let score = 0;
    if (seo.title.length > 10 && seo.title.length < 70) score += 20;
    if (seo.description.length > 50 && seo.description.length < 160) score += 20;
    if (seo.keywords.length > 10) score += 15;
    if (seo.h1) score += 15;
    if (seo.seoContent.length > 0) score += 15;
    if (mainPromo.promoCode) score += 15;
    return score;
  };

  const score = getSeoScore();
  const scoreColor = score >= 80 ? '#4caf50' : score >= 50 ? '#ff9800' : '#f44336';

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Админ-панель SEO</h1>
        <div className="admin-header-actions">
          <button
            className={`btn-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : saved ? '✓ Сохранено!' : '💾 Сохранить'}
          </button>
          <button className="btn-logout" onClick={handleLogout}>🚪 Выйти</button>
        </div>
      </div>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <button
            className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            📝 SEO Мета-данные
          </button>
          <button
            className={`tab ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            🎟️ Промокоды
          </button>
          <button
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            📄 SEO Контент
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Предпросмотр
          </button>
        </nav>

        <div className="admin-content">
          {/* SEO Meta Tab */}
          {activeTab === 'seo' && (
            <div className="tab-content">
              <h2>SEO Мета-данные</h2>
              <div className="seo-score" style={{ borderColor: scoreColor }}>
                <div className="score-label">SEO Оптимизация:</div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${score}%`, backgroundColor: scoreColor }}></div>
                </div>
                <div className="score-value">{score}%</div>
              </div>

              <div className="form-group">
                <label>Title (до 60 символов для Google)</label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={e => setSeo(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={70}
                />
                <span className="char-count">{seo.title.length}/70</span>
              </div>

              <div className="form-group">
                <label>Description (до 160 символов)</label>
                <textarea
                  value={seo.description}
                  onChange={e => setSeo(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  maxLength={160}
                />
                <span className="char-count">{seo.description.length}/160</span>
              </div>

              <div className="form-group">
                <label>Keywords (через запятую)</label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={e => setSeo(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="промокод, скидка, купон, акции"
                />
              </div>

              <div className="form-group">
                <label>H1 Заголовок</label>
                <input
                  type="text"
                  value={seo.h1}
                  onChange={e => setSeo(prev => ({ ...prev, h1: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>H2 Подзаголовок</label>
                <input
                  type="text"
                  value={seo.h2}
                  onChange={e => setSeo(prev => ({ ...prev, h2: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Promo Tab */}
          {activeTab === 'promo' && (
            <div className="tab-content">
              <h2>Главный промокод</h2>
              <div className="form-group">
                <label>Код промокода</label>
                <input
                  type="text"
                  value={mainPromo.promoCode}
                  onChange={e => setMainPromo(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
                  placeholder="BESTPROMO2024"
                  style={{ textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 'bold' }}
                />
              </div>

              <div className="form-group">
                <label>Скидка (%)</label>
                <input
                  type="number"
                  value={mainPromo.promoDiscount}
                  onChange={e => setMainPromo(prev => ({ ...prev, promoDiscount: parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={100}
                />
              </div>

              <div className="form-group">
                <label>Дата окончания</label>
                <input
                  type="date"
                  value={mainPromo.promoExpiry}
                  onChange={e => setMainPromo(prev => ({ ...prev, promoExpiry: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={mainPromo.promoDescription}
                  onChange={e => setMainPromo(prev => ({ ...prev, promoDescription: e.target.value }))}
                  rows={2}
                />
              </div>

              <h2 style={{ marginTop: '30px' }}>Дополнительные промокоды</h2>
              {seo.additionalPromoCodes.map((code, idx) => (
                <div key={idx} className="promo-card">
                  <input
                    type="text"
                    placeholder="Код"
                    value={code.code}
                    onChange={e => updatePromoCode(idx, 'code', e.target.value.toUpperCase())}
                    style={{ textTransform: 'uppercase', fontWeight: 'bold', width: '120px' }}
                  />
                  <input
                    type="number"
                    placeholder="%"
                    value={code.discount}
                    onChange={e => updatePromoCode(idx, 'discount', parseInt(e.target.value) || 0)}
                    min={0}
                    max={100}
                    style={{ width: '70px' }}
                  />
                  <input
                    type="text"
                    placeholder="Описание акции"
                    value={code.desc}
                    onChange={e => updatePromoCode(idx, 'desc', e.target.value)}
                  />
                  <input
                    type="date"
                    value={code.expires}
                    onChange={e => updatePromoCode(idx, 'expires', e.target.value)}
                    style={{ width: '140px' }}
                  />
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={code.active}
                      onChange={e => updatePromoCode(idx, 'active', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <button className="btn-delete" onClick={() => removePromoCode(idx)}>✕</button>
                </div>
              ))}
              <button className="btn-add" onClick={addPromoCode}>+ Добавить промокод</button>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="tab-content">
              <h2>SEO Контент (для индексации)</h2>
              <p className="hint">Этот текст отображается внизу главной страницы для поисковых систем.</p>

              {seo.seoContent.map((block, idx) => (
                <div key={idx} className="content-block">
                  <div className="content-block-header">
                    <span>Блок #{idx + 1}</span>
                    <button className="btn-delete" onClick={() => removeContentBlock(idx)}>✕</button>
                  </div>
                  <div className="form-group">
                    <label>H3 Заголовок</label>
                    <input
                      type="text"
                      value={block.heading}
                      onChange={e => updateContentBlock(idx, 'heading', e.target.value)}
                      placeholder="Почему наши промокоды лучшие?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Текст (минимум 100 слов для SEO)</label>
                    <textarea
                      value={block.text}
                      onChange={e => updateContentBlock(idx, 'text', e.target.value)}
                      rows={5}
                      placeholder="Подробное описание с ключевыми словами: промокод, скидка, купон, акция..."
                    />
                    <span className="word-count">{block.text.split(/\s+/).filter(Boolean).length} слов</span>
                  </div>
                </div>
              ))}
              <button className="btn-add" onClick={addContentBlock}>+ Добавить блок</button>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="tab-content">
              <h2>Предпросмотр в Google</h2>

              <div className="google-preview">
                <div className="gp-url">https://kupon4uk.ru</div>
                <div className="gp-title">{seo.title || 'Ваш заголовок здесь...'}</div>
                <div className="gp-description">{seo.description || 'Ваше описание мета...'}</div>
              </div>

              <h2 style={{ marginTop: '30px' }}>Предпросмотр главной страницы</h2>

              <div className="page-preview">
                <div className="preview-card">
                  <div className="preview-label">H1 Заголовок</div>
                  <div className="preview-value">{seo.h1 || '—'}</div>
                </div>
                <div className="preview-card">
                  <div className="preview-label">H2 Подзаголовок</div>
                  <div className="preview-value">{seo.h2 || '—'}</div>
                </div>
                <div className="preview-card promo-preview">
                  <div className="preview-label">Главный промокод</div>
                  <div className="preview-value">
                    {mainPromo.promoCode || '—'} {mainPromo.promoDiscount ? `(-${mainPromo.promoDiscount}%)` : ''}
                  </div>
                </div>
              </div>

              <div className="seo-tips">
                <h3>💡 Советы по SEO</h3>
                <ul>
                  <li>Title должен содержать ключевые слова: <strong>промокод, скидка, купон</strong></li>
                  <li>Description должен быть уникальным и содержать призыв к действию</li>
                  <li>Каждый контент-блок должен содержать минимум 100 слов</li>
                  <li>Используйте ключевые слова в заголовках H1, H2, H3</li>
                  <li>Регулярно обновляйте промокоды — свежий контент лучше индексируется</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
