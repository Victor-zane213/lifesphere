import { useState, useEffect } from 'react';
import { investmentsApi } from '../services/api';
import ContentCard from '../components/ContentCard';

interface CrudApi {
  list: () => Promise<any[]>;
  create: (data: any) => Promise<any>;
  update: (id: number, data: any) => Promise<any>;
  delete: (id: number) => Promise<any>;
}

export default function Investment() {
  return <ContentPage title="我的投资" api={investmentsApi} />;
}

function ContentPage({ title, api }: { title: string; api: CrudApi }) {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');

  useEffect(() => { load(); }, []);

  function load() {
    api.list().then(setItems).catch(() => {});
  }

  function openNew() {
    setEditing(null);
    setFormTitle('');
    setFormContent('');
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditing(item);
    setFormTitle(item.title);
    setFormContent(item.content);
    setShowForm(true);
  }

  async function handleSave() {
    if (!formTitle.trim()) return;
    if (editing) {
      await api.update(editing.id, { ...editing, title: formTitle.trim(), content: formContent.trim() });
    } else {
      await api.create({ title: formTitle.trim(), content: formContent.trim() });
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('确定删除？')) return;
    await api.delete(id);
    load();
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: '60px' }}>
      <div className="mx-auto px-6 py-10" style={{ maxWidth: '1200px' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-light" style={{ color: '#333' }}>{title}</h1>
          <button
            onClick={openNew}
            className="px-4 py-1.5 text-sm rounded-md cursor-pointer transition-colors"
            style={{ background: '#333', color: '#fff' }}
          >
            + 新增
          </button>
        </div>

        {showForm && (
          <div className="mb-6 p-4 rounded-lg" style={{ background: '#f9f9f9', border: '1px solid #eee' }}>
            <div className="mb-3">
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="标题"
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{ border: '1px solid #ddd', color: '#333' }}
              />
            </div>
            <div className="mb-3">
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="内容"
                className="w-full px-3 py-2 rounded-md text-sm outline-none"
                style={{ border: '1px solid #ddd', color: '#333' }}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-4 py-1.5 text-sm rounded-md cursor-pointer" style={{ background: '#333', color: '#fff' }}>保存</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-1.5 text-sm rounded-md cursor-pointer" style={{ background: '#f0f0f0', color: '#555' }}>取消</button>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {items.map((item) => (
            <ContentCard key={item.id} onEdit={() => openEdit(item)} onDelete={() => handleDelete(item.id)}>
              <h3 className="text-sm font-medium mb-1" style={{ color: '#333' }}>{item.title}</h3>
              {item.content && (
                <p className="text-sm leading-relaxed" style={{ color: '#555' }}>{item.content}</p>
              )}
              {item.created_at && (
                <p className="text-xs mt-2" style={{ color: '#aaa' }}>{new Date(item.created_at).toLocaleDateString('zh-CN')}</p>
              )}
            </ContentCard>
          ))}
          {items.length === 0 && (
            <p className="text-sm" style={{ color: '#aaa' }}>暂无内容</p>
          )}
        </div>
      </div>
    </div>
  );
}

