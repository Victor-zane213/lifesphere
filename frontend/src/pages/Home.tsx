import { useState, useEffect } from 'react';
import { getQuotes } from '../services/api';

export default function Home() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getQuotes().then((data) => {
      if (data && data.length > 0) setQuotes(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % quotes.length), 5000);
    return () => window.clearInterval(id);
  }, [quotes.length]);

  const q = quotes[current];

  return (
    <div style={{ paddingTop: '60px', background: '#ffffff', minHeight: '100vh' }}>
      {/* Quote Banner — full background image with left overlay panel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Full background image — use author image or fallback gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: q?.image_url ? `url(${q.image_url})` : 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', position: 'relative', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
          <div>
            {/* Frosted glass panel */}
            <div style={{
              maxWidth: '580px',
              padding: '36px 40px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              {q ? (
                <>
                  <h1 style={{ fontSize: '24px', fontWeight: 300, color: '#fff', lineHeight: 1.7, marginBottom: '16px', fontFamily: "'Noto Serif SC', serif", textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    「{q.content}」
                  </h1>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>
                    — {q.author}
                  </p>
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: '24px', fontWeight: 300, color: '#fff', lineHeight: 1.7, fontFamily: "'Noto Serif SC', serif", textShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    记录生活，沉淀思考
                  </h1>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginTop: '16px' }}>
                    — LifeSphere
                  </p>
                </>
              )}
            </div>

            {/* Dots — centered under the panel */}
            {quotes.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                {quotes.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    style={{
                      width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', border: 'none',
                      background: i === current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'flex', gap: '48px' }}>
          {/* Left: gradient image with glass overlay */}
          <div style={{ width: '360px', flexShrink: 0, position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
            <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=480&q=80" alt="about"
              style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 16px 14px', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', letterSpacing: '1px' }}>LifeSphere</span>
            </div>
          </div>

          {/* Right: text */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 400, color: '#2A2A2A', marginBottom: '20px', fontFamily: "'Noto Serif SC', serif" }}>
              关于我
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666', marginBottom: '16px' }}>
              这里是你的个人空间。记录生活、整理思绪、沉淀感悟。
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666', marginBottom: '16px' }}>
              所有数据存储在本地数据库中，仅你可见，安全私密。
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.8, color: '#666' }}>
              通过 LifeSphere，你可以记录流水账、投资心得、阅读笔记和人生感悟，构建属于你自己的人生编年史。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
