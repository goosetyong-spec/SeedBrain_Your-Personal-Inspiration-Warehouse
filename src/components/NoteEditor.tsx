import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialValue: string;
  onSubmit: (value: string) => void;
}

export const NoteEditor: React.FC<Props> = ({ isOpen, onClose, initialValue, onSubmit }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#FDFCF8] rounded-t-[3rem] z-[301] px-8 pt-10 pb-12 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.3)]"
            style={{ maxHeight: '80vh' }}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-pink" />
                  <h3 className="text-black font-black text-xs uppercase tracking-widest">编辑灵感笔记</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-black/40 active:bg-black/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
 
              <textarea
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="在这里写下你的灵感..."
                className="flex-1 bg-transparent text-gray-900 text-xl font-serif italic outline-none resize-none placeholder:text-black/10 notebook-lines-light"
                style={{ minHeight: '200px' }}
              />

              <div className="mt-8 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl bg-black/5 text-black/40 font-black text-xs tracking-widest active:bg-black/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onSubmit(value);
                    onClose();
                  }}
                  className="flex-1 py-4 rounded-2xl bg-black text-white font-black text-xs tracking-widest shadow-xl active:scale-95 transition-transform"
                >
                  保存笔记
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
