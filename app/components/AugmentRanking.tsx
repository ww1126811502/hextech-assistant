'use client';

import { useState } from 'react';
import { ChampionAugmentData, AugmentTier } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Trophy, AlertTriangle } from 'lucide-react';

interface AugmentRankingProps {
  data: ChampionAugmentData;
}

export function AugmentRanking({ data }: AugmentRankingProps) {
  const [expandedAugments, setExpandedAugments] = useState<Set<string>>(new Set());

  const toggleExpand = (augmentId: string) => {
    const newSet = new Set(expandedAugments);
    if (newSet.has(augmentId)) {
      newSet.delete(augmentId);
    } else {
      newSet.add(augmentId);
    }
    setExpandedAugments(newSet);
  };

  const getTierLabel = (tier: AugmentTier) => {
    switch (tier) {
      case 'prismatic': return { label: '棱彩', color: 'bg-purple-500', count: data.byTier.prismatic.total };
      case 'gold': return { label: '黄金', color: 'bg-yellow-500', count: data.byTier.gold.total };
      case 'silver': return { label: '白银', color: 'bg-gray-400', count: data.byTier.silver.total };
    }
  };

  return (
    <Tabs defaultValue="prismatic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-14">
        {(['prismatic', 'gold', 'silver'] as AugmentTier[]).map((tier) => {
          const { label, color, count } = getTierLabel(tier);
          return (
            <TabsTrigger key={tier} value={tier} className="text-base font-medium">
              <span className={`w-3 h-3 rounded-full ${color} mr-2`} />
              {label}
              <span className="ml-2 text-xs text-muted-foreground">({count})</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {(['prismatic', 'gold', 'silver'] as AugmentTier[]).map((tier) => {
        const tierData = data.byTier[tier];
        const top3 = tierData.augments.slice(0, 3);
        const avoid = tierData.augments.filter(a => a.rank > tierData.total * 0.7);
        
        return (
          <TabsContent key={tier} value={tier}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {getTierLabel(tier).label}海克斯推荐
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    中位胜率 {tierData.medianWinRate}%
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* TOP 3 推荐 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    优先选择（TOP 3）
                  </h4>
                  {top3.map((augment) => (
                    <AugmentCard
                      key={augment.id}
                      augment={augment}
                      isTopPick={true}
                      isExpanded={expandedAugments.has(augment.id)}
                      onToggle={() => toggleExpand(augment.id)}
                    />
                  ))}
                </div>

                {/* 分割线 */}
                {tierData.augments.length > 3 && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      其他选择
                    </h4>
                    <div className="space-y-2">
                      {tierData.augments.slice(3, 8).map((augment) => (
                        <AugmentCard
                          key={augment.id}
                          augment={augment}
                          isTopPick={false}
                          isExpanded={expandedAugments.has(augment.id)}
                          onToggle={() => toggleExpand(augment.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 避免选择 */}
                {avoid.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      尽量避免（后30%）
                    </h4>
                    <div className="space-y-2 opacity-60">
                      {avoid.slice(0, 3).map((augment) => (
                        <AugmentCard
                          key={augment.id}
                          augment={augment}
                          isTopPick={false}
                          isExpanded={expandedAugments.has(augment.id)}
                          onToggle={() => toggleExpand(augment.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

interface AugmentCardProps {
  augment: {
    id: string;
    name: string;
    winRate: number;
    pickRate: number;
    games: number;
    rank: number;
    score?: string;
  };
  isTopPick: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function AugmentCard({ augment, isTopPick, isExpanded, onToggle }: AugmentCardProps) {
  return (
    <div className={`border rounded-lg p-3 ${isTopPick ? 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-muted-foreground w-6">
            #{augment.rank}
          </span>
          <div>
            <h5 className="font-medium">{augment.name}</h5>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={getWinRateClass(augment.winRate)}>
                胜率 {augment.winRate.toFixed(2)}%
              </span>
              <span>·</span>
              <span>选取 {augment.pickRate}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {augment.score && (
            <Badge variant={getScoreVariant(augment.score)}>{augment.score}</Badge>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-accent rounded"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
          <p>基于 {augment.games.toLocaleString()} 场对局数据</p>
          <p className="mt-1">排名第 {augment.rank} / {augment.games}场</p>
        </div>
      )}
    </div>
  );
}

function getWinRateClass(winRate: number): string {
  if (winRate >= 65) return 'text-green-600 font-semibold';
  if (winRate >= 60) return 'text-green-600';
  if (winRate >= 55) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreVariant(score: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (score) {
    case 'S': return 'default';
    case 'A': return 'secondary';
    case 'B': return 'outline';
    default: return 'destructive';
  }
}
