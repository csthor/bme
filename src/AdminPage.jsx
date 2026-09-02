import { useState, useEffect } from 'react';
import './Admin.css';
import { Settings, Save, LogOut, FileText, Ticket, Eye, Lightbulb, Store, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import Seo from './Seo';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('seo');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [catalog, setCatalog] = useState({ promos: [], stores: [], updatedAt: null });
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

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

  const loadCatalog = async () => {
    setCatalogLoading(true);
    try {
      const response = await fetch('/api/admin/catalog');
      if (response.ok) setCatalog(await response.json());
    } finally { setCatalogLoading(false); }
  };

  useEffect(() => { if (activeTab === 'catalog') loadCatalog(); }, [activeTab]);

  const updatePromoState = async (id, patch) => {
    const response = await fetch(`/api/admin/promos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
    if (response.ok) await loadCatalog();
  };

  const publishPromos = async (promos) => {
    if (!promos.length) return;
    const confirmed = window.confirm(`Опубликовать промокоды: ${promos.length} шт.?`);
    if (!confirmed) return;
    setBulkLoading(true);
    try {
      const response = await fetch('/api/admin/promos/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: promos.map((promo) => promo.id),
          status: 'approved',
          verificationStatus: 'valid'
        })
      });
      if (response.ok) await loadCatalog();
    } finally {
      setBulkLoading(false);
    }
  };

  const exportPromos = () => {
    window.location.href = '/api/admin/promos/export';
  };

  const importPromos = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setImportLoading(true);
    try {
      const payload = JSON.parse(await file.text());
      const items = Array.isArray(payload) ? payload : payload.items;
      if (!Array.isArray(items) || !items.length) throw new Error('В файле нет items');
      const response = await fetch('/api/import/promos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.errors?.length ? `Ошибок: ${result.errors.length}` : result.error || 'Импорт не выполнен');
      await loadCatalog();
      window.alert(`Импортировано: ${result.imported}. Всего в базе: ${result.total}.`);
    } catch (error) {
      window.alert(`Ошибка импорта: ${error.message}`);
    } finally { setImportLoading(false); }
  };

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
  const isPublished = (promo) => promo.status === 'approved' && promo.verificationStatus === 'valid';
  const filteredPromos = catalog.promos.filter((promo) => catalogFilter === 'all' || (catalogFilter === 'published' ? isPublished(promo) : !isPublished(promo)));
  const publishablePromos = filteredPromos.filter((promo) => !isPublished(promo));

  return (
    <div className="admin-page">
      <Seo title="Админ-панель — Kupon4UK" description="Управление каталогом Kupon4UK." path="/admin" noindex />
      <div className="admin-header">
        <h1 className="flex items-center gap-2"><Settings className="w-5 h-5" aria-hidden="true" /> Админ-панель SEO</h1>
        <div className="admin-header-actions">
          <button
            className={`btn-save ${saved ? 'saved' : ''}`}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : saved ? 'Сохранено' : <><Save className="w-4 h-4 inline mr-1" aria-hidden="true" />Сохранить</>}
          </button>
          <button className="btn-logout" onClick={handleLogout}><LogOut className="w-4 h-4 inline mr-1" aria-hidden="true" />Выйти</button>
        </div>
      </div>

      <div className="admin-layout">
        <nav className="admin-sidebar">
          <button
            className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <FileText className="w-4 h-4 inline mr-1" aria-hidden="true" /> SEO Мета-данные
          </button>
          <button
            className={`tab ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            <Ticket className="w-4 h-4 inline mr-1" aria-hidden="true" /> Промокоды
          </button>
          <button className={`tab ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
            <Store className="w-4 h-4 inline mr-1" aria-hidden="true" /> Каталог сайта
          </button>
          <button
            className={`tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText className="w-4 h-4 inline mr-1" aria-hidden="true" /> SEO Контент
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye className="w-4 h-4 inline mr-1" aria-hidden="true" /> Предпросмотр
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

          {activeTab === 'catalog' && (
            <div className="tab-content catalog-content">
              <div className="catalog-heading">
                <div><h2>Каталог сайта</h2><p className="hint">Здесь отображаются все загруженные промокоды, включая ожидающие проверки.</p></div>
                <div className="catalog-actions">
                  <button className="btn-add" onClick={exportPromos}><FileText className="w-4 h-4 inline mr-1" /> Выгрузить JSON</button>
                  <label className="btn-add" style={{ cursor: importLoading ? 'wait' : 'pointer' }}><input type="file" accept="application/json,.json" onChange={importPromos} disabled={importLoading} style={{ display: 'none' }} />{importLoading ? 'Загрузка...' : 'Загрузить JSON'}</label>
                  <button className="btn-add" onClick={() => publishPromos(publishablePromos)} disabled={bulkLoading || catalogLoading || publishablePromos.length === 0}><CheckCircle className="w-4 h-4 inline mr-1" /> {bulkLoading ? 'Публикую...' : `Опубликовать все (${publishablePromos.length})`}</button>
                  <button className="btn-add" onClick={loadCatalog} disabled={catalogLoading}><RefreshCw className="w-4 h-4 inline mr-1" /> Обновить</button>
                </div>
              </div>
              <div className="catalog-stats"><div><strong>{catalog.promos.length}</strong><span>Всего промокодов</span></div><div><strong>{catalog.promos.filter(isPublished).length}</strong><span>Опубликовано</span></div><div><strong>{catalog.promos.filter(p => !isPublished(p)).length}</strong><span>На проверке</span></div><div><strong>{catalog.stores.length}</strong><span>Магазинов</span></div></div>
              <div className="catalog-filters"><button className={catalogFilter === 'all' ? 'active' : ''} onClick={() => setCatalogFilter('all')}>Все</button><button className={catalogFilter === 'published' ? 'active' : ''} onClick={() => setCatalogFilter('published')}>Опубликованные</button><button className={catalogFilter === 'review' ? 'active' : ''} onClick={() => setCatalogFilter('review')}>На проверке</button></div>
              <div className="admin-promo-list">{filteredPromos.map(p => <div className="admin-promo-row" key={p.id}><div className="admin-promo-icon">{p.iconUrl ? <img src={p.iconUrl} alt="" /> : <Store className="w-5 h-5" />}</div><div className="admin-promo-main"><strong>{p.store}</strong><span>{p.title || 'Без названия'} {p.code && `· ${p.code}`}</span><small>{p.description}</small></div><div className="admin-promo-meta"><span className={isPublished(p) ? 'state published' : 'state review'}>{isPublished(p) ? <><CheckCircle className="w-3 h-3" /> Опубликован</> : <><Clock className="w-3 h-3" /> На проверке</>}</span><span>Раскрытий: {p.usedCount || 0}</span></div><div className="admin-promo-actions">{!isPublished(p) && <button onClick={() => updatePromoState(p.id, { status: 'approved', verificationStatus: 'valid' })}>Опубликовать</button>}{isPublished(p) && <button className="danger" onClick={() => updatePromoState(p.id, { status: 'pending', verificationStatus: 'unverified' })}>Снять</button>}</div></div>)}</div>
              {!catalog.promos.length && <div className="empty-state"><XCircle className="w-6 h-6" /> Данные не загрузились или каталог пуст.</div>}
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
                <h3><Lightbulb className="w-4 h-4 inline mr-1" aria-hidden="true" /> Советы по SEO</h3>
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
