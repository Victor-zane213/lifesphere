import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getYears, createYear } from '../services/api';

const bookColors = {
  '流水账': { spine: '#7a8a6f', cover: '#e8efe3', text: '#4a5a3f' },
  '感悟': { spine: '#8b7d6b', cover: '#f5f0e8', text: '#5a4a3a' },
  '改变行动': { spine: '#6f7a8a', cover: '#e3e8ef', text: '#3f4a5a' },
};

function Book3D({ label, desc, onClick, disabled }: { label: string; desc: string; onClick: () => void; disabled: boolean }) {
  const colors = bookColors[label as keyof typeof bookColors] || bookColors['感悟'];
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ perspective: '1000px', flex: 1, maxWidth: '240px' }}>
      <div style={{
        transformStyle: 'preserve-3d',
        transform: hovered && !disabled
          ? 'rotateX(-2deg) rotateY(-12deg) translateY(-8px)'
          : 'rotateX(-4deg) rotateY(-18deg)',
        transition: 'transform 0.4s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
      }}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => { if (!disabled) setHovered(true); }}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Book block */}
        <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
          {/* Page edges (right) */}
          <div style={{
            position: 'absolute', right: '-16px', top: '3px', width: '16px', height: '100%',
            background: 'linear-gradient(to left, #ddd5c8, #e8e0d3)',
            transformOrigin: 'left center',
            transform: 'rotateY(3deg)',
            borderRadius: '0 3px 3px 0',
          }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 11}%`, height: '1px', background: 'rgba(200,190,175,0.3)' }} />
            ))}
          </div>
          {/* Spine */}
          <div style={{
            position: 'absolute', left: '-8px', top: '3px', width: '8px', height: '100%',
            background: `linear-gradient(to right, ${colors.spine}, ${colors.spine}cc)`,
            transformOrigin: 'right center',
            transform: 'rotateY(-2deg)',
            borderRadius: '3px 0 0 3px',
          }} />
          {/* Cover */}
          <div style={{
            padding: '40px 16px 32px',
            borderRadius: '2px 6px 6px 2px',
            background: `linear-gradient(135deg, ${colors.cover}, ${colors.cover}dd)`,
            boxShadow: '0 4px 20px rgba(90,74,58,0.15)',
            textAlign: 'center',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <p style={{ fontSize: '15px', color: colors.text, letterSpacing: '2px', marginBottom: '8px', fontFamily: "'Noto Serif SC', serif" }}>
              {label}
            </p>
            <p style={{ fontSize: '12px', color: '#a09080' }}>{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DailyReview() {
  const navigate = useNavigate();
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [editingYear, setEditingYear] = useState(false);
  const [yearInput, setYearInput] = useState('');

  useEffect(() => {
    getYears().then((data) => {
      setYears(data);
      if (data.length > 0) setSelectedYear(data[0]);
    }).catch(() => {});
  }, []);

  function handleYearClick() {
    if (selectedYear) {
      setYearInput(String(selectedYear));
      setEditingYear(true);
    }
  }

  function handleYearSave() {
    const y = parseInt(yearInput);
    if (!isNaN(y) && y >= 1900 && y <= 2100) {
      if (!years.includes(y)) { createYear(y); }
      getYears().then((data) => { if (data) setYears(data); });
      setSelectedYear(y);
    }
    setEditingYear(false);
  }

  async function handleCreateYear() {
    const y = prompt('输入年份：', String(new Date().getFullYear()));
    if (y) {
      const num = parseInt(y);
      if (!isNaN(num) && num >= 1900 && num <= 2100) {
        await createYear(num);
        setYears((await getYears()) || []);
        setSelectedYear(num);
      }
    }
  }

  const books = [
    { label: '感悟', desc: '所思所想', onClick: () => navigate(`/reflections?year=${selectedYear}`) },
    { label: '流水账', desc: '日常记录', onClick: () => alert('流水账功能开发中') },
    { label: '改变行动', desc: '行动改变', onClick: () => alert('改变行动功能开发中') },
  ];

  return (
    <div style={{ paddingTop: '60px', background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Left sidebar */}
        <div style={{ width: '200px', borderRight: '1px solid #E5E5E5', padding: '36px 16px', background: '#F8F6F3', flexShrink: 0 }}>
          <p style={{ fontSize: '11px', color: '#999', letterSpacing: '2px', marginBottom: '16px', paddingLeft: '8px' }}>年份</p>
          {years.map((year) => (
            <button key={year} onClick={() => setSelectedYear(year)}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: '8px', fontSize: '14px',
                marginBottom: '2px', border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                background: selectedYear === year ? '#2A2A2A' : 'transparent',
                color: selectedYear === year ? '#fff' : '#666',
                fontFamily: selectedYear === year ? "'Noto Serif SC', serif" : "'Noto Sans SC', sans-serif",
                fontWeight: selectedYear === year ? 400 : 300,
              }}>
              {year}
            </button>
          ))}
          {years.length === 0 && <p style={{ fontSize: '12px', color: '#bbb', paddingLeft: '8px' }}>暂无年份</p>}

          <button onClick={handleCreateYear}
            style={{ width: 'calc(100% - 16px)', margin: '16px 8px 0', padding: '8px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '1px dashed #d0d0d0', background: 'transparent', color: '#aaa', transition: 'all 0.2s' }}>
            + 添加年份
          </button>
        </div>

        {/* Main content — 3 books */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '48px 40px 80px', background: '#f5f0e8' }}>
          <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: 400, color: '#2A2A2A', marginBottom: '6px', fontFamily: "'Noto Serif SC', serif" }}>
                  我的日复盘
                </h1>
                {editingYear ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input type="number" value={yearInput} onChange={(e) => setYearInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleYearSave()}
                      style={{ width: '100px', padding: '4px 10px', borderRadius: '6px', fontSize: '14px', border: '1px solid #d4c9b5', color: '#5a4a3a', outline: 'none' }}
                      autoFocus />
                    <button onClick={handleYearSave} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: 'none', background: '#5a4a3a', color: '#f5f0e8' }}>确定</button>
                    <button onClick={() => setEditingYear(false)} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: '1px solid #d4c9b5', background: '#faf6ef', color: '#8b7d6b' }}>取消</button>
                  </div>
                ) : (
                  <p style={{ fontSize: '14px', color: '#666', cursor: selectedYear ? 'pointer' : 'default' }}
                    onClick={handleYearClick}>
                    {selectedYear ? `${selectedYear} 年` : '请选择年份'} {selectedYear && <span style={{ fontSize: '11px', color: '#bbb' }}>✎</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Three books */}
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start' }}>
              {books.map((book) => (
                <Book3D key={book.label} label={book.label} desc={book.desc} onClick={book.onClick} disabled={!selectedYear} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
