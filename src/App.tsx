import { useState } from 'react';
import { DataItem } from './types';

const App = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DataItem[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processFile = async (file: File) => {
    try {
      setLoading(true);
      const text = await file.text();
      const items = text.split('\n')
        .filter(line => line.trim())
        .map((content, idx) => ({
          id: `${idx}`,
          content,
          source: file.name,
        }));
      setData(prev => [...prev, ...items]);
      setError('');
    } catch (err) {
      setError('Error processing file');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || data.length === 0) return;
    try {
      setLoading(true);
      const filtered = data.filter(item =>
        item.content.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setSummary(`Found ${filtered.length} results for "${query}"`);
      setError('');
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">RAG Search</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-4">
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg"
              accept=".txt,.json,.csv"
            />
          </div>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter search query..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {summary && <div className="text-green-600 mb-4">{summary}</div>}
        </div>
        
        <div className="space-y-4">
          {results.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-800">{item.content}</p>
              {item.source && <p className="text-sm text-gray-500 mt-2">Source: {item.source}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
