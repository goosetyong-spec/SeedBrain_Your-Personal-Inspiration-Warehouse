export type TabType = 'garden' | 'capture' | 'pulse';

export interface SeedCard {
  id: string;
  type: 'video' | 'note' | 'action';
  url?: string;
  originalContent?: string;
  title: string;
  tag: string;
  color: string;
  summary: string;
  prospects: string;
  tasks: string[];
  completedTasks?: string[]; // Store indices or task strings
  isSprouting?: boolean;
  sproutStartedAt?: number;
  createdAt: number;
  coverImage?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  shapePath: string;
  seeds: SeedCard[];
}

export interface AIResponse {
  title: string;
  tag: string;
  summary: string;
  prospects: string;
  tasks: string[];
  coverImage?: string;
}
