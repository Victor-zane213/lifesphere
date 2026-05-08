interface Props {
  title?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

export default function ContentCard({ title, onEdit, onDelete, children }: Props) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: '#fff',
        border: '1px solid #eee',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {(title || onEdit || onDelete) && (
        <div className="flex items-center justify-between mb-2">
          {title && <h3 className="text-sm font-medium" style={{ color: '#333' }}>{title}</h3>}
          <div className="flex gap-2">
            {onEdit && (
              <button onClick={onEdit} className="text-xs cursor-pointer" style={{ color: '#888' }}>编辑</button>
            )}
            {onDelete && (
              <button onClick={onDelete} className="text-xs cursor-pointer" style={{ color: '#999' }}>删除</button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
