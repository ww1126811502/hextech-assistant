'use client';

import { Champion } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface ChampionListProps {
  champions: Champion[];
}

export function ChampionList({ champions }: ChampionListProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {champions.map((champion, index) => (
        <Link key={champion.id} href={`/champions/${champion.id}`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-muted-foreground w-8">
                    {index + 1}
                  </span>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {champion.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{champion.name}</h3>
                    <p className="text-sm text-muted-foreground">{champion.title}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={getTierVariant(champion.tier)} className="mb-1">
                      {champion.tier}
                    </Badge>
                    <p className={`text-lg font-bold ${getWinRateClass(champion.winRate)}`}>
                      {champion.winRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground hidden sm:block">
                    <p>{champion.games.toLocaleString()}场</p>
                    <p>选取{champion.pickRate}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

function getTierVariant(tier: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (tier) {
    case 'T1': return 'default';
    case 'T2': return 'secondary';
    case 'T3': return 'outline';
    default: return 'destructive';
  }
}

function getWinRateClass(winRate: number): string {
  if (winRate >= 58) return 'winrate-high';
  if (winRate >= 54) return 'winrate-medium';
  return 'winrate-low';
}
