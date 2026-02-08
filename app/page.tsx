'use client';

import { useState, useMemo } from 'react';
import { ChampionList } from './components/ChampionList';
import { SearchBox } from './components/SearchBox';
import { Button } from '@/components/ui/button';
import { Champion } from '@/lib/types';
import { getAllChampions, searchChampions, getChampionsByWinRate } from '@/lib/data';
import { Trophy, TrendingUp, Users } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'winRate' | 'games' | 'pickRate'>('winRate');
  
  const allChampions = useMemo(() => getAllChampions(), []);
  
  const filteredChampions = useMemo(() => {
    let champions = searchQuery 
      ? searchChampions(searchQuery)
      : [...allChampions];
    
    // 排序
    champions.sort((a, b) => {
      switch (sortBy) {
        case 'winRate': return b.winRate - a.winRate;
        case 'games': return b.games - a.games;
        case 'pickRate': return b.pickRate - a.pickRate;
        default: return 0;
      }
    });
    
    return champions;
  }, [searchQuery, sortBy, allChampions]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                海克斯助手
              </h1>
              <p className="text-sm text-muted-foreground">
                海克斯大乱斗数据查询 · 版本 16.3
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <SearchBox 
          onSearch={setSearchQuery} 
          placeholder="搜索英雄（中文/英文）..."
        />

        {/* Sort Options */}
        {!searchQuery && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">排序：</span>
            <Button
              variant={sortBy === 'winRate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('winRate')}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              胜率
            </Button>
            <Button
              variant={sortBy === 'games' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('games')}
            >
              场次
            </Button>
            <Button
              variant={sortBy === 'pickRate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('pickRate')}
            >
              <Users className="w-4 h-4 mr-1" />
              选取率
            </Button>
          </div>
        )}

        {/* Champion List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {searchQuery ? `搜索结果 (${filteredChampions.length})` : '英雄胜率榜'}
          </h2>
          <ChampionList champions={filteredChampions} />
        </div>
      </div>
    </main>
  );
}
