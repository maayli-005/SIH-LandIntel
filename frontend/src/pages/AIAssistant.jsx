import { useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import api from '../api';

function AIAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick Prompt Chips Data
  const promptPresets = [
    { label: "📊 Show state-wise dispute summary", text: "How many land disputes are there and in which states?" },
    { label: "🗺️ Find agricultural land details", text: "Give me a summary of all Agricultural land records in the database." },
    { label: "🚨 Identify highest risk clusters", text: "Which districts have the maximum disputed land area?" }
  ];

  const handleSearch = async (textToSend) => {
    const activeText = textToSend || query;
    if (!activeText.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const res = await api.post('/ai/query', { query: activeText });
      setResponse(res.data.answer);
    } catch (err) {
      setResponse('Failed to fetch response from Gemini AI. Please check server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetText) => {
    setQuery(presetText);
    handleSearch(presetText); // Click karte hi auto-submit ho jaye
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          <MessageSquare size={22} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Governance Assistant</h1>
          <p className="text-slate-500 mt-1">Ask questions about land records, policy frameworks, and litigation status.</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col p-6 min-h-[500px]">
        {/* Chat Display Box */}
        <div className="flex-1 overflow-y-auto mb-4 border border-slate-100 rounded-lg p-4 bg-slate-50/50 min-h-[300px]">
          {response ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-slate-700">
                <p className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1">
                  <Sparkles size={12} /> Gemini AI Response:
                </p>
                <p className="text-sm whitespace-pre-line leading-relaxed">{response}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Sparkles size={36} className="text-blue-500 animate-pulse mb-2" />
              <p className="text-sm font-medium">Ready to assist. Click a preset query below or type your question.</p>
            </div>
          )}
        </div>

        {/* 🔥 NEW CLICKABLE PROMPT PRESETS (CHIPS) 🔥 */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">⚡ Quick Administrative Queries</p>
          <div className="flex flex-wrap gap-2">
            {promptPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePresetClick(preset.text)}
                className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 px-3 py-2 rounded-full border border-slate-200 hover:border-blue-200 transition-all font-medium cursor-pointer shadow-sm"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Field bar */}
        <div className="flex gap-2 items-center border border-slate-200 rounded-xl p-2 bg-white shadow-inner">
          <input
            type="text"
            placeholder="Type land governance queries (e.g., 'List clear titles in Bhopal')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 text-sm text-slate-700 focus:outline-none placeholder-slate-400 bg-transparent"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;