import React, { useState } from 'react';
import { Plus, Sparkles, Search, ChevronRight, ArrowLeft, LayoutGrid, Layers } from 'lucide-react';
import { SeedCard } from './components/SeedCard';
import { InputModal } from './components/InputModal';
import { RippleEffect } from './components/RippleEffect';
import { HomeScreen } from './components/HomeScreen';
import { generateRandomBlob } from './components/BlobCreature';
import { SeedDetail } from './components/SeedDetail';
import { NoteEditor } from './components/NoteEditor';
import { SeedGridItem } from './components/SeedGridItem';
import { SeedCard as SeedCardType, Folder, TabType } from './types';
import { processInspiration } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { BottomTabs } from './components/BottomTabs';
import { CaptureScreen } from './components/CaptureScreen';
import { SproutScreen } from './components/SproutScreen';

const VIBRANT_COLORS = ['#FF0080', '#70FF00', '#00F5FF', '#FFD700', '#BF00FF', '#FF4D00'];

const getRandomColor = (excludeColor?: string) => {
  let available = VIBRANT_COLORS;
  if (excludeColor) {
    available = VIBRANT_COLORS.filter(c => c !== excludeColor);
  }
  return available[Math.floor(Math.random() * available.length)];
};

const INITIAL_FOLDERS: Folder[] = [
  {
    id: 'inbox',
    name: '闪念收件箱',
    color: '#FFF9E5',
    shapePath: generateRandomBlob(),
    seeds: []
  },
  {
    id: '1',
    name: '好用PROMPT',
    color: '#FF0080',
    shapePath: generateRandomBlob(),
    seeds: [
      {
        id: '1',
        type: 'note',
        title: '结构化提示词框架',
        tag: '#AI',
        color: '#FF0080',
        summary: '使用角色、背景、任务、限制、输出格式的五步法构建提示词。',
        prospects: '提示词工程将成为未来的基础技能。掌握结构化思维能让 AI 产出提升 10 倍。',
        tasks: ['尝试为你的下一个任务写一个结构化提示词', '收集 5 个常用的提示词模板', '测试不同限制条件对输出的影响'],
        originalContent: '',
        createdAt: Date.now() - 100000
      },
      {
        id: '1-2',
        type: 'note',
        title: 'Midjourney 风格公式',
        tag: '#设计',
        color: '#70FF00',
        summary: '掌握 --v 6.0 下的摄影级写实参数与光影描述词组合。',
        prospects: 'AI 绘画已进入商业级应用阶段，精准控制风格是设计师的核心竞争力。',
        tasks: ['练习使用不同的 --ar 比例', '测试 --stylize 参数对细节的影响', '收集 10 个大师级摄影师风格词'],
        originalContent: '',
        createdAt: Date.now() - 90000
      },
      {
        id: '1-3',
        type: 'note',
        title: '代码重构提示词',
        tag: '#开发',
        color: '#00F5FF',
        summary: '如何让 AI 帮你优化代码结构、提高可读性并自动生成单元测试。',
        prospects: 'AI 辅助编程将极大缩短开发周期，让开发者专注于架构设计。',
        tasks: ['用 AI 重构一个复杂的函数', '生成完整的 JSDoc 文档', '让 AI 找出潜在的内存泄漏'],
        originalContent: '',
        createdAt: Date.now() - 80000
      }
    ]
  },
  {
    id: '2',
    name: 'WEB3教程',
    color: '#00F5FF',
    shapePath: generateRandomBlob(),
    seeds: [
      {
        id: '2',
        type: 'video',
        title: 'Web3 社交的未来',
        tag: '#科技',
        color: '#BF00FF',
        summary: '去中心化社交协议正在解决数据所有权问题。探索 Farcaster 和 Lens 的增长。',
        prospects: '下一波社交媒体将由用户所有。在开放社交图谱上构建的应用将拥有前所未有的分发机会。',
        tasks: ['注册一个 Farcaster 账号并探索 API', '关注 10 位去中心化社交领域的开发者', '构思 3 个基于 Lens 协议的应用创意'],
        originalContent: '',
        createdAt: Date.now() - 50000
      },
      {
        id: '2-2',
        type: 'video',
        title: '智能合约安全入门',
        tag: '#安全',
        color: '#FF4D00',
        summary: '学习常见的重入攻击、整数溢出等漏洞及其防范措施。',
        prospects: '安全是 Web3 的生命线，安全审计人才将持续处于高需求状态。',
        tasks: ['阅读 OpenZeppelin 安全文档', '在测试网部署一个简单的合约', '分析一个著名的黑客攻击案例'],
        originalContent: '',
        createdAt: Date.now() - 40000
      },
      {
        id: '2-3',
        type: 'video',
        title: 'L2 扩容方案对比',
        tag: '#技术',
        color: '#FFD700',
        summary: '深入理解 Optimistic Rollups 与 ZK Rollups 的技术差异与应用场景。',
        prospects: 'L2 是以太坊大规模应用的关键，理解其底层逻辑对开发者至关重要。',
        tasks: ['体验一次跨链桥操作', '对比不同 L2 的 Gas 消耗', '研究 ZK-EVM 的最新进展'],
        originalContent: '',
        createdAt: Date.now() - 30000
      }
    ]
  },
  {
    id: '3',
    name: '产品灵感库',
    color: '#70FF00',
    shapePath: generateRandomBlob(),
    seeds: [
      {
        id: '3-1',
        type: 'note',
        title: '极简主义工具设计',
        tag: '#产品',
        color: '#FF0080',
        summary: '探讨如何通过减少功能来增加产品的专注度与用户粘性。',
        prospects: '在信息爆炸时代，极简主义产品往往能获得更高质量的用户群体。',
        tasks: ['分析一个你喜欢的极简 App', '列出你的产品中 3 个可以删掉的功能', '设计一个单功能的 MVP 原型'],
        originalContent: '',
        createdAt: Date.now() - 20000
      },
      {
        id: '3-2',
        type: 'note',
        title: '游戏化学习机制',
        tag: '#教育',
        color: '#00F5FF',
        summary: '将 RPG 游戏的经验值、等级和成就系统引入学习类产品。',
        prospects: '教育产品的未来在于如何让学习变得像游戏一样令人上瘾。',
        tasks: ['设计一套积分奖励规则', '构思一个学习勋章系统', '调研 Duolingo 的激励机制'],
        originalContent: '',
        createdAt: Date.now() - 15000
      },
      {
        id: '3-3',
        type: 'note',
        title: '社区驱动的增长模式',
        tag: '#增长',
        color: '#BF00FF',
        summary: '如何通过建立核心用户社区来实现低成本、高转化的自增长。',
        prospects: '传统的广告投放效率正在降低，社区将成为品牌最坚固的护城河。',
        tasks: ['制定一份社区运营初稿', '寻找 5 个潜在的核心用户', '设计一个邀请制内测方案'],
        originalContent: '',
        createdAt: Date.now() - 10000
      }
    ]
  }
];

export default function App() {
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [isProcessing, setIsProcessing] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('garden');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const activeFolder = folders.find(f => f.id === activeFolderId);
  const currentSeeds = activeFolder?.seeds || [];
  const selectedCard = currentSeeds.find(s => s.id === selectedCardId);
  const focusedCard = currentSeeds.find(s => s.id === focusedCardId);

  const handleToggleSprout = (cardId: string) => {
    setFolders(folders.map(f => ({
      ...f,
      seeds: f.seeds.map(s => {
        if (s.id === cardId) {
          const isStarting = !s.isSprouting;
          return {
            ...s,
            isSprouting: isStarting,
            sproutStartedAt: isStarting ? Date.now() : undefined,
            completedTasks: isStarting ? [] : s.completedTasks
          };
        }
        return s;
      })
    })));
  };

  const handleToggleTask = (cardId: string, index: number) => {
    setFolders(folders.map(f => ({
      ...f,
      seeds: f.seeds.map(s => {
        if (s.id === cardId) {
          const completedIndices = (s.completedTasks || []).map(t => parseInt(t));
          const isCompleted = completedIndices.includes(index);
          const newCompleted = isCompleted 
            ? completedIndices.filter(i => i !== index)
            : [...completedIndices, index];
          
          return {
            ...s,
            completedTasks: newCompleted.map(i => i.toString())
          };
        }
        return s;
      })
    })));
  };

  const handleAddCustomTask = (cardId: string, task: string) => {
    setFolders(folders.map(f => ({
      ...f,
      seeds: f.seeds.map(s => {
        if (s.id === cardId) {
          return {
            ...s,
            tasks: [...s.tasks, task]
          };
        }
        return s;
      })
    })));
  };

  const handleDeleteTask = (cardId: string, index: number) => {
    setFolders(folders.map(f => ({
      ...f,
      seeds: f.seeds.map(s => {
        if (s.id === cardId) {
          const newTasks = s.tasks.filter((_, i) => i !== index);
          // Update completed indices
          const completedIndices = (s.completedTasks || []).map(t => parseInt(t));
          const newCompleted = completedIndices
            .filter(i => i !== index)
            .map(i => i > index ? (i - 1).toString() : i.toString());

          return {
            ...s,
            tasks: newTasks,
            completedTasks: newCompleted
          };
        }
        return s;
      })
    })));
  };

  const handleBatchDelete = () => {
    if (!activeFolderId) return;
    setFolders(folders.map(f => 
      f.id === activeFolderId 
        ? { ...f, seeds: f.seeds.filter(s => !selectedIds.includes(s.id)) } 
        : f
    ));
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreateFolder = (name: string, color: string) => {
    const newFolder: Folder = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      color,
      shapePath: generateRandomBlob(),
      seeds: []
    };
    setFolders([...folders, newFolder]);
  };

  const handleAddSeed = async (input: string, type: 'video' | 'note') => {
    if (!activeFolderId) return;
    
    // Extract URL if present for the card's URL field
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const extractedUrl = input.match(urlRegex)?.[0];
    
    const aiData = await processInspiration(input, type);
    const lastColor = currentSeeds[0]?.color;
    
    const newCard: SeedCardType = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      url: extractedUrl || undefined, // ONLY save the URL if found, otherwise undefined
      originalContent: '', // Keep empty initially as requested
      ...aiData,
      color: getRandomColor(lastColor),
      createdAt: Date.now()
    };

    setFolders(folders.map(f => 
      f.id === activeFolderId ? { ...f, seeds: [newCard, ...f.seeds] } : f
    ));
    setActiveIndex(0);
  };

  const handleUpdateNote = (newNote: string) => {
    if (!activeFolderId) return;
    const targetId = selectedCardId || focusedCardId;
    if (!targetId) return;

    setFolders(folders.map(f => 
      f.id === activeFolderId 
        ? { ...f, seeds: f.seeds.map(s => s.id === targetId ? { ...s, originalContent: newNote } : s) } 
        : f
    ));
  };

  const removeCard = (id: string) => {
    setFolders(folders.map(f => 
      f.id === activeFolderId ? { ...f, seeds: f.seeds.filter(s => s.id !== id) } : f
    ));
    if (focusedCardId === id) setFocusedCardId(null);
  };

  const deleteFolder = (id: string) => {
    if (id === 'inbox') return; // Don't delete inbox
    setFolders(folders.filter(f => f.id !== id));
  };

  const handleQuickCapture = async (text: string) => {
    setIsProcessing(true);
    try {
      // Use 'action' type for quick capture
      const aiData = await processInspiration(text, 'action');
      
      const newCard: SeedCardType = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'action',
        originalContent: text,
        ...aiData,
        color: '#FFFFFF', // Action cards are clean white
        createdAt: Date.now()
      };

      setFolders(folders.map(f => 
        f.id === 'inbox' ? { ...f, seeds: [newCard, ...f.seeds] } : f
      ));
      
      setActiveTab('garden');
      setActiveFolderId('inbox');
      setActiveIndex(0);
    } catch (error) {
      console.error('Quick capture failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSeeds = currentSeeds.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [dragOffset, setDragOffset] = useState(0);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4 relative overflow-hidden">
      {/* Design Polish: Background Elements */}
      <div className="mesh-gradient" />
      <div className="noise" />

      <div className="relative w-full max-w-[400px] aspect-[9/19.5] bg-midnight/80 backdrop-blur-3xl sm:rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col z-10">
        
        <AnimatePresence mode="wait">
          {selectedCard && activeFolder ? (
            <SeedDetail 
              key="detail"
              card={selectedCard}
              folder={activeFolder}
              onBack={() => setSelectedCardId(null)}
              onEditNote={() => setIsNoteEditorOpen(true)}
              onToggleSprout={handleToggleSprout}
            />
          ) : activeFolderId ? (
            <motion.div 
              key="folder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Folder Header */}
              <header className="px-6 pt-12 pb-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setActiveFolderId(null);
                      setIsSelectionMode(false);
                      setSelectedIds([]);
                    }}
                    className="w-10 h-10 bg-neon-pink/10 rounded-xl flex items-center justify-center text-neon-pink active:bg-neon-pink active:text-white transition-all"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-white text-2xl font-black tracking-tighter flex items-center gap-2">
                      {activeFolder?.name}
                    </h1>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">
                      {currentSeeds.length} 个灵感种子
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {isSelectionMode ? (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleBatchDelete}
                        disabled={selectedIds.length === 0}
                        className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full active:scale-95 transition-all disabled:opacity-50"
                      >
                        删除 ({selectedIds.length})
                      </button>
                      <button 
                        onClick={() => {
                          setIsSelectionMode(false);
                          setSelectedIds([]);
                        }}
                        className="text-white/40 text-[10px] font-black uppercase tracking-widest px-2"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsSelectionMode(true)}
                      className="text-white/60 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full active:bg-white/10 transition-all"
                    >
                      选择
                    </button>
                  )}
                </div>
              </header>

              {/* Search Bar */}
              <div className="px-6 mb-8 z-10">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text"
                    placeholder="搜索灵感..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-white/10 transition-colors"
                  />
                </div>
              </div>

              {/* Card Stack Area */}
              <main className="flex-1 relative perspective-1000 px-6 pb-20 overflow-y-auto no-scrollbar">
                <div className="relative min-h-[480px]">
                  <AnimatePresence mode="popLayout">
                    {viewMode === 'stack' ? (
                      <motion.div 
                        key="stack-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.6}
                        onDrag={(e, info) => {
                          setDragOffset(info.offset.y);
                        }}
                        onDragEnd={(_, info) => {
                          setDragOffset(0);
                          const velocity = info.velocity.y;
                          const offset = info.offset.y;
                          
                          // Calculate how many pages to move based on offset and velocity
                          // 150 is the approximate distance between cards in the stack
                          const pageOffset = -offset / 150;
                          const velocityOffset = -velocity / 1000;
                          const totalDelta = Math.round(pageOffset + velocityOffset);
                          
                          if (totalDelta !== 0) {
                            const nextIndex = activeIndex + totalDelta;
                            const clampedIndex = Math.max(0, Math.min(filteredSeeds.length - 1, nextIndex));
                            setActiveIndex(clampedIndex);
                          }
                        }}
                        className="relative w-full h-[480px] flex items-center justify-center preserve-3d"
                      >
                        {filteredSeeds.length > 0 ? (
                          filteredSeeds.map((card, index) => (
                            <SeedCard 
                              key={card.id} 
                              card={card} 
                              index={index} 
                              total={filteredSeeds.length}
                              onRemove={removeCard}
                              onOpenDetail={(c) => setSelectedCardId(c.id)}
                              activeIndex={activeIndex}
                              dragOffset={dragOffset}
                              layoutId={`card-${card.id}`}
                              isSelectionMode={isSelectionMode}
                              isSelected={selectedIds.includes(card.id)}
                              onToggleSelection={() => toggleSelection(card.id)}
                            />
                          ))
                        ) : (
                          <div className="text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Sparkles className="text-white/20" size={32} />
                            </div>
                            <p className="text-white/40 font-medium">文件夹还是空的。</p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="grid-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-2 gap-4 pt-4"
                      >
                        {filteredSeeds.length > 0 ? (
                          filteredSeeds.map((card) => (
                            <SeedGridItem 
                              key={card.id}
                              card={card}
                              onClick={() => isSelectionMode ? toggleSelection(card.id) : setFocusedCardId(card.id)}
                              layoutId={`card-${card.id}`}
                              isSelectionMode={isSelectionMode}
                              isSelected={selectedIds.includes(card.id)}
                            />
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Sparkles className="text-white/20" size={32} />
                            </div>
                            <p className="text-white/40 font-medium">文件夹还是空的。</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Focused Card Overlay (for Grid View) */}
                <AnimatePresence>
                  {focusedCard && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFocusedCardId(null)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150]"
                      />
                      <motion.div
                        className="fixed inset-0 flex items-center justify-center z-[151] pointer-events-none"
                      >
                        <div className="w-full max-w-[320px] h-[480px] pointer-events-auto">
                          <SeedCard 
                            card={focusedCard}
                            index={0}
                            total={1}
                            onRemove={removeCard}
                            onOpenDetail={(c) => {
                              setSelectedCardId(c.id);
                              setFocusedCardId(null);
                            }}
                            activeIndex={0}
                            layoutId={`card-${focusedCard.id}`}
                          />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </main>

              {/* Bottom Controls */}
              {!isSelectionMode && (
                <div className="fixed bottom-12 left-0 right-0 px-8 flex items-center justify-between pointer-events-none z-[110]">
                  {/* View Switcher (Left) */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setViewMode(prev => prev === 'stack' ? 'grid' : 'stack')}
                    className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white pointer-events-auto active:bg-white/20 transition-colors"
                  >
                    {viewMode === 'stack' ? <LayoutGrid size={24} /> : <Layers size={24} />}
                  </motion.button>

                  {/* Floating Add Button (Center) */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(true)}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] pointer-events-auto"
                  >
                    <Plus className="text-black" size={32} />
                  </motion.button>

                  {/* Placeholder for balance */}
                  <div className="w-14" />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="tabs-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden relative"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'garden' && (
                  <motion.div
                    key="garden-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <HomeScreen 
                      folders={folders} 
                      onSelectFolder={(f) => {
                        setActiveFolderId(f.id);
                        setActiveIndex(0);
                      }}
                      onCreateFolder={handleCreateFolder}
                      onReorderFolders={setFolders}
                      onDeleteFolder={deleteFolder}
                    />
                  </motion.div>
                )}
                {activeTab === 'capture' && (
                  <motion.div
                    key="capture-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <CaptureScreen 
                      onCapture={handleQuickCapture}
                      isProcessing={isProcessing}
                    />
                  </motion.div>
                )}
                {activeTab === 'pulse' && (
                  <motion.div
                    key="pulse-tab"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <SproutScreen 
                      folders={folders} 
                      onToggleTask={handleToggleTask}
                      onAddCustomTask={handleAddCustomTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </motion.div>
          )}
        </AnimatePresence>

        <RippleEffect />

        <InputModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleAddSeed}
        />

        <NoteEditor 
          isOpen={isNoteEditorOpen}
          onClose={() => setIsNoteEditorOpen(false)}
          initialValue={(selectedCard || focusedCard)?.originalContent || ''}
          onSubmit={handleUpdateNote}
        />
      </div>
    </div>
  );
}
