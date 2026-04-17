import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { SeedCard as SeedCardType } from '../types';
import { ChevronRight, CheckCircle2, MoreVertical, Share2, Trash2, Sparkles } from 'lucide-react';
import { SproutLogo } from './SproutLogo';

interface Props {
  card: SeedCardType;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onOpenDetail: (card: SeedCardType) => void;
  activeIndex: number;
  dragOffset?: number;
  layoutId?: string;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: () => void;
}

export const SeedCard: React.FC<Props> = ({ 
  card, index, total, onRemove, onOpenDetail, activeIndex, dragOffset = 0, layoutId,
  isSelectionMode, isSelected, onToggleSelection
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Calculate relative index for continuous scrolling
  // 150 is the vertical spacing between cards
  const relativeIndex = index - (activeIndex - dragOffset / 150);

  const isActive = Math.abs(relativeIndex) < 0.5;

  // Auto-flip back when not active
  React.useEffect(() => {
    if (!isActive && isFlipped) {
      setIsFlipped(false);
    }
  }, [isActive, isFlipped]);
  
  const yOffset = relativeIndex * 140; 
  const zOffset = Math.abs(relativeIndex) * -150; 
  const scale = 1 - Math.abs(relativeIndex) * 0.15;
  const opacity = 1 - Math.abs(relativeIndex) * 0.3;
  const rotateX = relativeIndex * -15; 
  const darkness = Math.abs(relativeIndex) * 0.4;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Use the standalone app URL if available, otherwise fallback to current location
    const shareUrl = window.location.origin + window.location.pathname;
    const shareText = `【${card.title}】\n${card.summary}\n查看详情：${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.summary,
        url: shareUrl,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('灵感链接已复制到剪贴板！');
      }).catch(() => {
        alert('复制失败，请手动分享。');
      });
    }
    setShowMenu(false);
  };

  return (
    <motion.div
      layoutId={layoutId}
      animate={{ 
        y: yOffset,
        z: zOffset,
        scale: scale,
        opacity: opacity,
        rotateX: rotateX,
        zIndex: 100 - Math.abs(relativeIndex),
      }}
      transition={dragOffset !== 0 ? {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        mass: 0.8
      } : { 
        type: 'spring', 
        stiffness: 100, 
        damping: 20,
        mass: 1
      }}
      className="absolute w-full max-w-[280px] aspect-[3/4.2] preserve-3d"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative w-full h-full preserve-3d cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => {
          if (isSelectionMode) {
            onToggleSelection?.();
          } else if (isActive && !showMenu) {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        {/* Front Side */}
        <div 
          className={`absolute inset-0 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden border transition-all duration-300 ${
            isSelected ? 'border-neon-pink ring-4 ring-neon-pink ring-offset-4 ring-offset-midnight' : 'border-white/10'
          }`}
          style={{ 
            backgroundColor: card.type === 'action' ? '#FFFFFF' : card.color,
            boxShadow: isActive && !isSelectionMode ? `0 20px 60px ${card.type === 'action' ? '#FFFFFF' : card.color}66` : 'none',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            zIndex: isFlipped ? 0 : 1,
            filter: isSelectionMode && !isSelected ? 'grayscale(0.5) opacity(0.5)' : 'none',
            scale: isSelected ? 0.95 : 1
          }}
        >
          {/* Selection Indicator */}
          {isSelectionMode && (
            <div className={`absolute top-6 left-6 w-10 h-10 rounded-full z-40 flex items-center justify-center transition-all ${
              isSelected ? 'bg-neon-pink text-white scale-110 shadow-lg shadow-neon-pink/40' : 'bg-black/40 border border-white/40 shadow-inner'
            }`}>
              {isSelected ? <CheckCircle2 size={20} /> : <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />}
            </div>
          )}
          {/* Darkness Overlay */}
          <div 
            className="absolute inset-0 bg-black z-20 pointer-events-none transition-opacity duration-300"
            style={{ opacity: card.type === 'action' ? darkness * 0.2 : darkness }}
          />

          {/* Abstract Decorations */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-black rounded-full border-2 border-white/20 z-10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          </div>

          {/* Sprouting Watermark Overlay */}
          {card.isSprouting && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
              <SproutLogo 
                className="w-64 h-64 opacity-[0.5] -rotate-12 translate-x-12 translate-y-12" 
                color="#FFFFFF" 
              />
            </div>
          )}

          {/* More Menu Button (Top Right) */}
          {!isSelectionMode && (
            <div className="absolute top-6 right-6 z-30">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white transition-colors active:bg-gray-900 shadow-lg"
              >
                <MoreVertical size={20} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute top-12 right-0 w-32 bg-white rounded-2xl shadow-2xl overflow-hidden z-40 border border-black/5"
                  >
                    <button 
                      onClick={handleShare}
                      className="w-full px-4 py-3 flex items-center gap-3 active:bg-gray-50 transition-colors text-black/70 font-bold text-xs"
                    >
                      <Share2 size={14} /> 分享
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(card.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 active:bg-red-50 transition-colors text-red-500 font-bold text-xs border-t border-black/5"
                    >
                      <Trash2 size={14} /> 删除
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Abstract String */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 300 420">
            <motion.path
              d="M 150 32 Q 180 60 140 100 T 160 180"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <circle cx="150" cy="32" r="3" fill="white" />
          </svg>

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${card.type === 'action' ? 'bg-neon-pink' : 'bg-black/40'}`} />
              <span className={`${card.type === 'action' ? 'text-black/40' : 'text-black/50'} font-black text-[9px] tracking-[0.2em] uppercase`}>
                {card.tag.replace('#', '')}
              </span>
            </div>
            <h2 className="text-black text-3xl font-display font-bold leading-tight mt-6 tracking-tight line-clamp-2">
              {card.title}
            </h2>
            <div className={`w-12 h-1 ${card.type === 'action' ? 'bg-neon-pink/20' : 'bg-black/10'} mt-4 rounded-full`} />
            <p className="text-black/70 font-medium mt-8 text-sm leading-relaxed line-clamp-4">
              {card.summary}
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-2">
            {!isSelectionMode && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(card);
                }}
                className="bg-black/90 backdrop-blur-md px-5 py-2.5 rounded-full inline-flex items-center gap-2 w-fit active:bg-black transition-colors shadow-xl"
              >
                <span className="text-white font-black text-[9px] tracking-[0.15em] uppercase">查看档案</span>
                <ChevronRight size={12} className="text-white" />
              </div>
            )}
            <span className="text-black/30 font-black text-[8px] uppercase tracking-[0.2em] mb-1">
              {new Date(card.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Back Side - User's Personal Note */}
        <div 
          className="absolute inset-0 rounded-[2.5rem] p-8 flex flex-col bg-[#FDFCF8] overflow-hidden border border-black/5 shadow-inner"
          style={{ 
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: isFlipped ? 1 : 0
          }}
        >
          {/* Paper Texture/Lines */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 28px' }} />
          
          <div className="flex-1 overflow-y-auto pr-2 no-scrollbar relative z-10">
            <div className="flex items-center gap-2 mb-4 px-1">
              <div className="w-2 h-2 rounded-full bg-neon-pink" />
              <span className="text-black/40 font-black text-[10px] uppercase tracking-[0.2em]">灵感笔记</span>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-black/5 shadow-sm min-h-[200px]">
              <p className="text-gray-900 text-xl font-medium leading-relaxed whitespace-pre-wrap font-serif italic break-all">
                {card.originalContent || '点击右下角添加你的笔记...'}
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center relative z-10">
            <button 
              className="bg-black text-white font-black px-6 py-3 rounded-xl shadow-lg active:scale-95 transition-transform text-[10px] tracking-widest"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
            >
              返回正面
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
