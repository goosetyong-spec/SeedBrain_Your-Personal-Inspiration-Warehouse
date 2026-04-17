import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Plus, Brain, ArrowRight, ChevronRight, Flower, TreePine } from 'lucide-react';
import { SproutLogo } from './SproutLogo';
import { Folder, SeedCard } from '../types';

interface Props {
  folders: Folder[];
  onToggleTask: (cardId: string, index: number) => void;
  onAddCustomTask: (cardId: string, task: string) => void;
  onDeleteTask: (cardId: string, index: number) => void;
}

export const SproutScreen: React.FC<Props> = ({ 
  folders, 
  onToggleTask, 
  onAddCustomTask,
  onDeleteTask 
}) => {
  const [selectedSproutId, setSelectedSproutId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');

  const sproutingSeeds = useMemo(() => 
    folders.flatMap(f => f.seeds.filter(s => s.isSprouting)),
  [folders]);

  const selectedSprout = useMemo(() => 
    sproutingSeeds.find(s => s.id === selectedSproutId),
  [sproutingSeeds, selectedSproutId]);

  const getGrowthStage = (card: SeedCard) => {
    const completed = card.completedTasks?.length || 0;
    
    if (completed >= 8) return { label: '结果', color: '#FFD700', stage: 'fruit' as const };
    if (completed >= 3) return { label: '开花', color: '#FF0080', stage: 'flower' as const };
    return { label: '幼芽', color: '#70FF00', stage: 'sprout' as const };
  };

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 pb-32 overflow-hidden relative">
      <header className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-white text-5xl font-display font-black tracking-tighter flex items-center gap-2">
            数字苗圃
            <SproutLogo size={40} />
          </h1>
        </motion.div>
        <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.3em] mt-3 ml-1">见证灵感从幼芽到硕果</p>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {sproutingSeeds.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {sproutingSeeds.map((seed) => {
              const stageInfo = getGrowthStage(seed);
              const totalSteps = seed.tasks.length;
              const completedCount = seed.completedTasks?.length || 0;
              const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

              return (
                <motion.div
                  key={seed.id}
                  layoutId={`sprout-${seed.id}`}
                  onClick={() => setSelectedSproutId(seed.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* Soil Block */}
                  <div className="relative w-full aspect-square bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center overflow-hidden group-hover:bg-white/10 transition-all duration-500">
                    {/* Soil Texture */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* The Sprout */}
                    <div className="relative z-10">
                      <SproutLogo 
                        size={64} 
                        color={stageInfo.color} 
                        animate={true} 
                        stage={stageInfo.stage}
                      />
                    </div>

                    {/* Progress Fill */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out opacity-20" 
                      style={{ height: `${progress}%`, backgroundColor: stageInfo.color }}
                    />
                  </div>

                    <div className="mt-4 text-center">
                      <h3 className="text-white font-display font-bold text-sm tracking-tight truncate w-full px-2 group-hover:text-neon-pink transition-colors">
                        {seed.title}
                      </h3>
                      <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: stageInfo.color }}>
                            {stageInfo.label}
                          </span>
                          <span className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em]">
                            {completedCount}/{seed.tasks.length}
                          </span>
                        </div>
                      </div>
                    </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <SproutLogo className="w-10 h-10 opacity-20" />
            </div>
            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.2em] max-w-[200px]">
              还没有正在发芽的灵感。去花园里挑选一个开始执行吧！
            </p>
          </div>
        )}
      </div>

      {/* Sprout Detail Modal */}
      <AnimatePresence>
        {selectedSprout && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSproutId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200]"
            />
            <motion.div
              layoutId={`sprout-${selectedSprout.id}`}
              className="fixed inset-x-4 top-20 bottom-32 bg-midnight border border-white/10 rounded-[3rem] z-[201] flex flex-col overflow-hidden"
            >
              <div className="p-8 flex flex-col h-full">
                <header className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center">
                      <SproutLogo 
                        size={32} 
                        color={getGrowthStage(selectedSprout).color} 
                        animate={true}
                        stage={getGrowthStage(selectedSprout).stage}
                      />
                    </div>
                    <div>
                      <h2 className="text-white text-xl font-black tracking-tight font-display">{selectedSprout.title}</h2>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                        执行进度 {selectedSprout.tasks.length > 0 ? Math.round((selectedSprout.completedTasks?.length || 0) / selectedSprout.tasks.length * 100) : 0}% ({selectedSprout.completedTasks?.length || 0}/{selectedSprout.tasks.length})
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedSproutId(null)}
                    className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                  {/* Task List */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white/40 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 size={12} /> 行动清单
                      </h3>
                      <span className="text-white/20 text-[8px] font-black uppercase tracking-widest">
                        左滑删除
                      </span>
                    </div>
                    <div className="space-y-3">
                      {selectedSprout.tasks.map((task, i) => {
                        const isCompleted = selectedSprout.completedTasks?.includes(i.toString());
                        return (
                          <div key={`${selectedSprout.id}-task-${i}`} className="relative group overflow-hidden rounded-2xl">
                            {/* Delete Action (Background) */}
                            <div className="absolute inset-0 bg-red-600 flex items-center justify-end px-5">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteTask(selectedSprout.id, i);
                                }}
                                className="h-full flex items-center gap-2 text-white/90 active:scale-95 transition-transform"
                              >
                                <span className="text-[10px] font-black uppercase tracking-widest">确认删除</span>
                                <Plus size={16} className="rotate-45" />
                              </button>
                            </div>

                            <motion.div
                              drag="x"
                              dragConstraints={{ left: -100, right: 0 }}
                              dragElastic={0.1}
                              dragSnapToOrigin={false}
                              whileDrag={{ cursor: 'grabbing' }}
                              className={`relative w-full p-4 rounded-2xl border flex items-start gap-4 transition-all text-left z-10 touch-pan-y min-h-[4rem] ${
                                isCompleted 
                                  ? 'bg-[#1A1115] border-neon-pink/20 text-white/40' 
                                  : 'bg-[#1A1A1A] border-white/5 text-white'
                              }`}
                              onClick={() => onToggleTask(selectedSprout.id, i)}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-0.5 ${
                                isCompleted ? 'bg-neon-pink text-white' : 'bg-white/10 text-white/20'
                              }`}>
                                {isCompleted ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">{i + 1}</span>}
                              </div>
                              <p className={`text-sm font-bold leading-relaxed flex-1 ${isCompleted ? 'line-through' : ''}`}>
                                {task}
                              </p>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* Add Custom Task */}
                  <section>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="添加你自己的行动..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTask.trim()) {
                            onAddCustomTask(selectedSprout.id, newTask.trim());
                            setNewTask('');
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-white/20 focus:outline-none focus:border-neon-pink/50 transition-colors"
                      />
                      <button 
                        onClick={() => {
                          if (newTask.trim()) {
                            onAddCustomTask(selectedSprout.id, newTask.trim());
                            setNewTask('');
                          }
                        }}
                        className="absolute right-2 top-2 w-10 h-10 bg-neon-pink rounded-xl flex items-center justify-center text-white"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </section>

                  {/* AI Suggestion */}
                  <section className="bg-neon-pink/5 border border-neon-pink/10 p-6 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Brain size={16} className="text-neon-pink" />
                        <h3 className="text-neon-pink font-black text-[10px] uppercase tracking-widest">AI 下一步建议</h3>
                      </div>
                      <button 
                        onClick={() => {
                          const suggestions = [
                            "进一步细化产品原型，并寻找 3 位潜在用户进行初步访谈。",
                            "收集用户对当前设计的反馈，并列出 Top 3 改进建议。",
                            "调研市面上类似产品，分析它们的核心优势与不足。",
                            "为下一步的推广写一篇 300 字左右的小红书种草文案。",
                            "整理已有的参考资料，并将其分类存档到对应文件夹。"
                          ];
                          const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
                          onAddCustomTask(selectedSprout.id, randomSuggestion);
                        }}
                        className="text-neon-pink font-black text-[10px] uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        获取建议 <ArrowRight size={10} />
                      </button>
                    </div>
                    <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                      根据你目前的进度，点击“获取建议”让 AI 为你下一步的成长提供具体的行动方案。
                    </p>
                  </section>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
