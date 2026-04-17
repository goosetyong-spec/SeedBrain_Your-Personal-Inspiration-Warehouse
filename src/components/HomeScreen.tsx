import React, { useState, useRef } from 'react';
import { motion, useDragControls } from 'motion/react';
import { Folder } from '../types';
import { BlobCreature } from './BlobCreature';
import { SproutLogo } from './SproutLogo';
import { Plus, X } from 'lucide-react';

interface Props {
  folders: Folder[];
  onSelectFolder: (folder: Folder) => void;
  onCreateFolder: (name: string, color: string) => void;
  onReorderFolders: (folders: Folder[]) => void;
  onDeleteFolder: (id: string) => void;
}

const PRESET_COLORS = ['#FF0080', '#00F5FF', '#70FF00', '#FFD700', '#BF00FF', '#FF4D00'];

const moveItem = (arr: any[], from: number, to: number) => {
  const newArr = [...arr];
  const [item] = newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
};

const FolderItem: React.FC<{
  folder: Folder;
  folders: Folder[];
  onSelect: () => void;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onReorder: (newFolders: Folder[]) => void;
  onDelete: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ folder, folders, onSelect, isDragging, onDragStart, onDragEnd, onReorder, onDelete, containerRef }) => {
  const dragControls = useDragControls();
  const [isOverDelete, setIsOverDelete] = useState(false);

  const handleDrag = (_: any, info: any) => {
    if (!containerRef.current) return;

    // Check if over delete zone
    const deleteZone = document.getElementById('delete-zone');
    if (deleteZone && folder.id !== 'inbox') {
      const rect = deleteZone.getBoundingClientRect();
      const isOver = info.point.y > rect.top;
      setIsOverDelete(isOver);
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = info.point.x - containerRect.left;
    const y = info.point.y - containerRect.top;

    const colWidth = containerRect.width / 2;
    const rowHeight = 200;

    const col = Math.max(0, Math.min(1, Math.floor(x / colWidth)));
    const row = Math.max(0, Math.floor(y / rowHeight));
    
    const targetIndex = Math.min(folders.length - 1, row * 2 + col);
    const currentIndex = folders.findIndex(f => f.id === folder.id);

    if (targetIndex !== currentIndex && targetIndex >= 0 && !isOverDelete) {
      onReorder(moveItem(folders, currentIndex, targetIndex));
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    onDragEnd();
    const deleteZone = document.getElementById('delete-zone');
    if (deleteZone) {
      const rect = deleteZone.getBoundingClientRect();
      if (info.point.y > rect.top && folder.id !== 'inbox') {
        onDelete(folder.id);
      }
    }
    setIsOverDelete(false);
  };

  const isSprouting = folder.seeds.some(s => s.isSprouting);
  
  return (
    <motion.div
      layout
      drag
      dragControls={dragControls}
      dragListener={false}
      dragSnapToOrigin
      dragElastic={0.1}
      onDragStart={() => onDragStart(folder.id)}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      className={`flex flex-col items-center cursor-pointer group relative ${isDragging ? 'z-50' : 'z-0'}`}
      animate={{ 
        scale: isOverDelete ? 0.5 : 1,
        opacity: isOverDelete ? 0.5 : 1,
      }}
    >
      <div 
        onPointerDown={(e) => {
          const timer = setTimeout(() => {
            dragControls.start(e);
          }, 200);
          const clear = () => clearTimeout(timer);
          window.addEventListener('pointerup', clear, { once: true });
        }}
        onClick={() => !isDragging && onSelect()}
        className="flex flex-col items-center relative"
      >
        <BlobCreature 
          color={folder.color} 
          shapePath={folder.shapePath} 
          size={140} 
          isWavy={isDragging}
          isInbox={folder.id === 'inbox'}
        />
        
        {/* Sprouting Indicator Badge - Using white with 50% opacity */}
        {isSprouting && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 z-20 opacity-50"
          >
            <div className="relative group/badge">
              <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse" />
              <SproutLogo 
                size={36} 
                color="#FFFFFF" 
                animate 
                stage="sprout" 
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              />
            </div>
          </motion.div>
        )}

        <span className="mt-4 text-white font-display font-bold text-sm tracking-tight text-center group-hover:text-neon-pink transition-colors line-clamp-1">
          {folder.name}
        </span>
        <span className="mt-1 text-white/20 font-black text-[8px] tracking-[0.2em] uppercase text-center">
          {folder.seeds.length} {folder.id === 'inbox' ? 'FLASH' : 'SEED'}
        </span>
      </div>
    </motion.div>
  );
};

export const HomeScreen: React.FC<Props> = ({ folders, onSelectFolder, onCreateFolder, onReorderFolders, onDeleteFolder }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedColor);
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-12 pb-24 no-scrollbar relative">
      <header className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-white text-5xl font-display font-black tracking-tighter flex items-center gap-2">
            Seedbrain
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <g transform="translate(20, 30) scale(0.8)">
                <path d="M 0 0 Q -5 -10 0 -20" fill="none" stroke="#FF0080" strokeWidth="4" strokeLinecap="round" />
                <g transform="translate(0, -20)">
                  <path d="M 0 0 Q 15 -15 25 -5 Q 10 10 0 0" fill="#FF0080" />
                  <path d="M 0 0 Q -15 -15 -25 -5 Q -10 10 0 0" fill="#FF0080" className="brightness-110" />
                </g>
              </g>
            </svg>
          </h1>
        </motion.div>
        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-3 ml-1">点击进入花园</p>
      </header>

      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-x-4 gap-y-12 relative" 
        ref={containerRef}
      >
        {folders.map((folder) => (
          <motion.div
            key={folder.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
          >
            <FolderItem
              folder={folder}
              folders={folders}
              onSelect={() => onSelectFolder(folder)}
              isDragging={draggingId === folder.id}
              onDragStart={setDraggingId}
              onDragEnd={() => setDraggingId(null)}
              onReorder={onReorderFolders}
              onDelete={onDeleteFolder}
              containerRef={containerRef}
            />
          </motion.div>
        ))}

        <motion.button
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            show: { opacity: 1, scale: 1 }
          }}
          layout
          whileHover={{ scale: 1.05, borderColor: 'rgba(255, 0, 127, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreating(true)}
          className="aspect-square rounded-[3rem] border border-dashed border-white/30 flex flex-col items-center justify-center gap-3 transition-all h-[140px] w-[140px] mx-auto group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-neon-pink/10 transition-colors">
            <Plus className="text-white/40 group-hover:text-neon-pink transition-colors" size={28} />
          </div>
          <span className="text-white/20 font-black text-[9px] uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">新建文件夹</span>
        </motion.button>
      </motion.div>

      {/* Delete Zone */}
      <motion.div 
        id="delete-zone"
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: draggingId && draggingId !== 'inbox' ? 1 : 0, 
          y: draggingId && draggingId !== 'inbox' ? 0 : 100 
        }}
        className={`fixed bottom-24 left-6 right-6 h-24 bg-red-500/20 border-2 border-dashed border-red-500/40 rounded-[2.5rem] flex items-center justify-center gap-3 z-[60] backdrop-blur-md ${draggingId && draggingId !== 'inbox' ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg">
          <X size={24} />
        </div>
        <span className="text-red-500 font-black text-xs uppercase tracking-widest">拖到此处删除</span>
      </motion.div>

      {/* Create Folder Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-midnight rounded-[3rem] p-8 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-white font-black text-xl">新建灵感文件夹</h2>
              <button onClick={() => setIsCreating(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-3">文件夹名称</label>
                <input 
                  autoFocus
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="给你的灵感起个名字..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-neon-pink transition-colors"
                />
              </div>

              <div>
                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest block mb-3">选择颜色</label>
                <div className="flex flex-wrap gap-3">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full transition-transform ${selectedColor === color ? 'scale-125 ring-2 ring-white ring-offset-4 ring-offset-midnight' : 'hover:scale-110'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={!newFolderName.trim()}
                className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-20 disabled:scale-100 mt-4"
              >
                创建文件夹
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
