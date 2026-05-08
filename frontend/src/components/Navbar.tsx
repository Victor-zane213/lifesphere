import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createQuote } from '../services/api';

const menuItems = [
  { path: '/', label: '首页' },
  { path: '/daily-review', label: '我的日复盘' },
  { path: '/investment', label: '我的投资' },
  { path: '/reading', label: '我的阅读' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [showDropdown, setShowDropdown] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleMouseEnter() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setShowDropdown(true);
  }

  function handleMouseLeave() {
    timerRef.current = window.setTimeout(() => setShowDropdown(false), 200);
  }

  async function handleSave() {
    if (!author.trim() || !content.trim()) return;
    setSaving(true);
    try {
      await createQuote({ author: author.trim(), content: content.trim(), image_url: imageUrl.trim() });
      setAuthor(''); setContent(''); setImageUrl('');
      setShowDropdown(false);
    } catch (err) { console.error(err);
    } finally { setSaving(false); }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ height: '60px', background: '#ffffff', borderBottom: isHome ? 'none' : '1px solid #E5E5E5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', gap: '32px' }}>
        {/* Logo */}
        <div ref={dropdownRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <span
            onClick={() => navigate('/')}
            style={{ fontSize: '16px', fontWeight: 500, color: '#2A2A2A', cursor: 'pointer', letterSpacing: '1.5px', fontFamily: "'Noto Serif SC', serif" }}
          >
            LifeSphere
          </span>
          {showDropdown && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', width: '320px', background: '#fff', border: '1px solid #E5E5E5', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '18px' }}>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#666', letterSpacing: '1px', marginBottom: '14px' }}>新增名人语录</p>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '4px' }}>作者</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="如：段永平"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E5E5E5', color: '#2A2A2A', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '4px' }}>语录</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="输入名言名句..." rows={3}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E5E5E5', color: '#2A2A2A', outline: 'none', resize: 'none' }} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '4px' }}>作者图片链接（可选）</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', border: '1px solid #E5E5E5', color: '#2A2A2A', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSave} disabled={saving || !author.trim() || !content.trim()}
                  style={{ padding: '7px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#2A2A2A', color: '#fff', opacity: saving || !author.trim() || !content.trim() ? 0.5 : 1 }}>
                  {saving ? '保存中...' : '保存'}
                </button>
                <button onClick={() => navigate('/settings')}
                  style={{ padding: '7px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', border: '1px solid #E5E5E5', background: '#fff', color: '#666' }}>
                  管理全部
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  padding: '6px 18px',
                  fontSize: '14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  border: 'none',
                  background: isHome && active ? '#2A2A2A' : 'transparent',
                  color: isHome && active ? '#fff' : active ? '#2A2A2A' : '#666',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!(isHome && active)) e.currentTarget.style.color = '#2A2A2A'; }}
                onMouseLeave={(e) => { if (!(isHome && active)) e.currentTarget.style.color = active ? '#2A2A2A' : '#666'; }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
