import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getChampionById, getChampionAugmentData } from '@/lib/data';
import { AugmentRanking } from '../components/AugmentRanking';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, BarChart3 } from 'lucide-react';

interface ChampionPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChampionPage({ params }: ChampionPageProps) {
  const { id } = await params;
  const championId = parseInt(id, 10);
  
  const champion = getChampionById(championId);
  if (!champion) {
    notFound();
  }

  const augmentData = await getChampionAugmentData(championId);
  if (!augmentData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回列表
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Champion Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shrink-0">
                {champion.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{champion.name}</h1>
                  <Badge variant={getTierVariant(champion.tier)} className="text-base">
                    {champion.tier}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">{champion.title}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {champion.roles.map((role) => (
                    <Badge key={role} variant="outline">{role}</Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                    <p className="text-2xl font-bold">{champion.winRate.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">胜率</p>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <BarChart3 className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <p className="text-2xl font-bold">{champion.games.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">场次</p>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <Target className="w-5 h-5 mx-auto mb-1 text-green-500" />
                    <p className="text-2xl font-bold">{champion.pickRate}%</p>
                    <p className="text-xs text-muted-foreground">选取率</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Augment Ranking */}
        <div>
          <h2 className="text-lg font-semibold mb-4">海克斯推荐</h2>
          <AugmentRanking data={augmentData} />
        </div>
      </div>
    </main>
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
