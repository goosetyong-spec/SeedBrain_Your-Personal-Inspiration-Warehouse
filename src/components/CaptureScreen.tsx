import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Brain, Zap } from 'lucide-react';

interface Props {
  onCapture: (text: string) => void;
  isProcessing: boolean;
}

export const CaptureScreen: React.FC<Props> = ({ onCapture, isProcessing }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim() && !isProcessing) {
      onCapture(text);
      setText('');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 pb-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full justify-center">
        <header className="mb-12 text-center">
          <div className="flex flex-col items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-[2rem] bg-neon-pink/10 flex items-center justify-center shadow-2xl shadow-neon-pink/20">
              <Zap className="text-neon-pink" size={32} fill="currentColor" />
            </div>
            <h1 className="text-white text-5xl font-display font-black tracking-tighter">闪念捕获</h1>
          </div>
          <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.3em] mt-2">把转瞬即逝的想法交给 AI 分拣</p>
        </header>

        <div className="w-full max-w-md mx-auto">
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入你的灵感、链接或一段话..."
              className="w-full h-80 bg-white/5 border border-white/10 rounded-[3rem] p-10 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-pink/50 transition-all resize-none font-bold text-xl notebook-lines shadow-2xl"
            />
            
            <div className="absolute bottom-8 right-8 flex items-center gap-6">
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${text.length > 0 ? 'text-white/40' : 'text-white/10'}`}>
                {text.length} 字
              </span>
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || isProcessing}
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-2xl ${
                  text.trim() && !isProcessing 
                    ? 'bg-neon-pink text-white scale-100 shadow-neon-pink/40' 
                    : 'bg-white/5 text-white/20 scale-90'
                }`}
              >
                {isProcessing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Brain size={28} />
                  </motion.div>
                ) : (
                  <Send size={28} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
