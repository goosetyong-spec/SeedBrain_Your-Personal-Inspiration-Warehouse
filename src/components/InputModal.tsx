import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Link as LinkIcon, PenLine, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: string, type: 'video' | 'note') => Promise<void>;
}

export const InputModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [input, setInput] = useState('');
  const [type, setType] = useState<'video' | 'note'>('video');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(input, type);
      setInput('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-neon-pink rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-black text-white">捕捉灵感</h2>
            </div>

            <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-2xl">
              <button
                onClick={() => setType('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  type === 'video' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <LinkIcon size={18} />
                <span>视频链接</span>
              </button>
              <button
                onClick={() => setType('note')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  type === 'note' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/60'
                }`}
              >
                <PenLine size={18} />
                <span>即时笔记</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={type === 'video' ? "粘贴 YouTube, Bilibili 或 TikTok 链接..." : "写下你脑海中闪过的灵感火花..."}
                className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-pink/50 transition-colors resize-none mb-6 notebook-lines"
              />

              <button
                disabled={isSubmitting || !input.trim()}
                className="w-full bg-neon-pink disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl shadow-pink-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>孵化中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>种下种子</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
