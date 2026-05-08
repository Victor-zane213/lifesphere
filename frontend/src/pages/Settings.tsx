import { useState, useEffect } from 'react';
import { getQuotes, createQuote, updateQuote, deleteQuote } from '../services/api';

export default function Settings() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => { loadQuotes(); }, []);

  function loadQuotes() { getQuotes().then(setQuotes).catch(() => {}); }

  function openNew() { setEditing(null); setContent(''); setAuthor(''); setImageUrl(''); setShowForm(true); }

  function openEdit(q: any) { setEditing(q); setContent(q.content); setAuthor(q.author); setImageUrl(q.image_url || ''); setShowForm(true); }

  async function handleSave() {
    if (!content.trim()) return;
    const data = { content: content.trim(), author: author.trim(), image_url: imageUrl.trim() };
    if (editing) await updateQuote(editing.id, { ...editing, ...data });
    else await createQuote(data);
    setShowForm(false); loadQuotes();
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    await deleteQuote(id); loadQuotes();
  }

  return (
    <div style={{ paddingTop: '60px', background: '#ffffff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 400, color: '#2A2A2A', marginBottom: '36px', fontFamily: "'Noto Serif SC', serif" }}>
          设置
        </h1>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 500, color: '#2A2A2A' }}>名人语录管理</h2>
            <button onClick={openNew}
              style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#2A2A2A', color: '#fff', transition: 'background 0.2s' }}>
              + 新增语录
            </button>
          </div>

          {showForm && (
            <div style={{ marginBottom: '20px', padding: '20px', borderRadius: '10px', background: '#F8F6F3' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>语录内容</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid #E5E5E5', color: '#2A2A2A', outline: 'none', resize: 'none' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>作者</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid #E5E5E5', color: '#2A2A2A', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>作者图片链接（可选）</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', border: '1px solid #E5E5E5', color: '#2A2A2A', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleSave} disabled={!content.trim()}
                  style={{ padding: '8px 22px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', border: 'none', background: '#2A2A2A', color: '#fff', opacity: content.trim() ? 1 : 0.4 }}>
                  保存
                </button>
                <button onClick={() => setShowForm(false)}
                  style={{ padding: '8px 22px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', border: '1px solid #E5E5E5', background: '#fff', color: '#666' }}>
                  取消
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quotes.map((q) => (
              <div key={q.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '10px', background: '#F8F6F3' }}>
                <div style={{ flex: 1, minWidth: 0, marginRight: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#2A2A2A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    「{q.content}」
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>—— {q.author}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => openEdit(q)} style={{ padding: '5px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: '1px solid #E5E5E5', background: '#fff', color: '#666' }}>
                    编辑
                  </button>
                  <button onClick={() => handleDelete(q.id)} style={{ padding: '5px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: '1px solid #E5E5E5', background: '#fff', color: '#999' }}>
                    删除
                  </button>
                </div>
              </div>
            ))}
            {quotes.length === 0 && (
              <p style={{ fontSize: '14px', color: '#bbb', textAlign: 'center', padding: '32px 0' }}>暂无语录</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
