import { useState, useRef } from 'react';
import { DataItem } from './types';
import { Cloud} from 'lucide-react';

type TabType = 'upload' | 'url' | 'github';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [data, setData] = useState<DataItem[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DataItem[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [dataUrl, setDataUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

    const handleLoadFromUrl = async () => {
    if (!dataUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(dataUrl);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const text = await response.text();
      const items = text.split('\n')
        .filter(line => line.trim())
        .map((content, idx) => ({
          id: `url-${idx}`,
          content,
          source: dataUrl,
        }));
      
      setData(prev => [...prev, ...items]);
      setDataUrl('');
      setError('');
    } catch (err) {
      setError('Failed to load data from URL. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromGithub = async () => {
    if (!githubUrl.trim()) {
      setError('Please enter a valid GitHub URL');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Convert GitHub URL to raw content URL
      let rawUrl = githubUrl;
      if (githubUrl.includes('github.com') && githubUrl.includes('/blob/')) {
        rawUrl = githubUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('Failed to fetch GitHub data');
      
      const text = await response.text();
      const items = text.split('\n')
        .filter(line => line.trim())
        .map((content, idx) => ({
          id: `github-${idx}`,
          content,
          source: githubUrl,
        }));
      
      setData(prev => [...prev, ...items]);
      setGithubUrl('');
      setError('');
    } catch (err) {
      setError('Failed to load data from GitHub. Please check the URL and try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            RAG Data <span className="text-blue-400">Search</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Use natural language to search any structured dataset, powered by Retrieval-Augmented Generation.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700 p-8">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'upload'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'url'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Load from URL
            </button>
            <button
              onClick={() => setActiveTab('github')}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === 'github'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Load from GitHub
            </button>
          </div>

          {/* Upload Area */}
          {activeTab === 'upload' && (
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Upload Dataset File</h3>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-400 bg-blue-900/20'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-900/30'
                }`}
              >
                <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">XLSX, PDF, JSON, CSV, or ZIP file</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".xlsx,.pdf,.json,.csv,.zip,.txt"
                />
              </div>
              <p className="text-gray-400 text-sm mt-4">
                {data.length} items currently loaded.
              </p>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Load from URL</h3>
              <input
                type="url"
                              value={dataUrl}
              onChange={(e) => setDataUrl(e.target.value)}
                placeholder="Enter data URL..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button 
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={handleLoadFromUrl}
               disabled={loading || !dataUrl.trim()}
            >
              Load Data
           </button>

            </div>
          )}

          {activeTab === 'github' && (
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Load from GitHub</h3>
              <input
                type="text"
                              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="Enter GitHub repository URL..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button 
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={handleLoadFromGithub}
                disabled={loading || !githubUrl.trim()}
              >
                Load Repository
              
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., 'Who is an expert in cloud security?'"
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading || data.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Error & Summary */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}
          {summary && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
              {summary}
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Search Results</h2>
            {results.map(item => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-lg rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all"
              >
                <p className="text-gray-200 mb-2">{item.content}</p>
                {item.source && (
                  <p className="text-sm text-gray-400">Source: {item.source}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
