import React from 'react';
import { motion } from 'motion/react';
import { SeedCard, Folder } from '../types';
import { ArrowLeft, Paperclip, ExternalLink, Sparkles, Play, Calendar, CheckCircle2 } from 'lucide-react';
import { SproutLogo } from './SproutLogo';

interface Props {
  card: SeedCard;
  folder: Folder;
  onBack: () => void;
  onEditNote: (card: SeedCard) => void;
  onToggleSprout: (id: string) => void;
}

export const SeedDetail: React.FC<Props> = ({ card, folder, onBack, onEditNote, onToggleSprout }) => {
  const previewImage = card.coverImage || `https://picsum.photos/seed/${card.id}/600/400`;
  
  // Ensure URL is absolute to prevent relative path navigation issues
  const getAbsoluteUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const finalUrl = getAbsoluteUrl(card.url);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="absolute inset-0 z-[200] bg-midnight flex flex-col overflow-hidden"
    >
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-neon-pink/10 rounded-xl flex items-center justify-center text-neon-pink active:bg-neon-pink active:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-xl font-black tracking-tighter truncate">{card.title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: folder.color }} />
            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{folder.name}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar space-y-8">
        
        {/* Sprout Action Button */}
        <section>
          <button
            onClick={() => onToggleSprout(card.id)}
            className={`w-full py-3.5 rounded-[2rem] flex items-center justify-center gap-5 transition-all shadow-2xl ${
              card.isSprouting 
                ? 'bg-white/5 border border-white/10 text-white/40' 
                : 'bg-neon-pink text-white shadow-pink-500/40'
            }`}
          >
            <div className="flex-shrink-0">
              <SproutLogo 
                size={44} 
                color={card.isSprouting ? 'rgba(255,255,255,0.5)' : '#FFFFFF'} 
                animate={false}
              />
            </div>
            <div className="text-left flex flex-col justify-center">
              <h3 className="font-black text-lg tracking-tighter leading-none mb-1">
                {card.isSprouting ? '正在发芽中' : '开始发芽'}
              </h3>
              <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${card.isSprouting ? 'text-white/20' : 'text-white/60'}`}>
                {card.isSprouting ? '在发芽区查看进度' : '将灵感转化为实际行动'}
              </p>
            </div>
          </button>
        </section>

        {/* Section 1: My Personal Notes (Notebook Style) - AT TOP */}
        <section className="relative">
          <div className="absolute -top-4 right-6 text-neon-pink rotate-[15deg] z-20">
            <Paperclip size={40} strokeWidth={1.5} />
          </div>
          
          <div className="bg-[#FDFCF8] rounded-[2.5rem] p-8 overflow-hidden border border-black/5 shadow-2xl relative">
            {/* Paper Texture/Lines */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 28px' }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-pink" />
                  <span className="text-black/40 font-black text-[10px] uppercase tracking-[0.2em]">灵感笔记 · NOTEBOOK</span>
                </div>
                <button 
                  onClick={() => onEditNote(card)}
                  className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full active:scale-95 transition-transform"
                >
                  编辑笔记
                </button>
              </div>
              
              <div className="min-h-[120px]">
                <p className="text-gray-900 text-xl font-medium leading-[28px] font-serif italic break-all">
                  {card.originalContent || '点击右侧按钮记录你的灵感...'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Original Content (Preview & Link) */}
        <section className="bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10">
          <div className="relative aspect-video bg-gray-900">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            {card.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                  <Play size={24} className="text-white" fill="currentColor" />
                </div>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">ORIGINAL LINK</span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-3 bg-neon-pink rounded-full" />
              <h3 className="text-white/40 font-black text-[10px] uppercase tracking-widest">灵感来源</h3>
            </div>
            <h3 className="text-white text-lg font-black leading-tight mb-4 line-clamp-2">
              {card.summary}
            </h3>
            <div className="flex flex-wrap gap-3">
              <a 
                href={finalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!card.url || card.url === '#') {
                    e.preventDefault();
                    alert('未检测到有效链接');
                  }
                }}
                className="inline-flex items-center gap-2 bg-neon-pink text-white text-xs font-black px-6 py-3 rounded-2xl transition-all active:scale-95 shadow-lg shadow-pink-500/20"
              >
                跳转原贴查看 <ExternalLink size={14} />
              </a>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (card.url) {
                    navigator.clipboard.writeText(finalUrl).then(() => {
                      alert('链接已复制，请在浏览器中粘贴打开');
                    });
                  } else {
                    alert('无链接可复制');
                  }
                }}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black px-6 py-3 rounded-2xl transition-colors active:scale-95"
              >
                复制链接
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: AI Insights */}
        <div className="space-y-6">
          {/* AI Summary */}
          <section className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-neon-pink" />
              <h3 className="text-white font-black text-[10px] uppercase tracking-widest">AI 深度解析</h3>
            </div>
            <p className="text-white/70 text-base font-medium leading-relaxed">
              {card.summary}
            </p>
          </section>

          {/* Incubation Tasks */}
          <section>
            <div className="flex items-center gap-2 mb-6 px-2">
              <CheckCircle2 size={16} className="text-neon-pink" />
              <h3 className="text-white font-black text-[10px] uppercase tracking-widest">孵化建议</h3>
            </div>
            <div className="space-y-3">
              {card.tasks.map((task, i) => (
                <div key={i} className="flex gap-4 items-start bg-white/5 p-5 rounded-2xl border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-neon-pink text-white text-[10px] flex items-center justify-center flex-shrink-0 font-black">
                    {i + 1}
                  </div>
                  <p className="text-white/80 text-sm font-bold leading-snug">
                    {task}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Outlook */}
          <section className="bg-neon-pink/5 p-6 rounded-[2rem] border border-neon-pink/10">
            <h3 className="text-neon-pink font-black text-[10px] uppercase tracking-widest mb-3">前景展望</h3>
            <p className="text-white/60 text-sm font-medium leading-relaxed italic">
              {card.prospects}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 flex items-center justify-between text-white/20 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Calendar size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {new Date(card.createdAt).toLocaleDateString()} 种下
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">#{card.tag.replace('#', '')}</span>
        </div>
      </div>
    </motion.div>
  );
};
