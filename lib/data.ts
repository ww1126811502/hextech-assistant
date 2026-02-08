import { Champion, Augment, ChampionAugmentData } from './types';
import championsData from '@/data/champions.json';
import augmentsData from '@/data/augments.json';

// 获取所有英雄
export function getAllChampions(): Champion[] {
  return championsData.champions;
}

// 获取单个英雄
export function getChampionById(id: number): Champion | undefined {
  return championsData.champions.find(c => c.id === id);
}

// 搜索英雄
export function searchChampions(query: string): Champion[] {
  const lowerQuery = query.toLowerCase();
  return championsData.champions.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.key.toLowerCase().includes(lowerQuery) ||
    c.title.toLowerCase().includes(lowerQuery)
  );
}

// 按胜率排序英雄
export function getChampionsByWinRate(): Champion[] {
  return [...championsData.champions].sort((a, b) => b.winRate - a.winRate);
}

// 获取所有海克斯
export function getAllAugments(): Augment[] {
  return augmentsData.augments;
}

// 获取单个海克斯
export function getAugmentById(id: string): Augment | undefined {
  return augmentsData.augments.find(a => a.id === id);
}

// 获取英雄的海克斯排名数据（服务端）
export async function getChampionAugmentData(championId: number): Promise<ChampionAugmentData | null> {
  try {
    const data = await import(`@/data/rankings/${championId}.json`);
    return data.default || data;
  } catch {
    return null;
  }
}

// 获取英雄的海克斯排名数据（客户端）
export async function fetchChampionAugmentData(championId: number): Promise<ChampionAugmentData | null> {
  try {
    const res = await fetch(`/api/augments?championId=${championId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
