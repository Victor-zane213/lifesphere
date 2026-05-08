import { useState, useEffect } from 'react';
import { getRandomQuote } from '../services/api';

export default function QuoteCarousel() {
  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRandomQuote()
      .then((data) => {
        if (data && data.content) setQuote(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !quote) {
    return (
      <div className="flex items-center justify-center" style={{ height: '200px', background: '#F8F9FA' }}>
        <p style={{ color: '#aaa' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: '200px', background: '#F8F9FA' }}
    >
      <div className="text-center px-6" style={{ maxWidth: '700px' }}>
        <p className="text-lg leading-relaxed" style={{ color: '#555' }}>
          「{quote.content}」
        </p>
        <p className="text-sm mt-3" style={{ color: '#888' }}>
          —— {quote.author}
        </p>
      </div>
    </div>
  );
}
