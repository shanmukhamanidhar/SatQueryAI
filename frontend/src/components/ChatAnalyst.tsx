import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MapPin, 
  Crosshair, 
  Activity, 
  Calendar, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { AnalysisContext, ChatMessage, ChangeRegion } from '../lib/types';
import { sendChatMessage } from '../lib/api';

interface ChatAnalystProps {
  context: AnalysisContext | null;
  onFilterCategory: (category: string | null) => void;
  onHighlightRegions: (regionIds: string[] | null) => void;
  onSelectRegion: (region: ChangeRegion | null) => void;
  onZoomTo: (coords: [number, number, number] | null) => void;
}

export const ChatAnalyst: React.FC<ChatAnalystProps> = ({
  context,
  onFilterCategory,
  onHighlightRegions,
  onSelectRegion,
  onZoomTo,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize analyst investigation when context changes or on mount
  useEffect(() => {
    if (!context) {
      const initialWelcomeMsg: ChatMessage = {
        id: 'init-msg',
        role: 'assistant',
        content: (
          `I am your **SatQueryAI Geospatial AI Analyst**.\n\n` +
          `I can answer any questions about satellite remote sensing, Copernicus Sentinel-2 multispectral imagery, spectral indices (NDVI, NDBI, NDWI), environmental change, deforestation, urban growth, or any location worldwide.\n\n` +
          `Ask me anything, or run an analysis on any city or region!`
        ),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          "What is NDVI and how does it detect vegetation?",
          "What is NDBI and how does it detect built-up areas?",
          "How does Copernicus Sentinel-2 capture imagery?",
          "Tell me about Krishna river dynamics in Vijayawada"
        ],
      };
      setMessages([initialWelcomeMsg]);
      return;
    }

    const initialAiMsg: ChatMessage = {
      id: 'init-msg',
      role: 'assistant',
      content: (
        `I am your **SatQueryAI Geospatial AI Analyst**. I have analyzed **${context.location.name}** ` +
        `from **${context.actual_before_date}** to **${context.actual_after_date}**.\n\n` +
        `${context.ai_summary.headline}.\n\n` +
        `You can investigate detected changes, inspect spectral evidence, or ask follow-up questions:`
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        "Where did the biggest change happen?",
        "Was it urban development?",
        "What is NDVI and NDBI?",
        "When did it happen?",
        "Show only vegetation loss"
      ],
    };

    setMessages([initialAiMsg]);
  }, [context?.analysis_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isSending) return;

    setInputVal('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      // Retain full conversational history
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res: any = await sendChatMessage({
        analysis_id: context ? context.analysis_id : 'general',
        message: query,
        history: historyPayload,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: res.suggested_actions,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Execute suggested map actions from AI (Ask -> Map -> Answer loop)
      if (context) {
        if (res.filter_category !== undefined) {
          onFilterCategory(res.filter_category === 'ALL' ? null : res.filter_category);
        }
        if (res.highlight_region_ids !== undefined) {
          onHighlightRegions(res.highlight_region_ids);
        }
        if (res.selected_region_id) {
          const match = context.change_regions.find((r) => r.id === res.selected_region_id);
          if (match) {
            onSelectRegion(match);
          }
        }
        if (res.zoom_to && Array.isArray(res.zoom_to) && res.zoom_to.length >= 2) {
          onZoomTo(res.zoom_to as [number, number, number]);
        }
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'system',
        content: `Geospatial Analyst error: ${err.message || 'Network failure'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Quick Action Handler for [SHOW ON MAP]
  const handleShowBiggestOnMap = () => {
    if (!context || context.change_regions.length === 0) return;
    const sorted = [...context.change_regions].sort((a, b) => b.area_hectares - a.area_hectares);
    const top = sorted[0];
    onSelectRegion(top);
    onHighlightRegions([top.id]);
    onZoomTo([top.centroid[0], top.centroid[1], 14.2]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b101d]/95 border-r border-slate-800/80 backdrop-blur-xl font-sans">
      {/* Analyst Panel Header */}
      <div className="p-3.5 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-xs text-slate-100 tracking-wide">
              AI Geospatial Analyst
            </h3>
            <span className="text-[10px] text-emerald-400 font-telemetry flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
              <span>Active Investigation</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {context && (
            <span className="text-[10px] font-telemetry px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-300">
              {context.location.name}
            </span>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Message Meta Tag */}
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-telemetry text-slate-400">
              {m.role === 'user' ? (
                <span>You • {m.timestamp}</span>
              ) : m.role === 'assistant' ? (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span className="text-cyan-300 font-medium">SatQueryAI Intelligence</span>
                  <span>•</span>
                  <span>{m.timestamp}</span>
                </>
              ) : (
                <span className="text-rose-400">System Notification</span>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-2xl max-w-[94%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-tr-sm shadow-md'
                  : m.role === 'assistant'
                  ? 'figma-card border-slate-700/60 text-slate-200 rounded-tl-sm shadow-lg'
                  : 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">{m.content}</div>

              {/* Integrated Investigation Actions for Assistant Messages */}
              {m.role === 'assistant' && context && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={handleShowBiggestOnMap}
                    className="px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 text-[10.5px] font-telemetry font-medium transition-all flex items-center space-x-1"
                  >
                    <Crosshair className="w-3 h-3 text-cyan-400" />
                    <span>SHOW ON MAP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("What is the spectral evidence for this change?")}
                    disabled={isSending}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-[10.5px] font-telemetry transition-all flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>VIEW EVIDENCE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("When did the change happen across observations?")}
                    disabled={isSending}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-[10.5px] font-telemetry transition-all flex items-center space-x-1"
                  >
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>WHEN DID IT HAPPEN?</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("Why did SatQueryAI classify this as development?")}
                    disabled={isSending}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-[10.5px] font-telemetry transition-all flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3 h-3 text-purple-400" />
                    <span>WHY?</span>
                  </button>
                </div>
              )}

              {/* Follow-up Question Suggestion Pills */}
              {m.suggestedActions && m.suggestedActions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap gap-1">
                  {m.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(action)}
                      disabled={isSending}
                      className="px-2 py-0.5 rounded-full bg-slate-850 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-cyan-300 text-[10px] font-sans transition-colors text-left"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-telemetry p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 w-fit">
            <Activity className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>Analyzing multispectral pixels & temporal scenes...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800/90 bg-[#070b13]/90"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={context ? `Ask about ${context.location.name}, spectral indices, or world geography...` : "Ask any question about satellite data, locations, or environmental change..."}
            disabled={isSending}
            className="w-full pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isSending}
            className="absolute right-1.5 p-1.5 rounded-lg bg-cyan-500 text-space-950 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
