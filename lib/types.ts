/**
 * 海克斯大乱斗助手 - TypeScript 类型定义
 */

// 英雄基础信息
export interface Champion {
  id: number;
  name: string;
  title: string;
  key: string;
  tier: 'T1' | 'T2' | 'T3' | 'T4' | 'T5';
  winRate: number;
  pickRate: number;
  games: number;
  roles: string[];
  icon?: string;
}

// 海克斯品质
export type AugmentTier = 'prismatic' | 'gold' | 'silver';

// 海克斯基础信息
export interface Augment {
  id: string;
  name: string;
  nameEn: string;
  tier: AugmentTier;
  description?: string;
  icon?: string;
}

// 英雄-海克斯关联数据
export interface ChampionAugment {
  id: string;
  name: string;
  winRate: number;
  pickRate: number;
  games: number;
  rank: number;
  score?: 'S' | 'A' | 'B' | 'C' | 'D';
}

// 品质内的海克斯排名
export interface TierRanking {
  total: number;
  medianWinRate: number;
  augments: ChampionAugment[];
}

// 英雄的完整海克斯数据
export interface ChampionAugmentData {
  championId: number;
  championName: string;
  version: string;
  updatedAt: string;
  byTier: {
    prismatic: TierRanking;
    gold: TierRanking;
    silver: TierRanking;
  };
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  version: string;
  updatedAt: string;
}

// 筛选选项
export interface FilterOptions {
  role?: string;
  tier?: string;
  sortBy: 'winRate' | 'games' | 'pickRate';
  order: 'asc' | 'desc';
}
