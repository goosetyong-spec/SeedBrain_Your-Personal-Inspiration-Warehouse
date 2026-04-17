import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Sparkles, Brain, Flame, Calendar } from 'lucide-react';
import { Folder, SeedCard } from '../types';

interface Props {
  folders: Folder[];
}

export const PulseScreen: React.FC<Props> = ({ folders }) => {
  // Mock data for the pulse chart based on folder activity
  const chartData = [
    { name: 'Mon', active: 4 },
    { name: 'Tue', active: 7 },
    { name: 'Wed', active: 5 },
    { name: 'Thu', active: 12 },
    { name: 'Fri', active: 8 },
    { name: 'Sat', active: 15 },
    { name: 'Sun', active: 10 },
  ];

  const totalSeeds = useMemo(() => 
    folders.reduce((acc, f) => acc + f.seeds.length, 0), 
  [folders]);

  const allSeeds = useMemo(() => 
    folders.flatMap(f => f.seeds.map(s => ({ ...s, folderColor: f.color }))),
  [folders]);

  const dailyEcho = useMemo(() => {
    if (allSeeds.length === 0) return null;
    // Use current date as seed for "random" but consistent daily card
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return allSeeds[dayOfYear % allSeeds.length];
  }, [allSeeds]);

  return (
    <div className="flex-1 flex flex-col p-8 pt-20 pb-32 overflow-y-auto no-scrollbar">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-neon-pink/10 flex items-center justify-center">
            <Activity className="text-neon-pink" size={20} />
          </div>
          <h1 className="text-white text-3xl font-black tracking-tight">大脑脉冲</h1>
        </div>
        <p className="text-white/40 font-bold text-sm">洞察你的灵感成长轨迹</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/40 font-black text-[10px] uppercase tracking-widest mb-1">总灵感数</p>
            <h3 className="text-white text-4xl font-black">{totalSeeds}</h3>
          </div>
          <Brain className="absolute -right-4 -bottom-4 text-white/5" size={80} />
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/40 font-black text-[10px] uppercase tracking-widest mb-1">连续记录</p>
            <h3 className="text-white text-4xl font-black">12</h3>
          </div>
          <Flame className="absolute -right-4 -bottom-4 text-white/5" size={80} />
        </div>
      </div>

      {/* Pulse Chart */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-white font-black text-lg flex items-center gap-2">
            活跃脉冲 <Sparkles size={16} className="text-neon-pink" />
          </h2>
          <span className="text-white/30 font-bold text-xs uppercase tracking-widest">最近 7 天</span>
        </div>
        <div className="h-48 w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0080" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF0080" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 900 }} 
                dy={10}
              />
              <Tooltip 
                trigger="click"
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#FF0080' }}
              />
              <Area 
                type="monotone" 
                dataKey="active" 
                stroke="#FF0080" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorActive)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Daily Echo */}
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-white font-black text-lg flex items-center gap-2">
            每日回响 <Calendar size={16} className="text-neon-pink" />
          </h2>
        </div>
        
        {dailyEcho ? (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer"
          >
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: dailyEcho.folderColor }} 
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">
                  {dailyEcho.tag}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/20 font-bold text-[10px]">
                  {new Date(dailyEcho.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-white text-xl font-black mb-4 leading-tight group-hover:text-neon-pink transition-colors">
                {dailyEcho.title}
              </h3>
              <p className="text-white/50 font-bold text-sm leading-relaxed line-clamp-3">
                {dailyEcho.summary}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-12 text-center">
            <p className="text-white/20 font-bold text-sm italic">还没有灵感可以回响，去捕获一些吧...</p>
          </div>
        )}
      </section>
    </div>
  );
};
