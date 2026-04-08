import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Search, 
  Brain, 
  FileText, 
  Link2, 
  CheckCircle, 
  Loader2, 
  Sparkles,
  FolderOpen,
  ChevronRight,
  X,
  Zap,
  BookOpen
} from 'lucide-react';

// API base URL - change for production
const API_URL = import.meta.env.VITE_API_URL || '';

// Agent configuration with colors and icons
const AGENT_CONFIG = {
  'Research Agent': { icon: Search, color: 'agent-research', label: 'Research' },
  'Summarizer Agent': { icon: FileText, color: 'agent-summarizer', label: 'Summarize' },
  'Writer Agent': { icon: Sparkles, color: 'agent-writer', label: 'Write' },
  'Linker Agent': { icon: Link2, color: 'agent-linker', label: 'Link' },
  'Validator Agent': { icon: CheckCircle, color: 'agent-validator', label: 'Validate' },
};

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [knowledgeFiles, setKnowledgeFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch knowledge files on mount
  useEffect(() => {
    fetchKnowledgeFiles();
  }, []);

  const fetchKnowledgeFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/knowledge`);
      const data = await res.json();
      setKnowledgeFiles(data.files || []);
    } catch (err) {
      console.error('Failed to fetch knowledge files:', err);
    }
  };

  const fetchFileContent = async (filename) => {
    try {
      const res = await fetch(`${API_URL}/knowledge/${filename}`);
      const data = await res.json();
      setFileContent(data.content);
      setSelectedFile(filename);
    } catch (err) {
      console.error('Failed to fetch file:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Request failed');
      }

      const data = await res.json();
      setResult(data);
      
      // Refresh knowledge files
      await fetchKnowledgeFiles();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process markdown to make [[wiki-links]] clickable
  const processWikiLinks = (content) => {
    if (!content) return '';
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, topic) => {
      const filename = topic.toLowerCase().replace(/\s+/g, '_');
      return `<span class="wiki-link" data-topic="${filename}">${topic}</span>`;
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Knowledge Base */}
      <aside className={`${showSidebar ? 'w-72' : 'w-0'} bg-obsidian-900 border-r border-obsidian-700 transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-obsidian-700">
          <div className="flex items-center gap-2 text-obsidian-100">
            <FolderOpen className="w-5 h-5 text-accent-purple" />
            <span className="font-medium">Knowledge Base</span>
            <span className="ml-auto text-xs text-obsidian-500">{knowledgeFiles.length} files</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {knowledgeFiles.length === 0 ? (
            <p className="text-obsidian-500 text-sm p-2">No knowledge files yet</p>
          ) : (
            <div className="space-y-1">
              {knowledgeFiles.map((file) => (
                <button
                  key={file}
                  onClick={() => fetchFileContent(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group
                    ${selectedFile === file 
                      ? 'bg-accent-purple/20 text-accent-purple' 
                      : 'text-obsidian-300 hover:bg-obsidian-800 hover:text-obsidian-100'
                    }`}
                >
                  <BookOpen className="w-4 h-4 opacity-60" />
                  <span className="truncate">{file.replace(/_/g, ' ')}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity
                    ${selectedFile === file ? 'opacity-100' : ''}`} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-obsidian-900/50 backdrop-blur-sm border-b border-obsidian-800 px-6 py-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-obsidian-800 rounded-lg transition-colors"
            >
              <FolderOpen className="w-5 h-5 text-obsidian-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center glow-purple">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Agentic Knowledge System</h1>
                <p className="text-xs text-obsidian-400">Multi-agent AI for connected knowledge</p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {Object.entries(AGENT_CONFIG).map(([name, config]) => (
                <div 
                  key={name}
                  className={`px-2 py-1 rounded text-xs border ${config.color} opacity-60`}
                  title={name}
                >
                  <config.icon className="w-3 h-3" />
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            
            {/* Query Input */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question or explore a topic..."
                  disabled={loading}
                  className="w-full bg-obsidian-900 border border-obsidian-700 rounded-xl px-5 py-4 pr-14 text-white placeholder-obsidian-500 focus:outline-none focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-purple hover:bg-accent-purple/80 disabled:bg-obsidian-700 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
              
              {/* Example queries */}
              <div className="mt-3 flex flex-wrap gap-2">
                {['What are transformers?', 'Explain reinforcement learning', 'How do AI agents work?'].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setQuery(example)}
                    className="text-xs px-3 py-1.5 rounded-full bg-obsidian-800 text-obsidian-400 hover:bg-obsidian-700 hover:text-obsidian-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </form>

            {/* Loading State */}
            {loading && (
              <div className="bg-obsidian-900 rounded-xl border border-obsidian-700 p-8 animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue animate-pulse-slow" />
                    <Brain className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center">
                    <p className="text-obsidian-200 font-medium">Processing your query...</p>
                    <p className="text-obsidian-500 text-sm mt-1">Agents are researching, writing, and linking knowledge</p>
                  </div>
                  
                  {/* Agent pipeline animation */}
                  <div className="flex items-center gap-2 mt-4">
                    {Object.entries(AGENT_CONFIG).map(([name, config], idx) => (
                      <React.Fragment key={name}>
                        <div className={`p-2 rounded-lg border ${config.color} animate-pulse`} style={{ animationDelay: `${idx * 0.2}s` }}>
                          <config.icon className="w-4 h-4" />
                        </div>
                        {idx < Object.keys(AGENT_CONFIG).length - 1 && (
                          <ChevronRight className="w-4 h-4 text-obsidian-600" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 animate-fade-in">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Result Display */}
            {result && !loading && (
              <div className="space-y-4 animate-slide-up">
                {/* Agents Used */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-obsidian-500 uppercase tracking-wider">Agents:</span>
                  {result.agents_used?.map((agent) => {
                    const config = AGENT_CONFIG[agent];
                    if (!config) return null;
                    return (
                      <span key={agent} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs border ${config.color}`}>
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    );
                  })}
                  
                  {/* Files created/updated badges */}
                  {result.files_created?.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                      +{result.files_created.length} created
                    </span>
                  )}
                  {result.files_updated?.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {result.files_updated.length} updated
                    </span>
                  )}
                </div>

                {/* Main Response */}
                <div className="bg-obsidian-900 rounded-xl border border-obsidian-700 p-6 markdown-content">
                  <ReactMarkdown
                    components={{
                      // Custom renderer for wiki links
                      p: ({ children }) => {
                        const processChildren = (child) => {
                          if (typeof child === 'string') {
                            const parts = child.split(/(\[\[[^\]]+\]\])/g);
                            return parts.map((part, i) => {
                              const match = part.match(/\[\[([^\]]+)\]\]/);
                              if (match) {
                                const topic = match[1];
                                const filename = topic.toLowerCase().replace(/\s+/g, '_');
                                return (
                                  <span 
                                    key={i}
                                    className="wiki-link"
                                    onClick={() => fetchFileContent(filename)}
                                  >
                                    {topic}
                                  </span>
                                );
                              }
                              return part;
                            });
                          }
                          return child;
                        };
                        
                        return <p>{React.Children.map(children, processChildren)}</p>;
                      }
                    }}
                  >
                    {result.response}
                  </ReactMarkdown>
                </div>

                {/* Validation Score */}
                {result.validation?.quality_score && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-obsidian-500">Quality Score:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < result.validation.quality_score 
                              ? 'bg-accent-green' 
                              : 'bg-obsidian-700'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-obsidian-400">{result.validation.quality_score}/10</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selected File View */}
            {selectedFile && fileContent && !loading && (
              <div className="bg-obsidian-900 rounded-xl border border-obsidian-700 animate-slide-up">
                <div className="flex items-center justify-between px-4 py-3 border-b border-obsidian-700">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent-purple" />
                    <span className="font-medium text-white">{selectedFile.replace(/_/g, ' ')}</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedFile(null); setFileContent(null); }}
                    className="p-1 hover:bg-obsidian-800 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-obsidian-400" />
                  </button>
                </div>
                <div className="p-6 markdown-content max-h-96 overflow-y-auto">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => {
                        const processChildren = (child) => {
                          if (typeof child === 'string') {
                            const parts = child.split(/(\[\[[^\]]+\]\])/g);
                            return parts.map((part, i) => {
                              const match = part.match(/\[\[([^\]]+)\]\]/);
                              if (match) {
                                const topic = match[1];
                                const filename = topic.toLowerCase().replace(/\s+/g, '_');
                                return (
                                  <span 
                                    key={i}
                                    className="wiki-link"
                                    onClick={() => fetchFileContent(filename)}
                                  >
                                    {topic}
                                  </span>
                                );
                              }
                              return part;
                            });
                          }
                          return child;
                        };
                        return <p>{React.Children.map(children, processChildren)}</p>;
                      }
                    }}
                  >
                    {fileContent}
                  </ReactMarkdown>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-obsidian-800 px-6 py-3 text-center text-xs text-obsidian-600">
          Built with LangGraph + Groq + React • Agentic Knowledge System
        </footer>
      </main>
    </div>
  );
}

export default App;
