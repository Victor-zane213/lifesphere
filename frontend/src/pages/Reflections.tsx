import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getDailyReflections, createDailyReflection, deleteDailyReflection } from '../services/api';

function fmtDate(d: string) {
  const date = new Date(d);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${weekdays[date.getDay()]}`;
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function Reflections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const yearParam = searchParams.get('year');

  const [entries, setEntries] = useState<any[]>([]);
  const [date, setDate] = useState(getToday());
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const [flipAnim, setFlipAnim] = useState<'next' | 'prev' | null>(null);
  const [reading, setReading] = useState(false);

  const currentYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

  useEffect(() => {
    getDailyReflections(currentYear).then((data) => {
      setEntries(data); setPageIdx(0); setFlipAnim(null);
      if (data.length > 0) setReading(true);
    }).catch(() => {});
  }, [currentYear]);

  function changeYear(y: number) {
    setSearchParams({ year: String(y) });
  }

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    await createDailyReflection({ content: content.trim(), date, year: currentYear });
    setContent(''); setShowEditor(false); setSaving(false);
    getDailyReflections(currentYear).then((data) => { setEntries(data); setPageIdx(0); }).catch(() => {});
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    await deleteDailyReflection(id);
    getDailyReflections(currentYear).then((data) => {
      setEntries(data);
      const maxIdx = data.length - 1;
      setPageIdx((p) => Math.min(p, maxIdx));
    }).catch(() => {});
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  function flipTo(dir: 'next' | 'prev') {
    if (flipAnim) return;
    const targetIdx = dir === 'next' ? pageIdx + 1 : pageIdx - 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    setFlipAnim(dir);
    setTimeout(() => {
      setPageIdx(targetIdx);
      setFlipAnim(null);
    }, 900);
  }

  const curEntry = sorted[pageIdx];

  return (
    <div style={{ paddingTop: '60px', background: '#ebe3d5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <button onClick={() => navigate(-1)} style={{ fontSize: '13px', color: '#8b7d6b', cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}>← 返回</button>
          <button onClick={() => setShowEditor(true)} style={{ padding: '6px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', border: '1px solid #d4c9b5', background: '#faf6ef', color: '#8b7d6b' }}>✎ 写一篇</button>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {[2024, 2025, 2026, 2027, 2028].map((y) => (
            <button key={y} onClick={() => changeYear(y)}
              style={{ padding: '4px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', border: 'none', background: y === currentYear ? '#5a4a3a' : 'transparent', color: y === currentYear ? '#f5f0e8' : '#a09080' }}>{y}
            </button>
          ))}
        </div>

        {showEditor && (
          <div style={{ marginBottom: '32px', padding: '20px', borderRadius: '8px', background: '#faf6ef', border: '1px solid #e0d6c4' }}>
            <div style={{ marginBottom: '10px' }}>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '13px', border: '1px solid #d4c9b5', color: '#5a4a3a', outline: 'none', background: '#fff' }} />
            </div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下今天的感悟..." rows={4}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '6px', fontSize: '14px', border: '1px solid #d4c9b5', color: '#5a4a3a', outline: 'none', resize: 'vertical', lineHeight: 1.8, background: '#fff', marginBottom: '10px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave} disabled={saving || !content.trim()} style={{ padding: '7px 20px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#5a4a3a', color: '#f5f0e8', opacity: saving || !content.trim() ? 0.4 : 1 }}>{saving ? '保存中...' : '保存'}</button>
              <button onClick={() => setShowEditor(false)} style={{ padding: '7px 20px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', border: '1px solid #d4c9b5', background: '#faf6ef', color: '#8b7d6b' }}>取消</button>
            </div>
          </div>
        )}

        {/* 3D Book */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{ perspective: '1200px' }}>
            <div style={{
              transform: reading ? 'rotateX(0deg) rotateY(0deg) skewY(0deg)' : 'rotateX(-5deg) rotateY(-18deg) skewY(1deg)',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '580px',
            }}>
              <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
                {/* Page edges thickness */}
                <div style={{
                  position: 'absolute', right: '-28px', top: '4px', width: '28px', height: '100%',
                  background: 'linear-gradient(to left, #e8ddd0, #f0e8db)',
                  transform: reading ? 'rotateY(0deg)' : 'rotateY(3deg)',
                  transformOrigin: 'left center',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '0 4px 4px 0',
                }}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 6}%`, height: '1px', background: 'rgba(200,190,175,0.3)' }} />
                  ))}
                </div>
                <div style={{
                  position: 'absolute', left: '4px', bottom: '-24px', height: '24px', width: 'calc(100% - 28px)',
                  background: 'linear-gradient(to top, #e0d5c5, #f0e8db)',
                  transform: reading ? 'rotateX(0deg)' : 'rotateX(3deg)',
                  transformOrigin: 'top center',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '0 0 4px 4px',
                }} />
                <div style={{
                  position: 'absolute', left: '-12px', top: '4px', width: '12px', height: '100%',
                  background: 'linear-gradient(to right, #8b7d6b, #a09080)',
                  transform: reading ? 'rotateY(0deg)' : 'rotateY(-2deg)',
                  transformOrigin: 'right center',
                  transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '4px 0 0 4px',
                }} />

                {/* Book page area */}
                <div style={{
                  position: 'relative',
                  padding: '36px 40px 32px',
                  borderRadius: '2px 8px 8px 2px',
                  background: reading
                    ? 'linear-gradient(165deg, #f5f0e8 0%, #faf6ef 40%, #f7f2ea 100%)'
                    : 'linear-gradient(165deg, #f0e8db 0%, #f5f0e8 40%, #f2ebdf 100%)',
                  boxShadow: reading
                    ? '0 2px 30px rgba(90,74,58,0.12)'
                    : '0 8px 40px rgba(90,74,58,0.18)',
                  minHeight: reading ? '300px' : '340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: reading ? 'flex-start' : 'center',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                }}>
                  {reading && curEntry ? (
                    <div style={{ position: 'relative', minHeight: '300px' }}>
                      {/* Behind page (shown during flip) */}
                      {(flipAnim === 'next' && sorted[pageIdx + 1]) ? (
                        <div style={{ position: 'absolute', inset: '-36px -40px -32px', padding: '36px 40px 32px', background: 'linear-gradient(165deg, #f5f0e8 0%, #faf6ef 40%, #f7f2ea 100%)', zIndex: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '11px', color: '#b8aa96', fontFamily: "'Noto Serif SC', serif" }}>{fmtDate(sorted[pageIdx + 1].date)}</span>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #e0d6c4, transparent)' }} />
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: 2.2, color: '#5a4a3a', whiteSpace: 'pre-wrap', fontFamily: "'Noto Serif SC', serif", fontWeight: 300 }}>
                            {sorted[pageIdx + 1].content}
                          </p>
                          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(90,74,58,0.06)' }} />
                        </div>
                      ) : (flipAnim === 'prev' && sorted[pageIdx - 1]) ? (
                        <div style={{ position: 'absolute', inset: '-36px -40px -32px', padding: '36px 40px 32px', background: 'linear-gradient(165deg, #f5f0e8 0%, #faf6ef 40%, #f7f2ea 100%)', zIndex: 2 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '11px', color: '#b8aa96', fontFamily: "'Noto Serif SC', serif" }}>{fmtDate(sorted[pageIdx - 1].date)}</span>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #e0d6c4, transparent)' }} />
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: 2.2, color: '#5a4a3a', whiteSpace: 'pre-wrap', fontFamily: "'Noto Serif SC', serif", fontWeight: 300 }}>
                            {sorted[pageIdx - 1].content}
                          </p>
                          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(90,74,58,0.06)' }} />
                        </div>
                      ) : null}

                      {/* Flipping page (animated) */}
                      {flipAnim && (
                        <div className={`page-flip-${flipAnim}`} style={{
                          position: 'absolute', inset: '-36px -40px -32px',
                          padding: '36px 40px 32px',
                          borderRadius: '2px 8px 8px 2px',
                          background: 'linear-gradient(165deg, #faf6ef 0%, #f5f0e8 100%)',
                          boxShadow: '0 2px 30px rgba(90,74,58,0.15)',
                          zIndex: 4,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '11px', color: '#b8aa96', fontFamily: "'Noto Serif SC', serif" }}>{fmtDate(curEntry.date)}</span>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #e0d6c4, transparent)' }} />
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: 2.2, color: '#5a4a3a', whiteSpace: 'pre-wrap', fontFamily: "'Noto Serif SC', serif", fontWeight: 300 }}>
                            {curEntry.content}
                          </p>
                          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(90,74,58,0.06)' }} />
                        </div>
                      )}

                      {/* Current page */}
                      <div style={{ position: 'relative', zIndex: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                          <span style={{ fontSize: '11px', color: '#b8aa96', fontFamily: "'Noto Serif SC', serif" }}>{fmtDate(curEntry.date)}</span>
                          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #e0d6c4, transparent)' }} />
                        </div>
                        <p style={{ fontSize: '14px', lineHeight: 2.2, color: '#5a4a3a', whiteSpace: 'pre-wrap', fontFamily: "'Noto Serif SC', serif", fontWeight: 300, letterSpacing: '0.3px' }}>
                          {curEntry.content}
                        </p>
                        <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid rgba(90,74,58,0.06)' }} />
                      </div>
                    </div>
                  ) : (
                    /* Cover view */
                    <div style={{ textAlign: 'center' }}>
                      <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#5a4a3a', fontFamily: "'Noto Serif SC', serif", marginBottom: '8px' }}>
                        感悟 · {currentYear}
                      </h1>
                      <p style={{ fontSize: '14px', color: '#a09080', marginBottom: '24px', fontStyle: 'italic' }}>
                        {sorted.length > 0 ? `共 ${sorted.length} 篇感悟` : '这本感悟集还是空的'}
                      </p>
                      {sorted.length > 0 ? (
                        <button onClick={() => setReading(true)}
                          style={{ padding: '10px 32px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', border: 'none', background: '#5a4a3a', color: '#f5f0e8', letterSpacing: '1px', boxShadow: '0 2px 12px rgba(90,74,58,0.2)' }}>
                          📖 阅读
                        </button>
                      ) : (
                        <button onClick={() => setShowEditor(true)}
                          style={{ padding: '10px 32px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', border: '1px solid #d4c9b5', background: '#faf6ef', color: '#8b7d6b' }}>
                          ✎ 写下第一篇
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flip navigation */}
        {reading && sorted.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <button onClick={() => flipTo('prev')} disabled={pageIdx === 0 || flipAnim !== null}
              style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', cursor: pageIdx > 0 && !flipAnim ? 'pointer' : 'not-allowed', border: '1px solid #d4c9b5', background: '#faf6ef', color: pageIdx > 0 ? '#8b7d6b' : '#d4c9b5', opacity: pageIdx > 0 ? 1 : 0.4 }}>
              ◀ 上一页
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              {sorted.map((_, i) => (
                <button key={i} onClick={() => { if (!flipAnim) setPageIdx(i); }}
                  style={{ width: i === pageIdx ? '20px' : '6px', height: '6px', borderRadius: '3px', border: 'none', background: i === pageIdx ? '#5a4a3a' : '#d4c9b5', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
            <button onClick={() => flipTo('next')} disabled={pageIdx === sorted.length - 1 || flipAnim !== null}
              style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', cursor: pageIdx < sorted.length - 1 && !flipAnim ? 'pointer' : 'not-allowed', border: '1px solid #d4c9b5', background: '#faf6ef', color: pageIdx < sorted.length - 1 ? '#8b7d6b' : '#d4c9b5', opacity: pageIdx < sorted.length - 1 ? 1 : 0.4 }}>
              下一页 ▶
            </button>
            <button onClick={() => setReading(false)} style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: 'none', background: 'transparent', color: '#b8aa96' }}>收起</button>
          </div>
        )}

        {/* Page info & delete — below navigation */}
        {reading && curEntry && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '12px' }}>
            <span style={{ fontSize: '12px', color: '#b8aa96', fontFamily: "'Noto Serif SC', serif" }}>
              {pageIdx + 1} / {sorted.length}
            </span>
            <span style={{ fontSize: '10px', color: '#d4c9b5' }}>|</span>
            <button onClick={() => { if (!flipAnim) handleDelete(curEntry.id); }}
              style={{ fontSize: '12px', cursor: 'pointer', border: 'none', background: 'none', color: '#c8bca8', padding: 0 }}>
              删除此篇
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
