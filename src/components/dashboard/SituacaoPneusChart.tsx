
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from './StatCard';
import { Activity } from 'lucide-react';

interface SituacaoPneusChartProps {
  filteredData: any[];
}

const SituacaoPneusChart = ({ filteredData }: SituacaoPneusChartProps) => {
  const situacaoPneus = useMemo(() => {
    const situacoes = filteredData.reduce((acc, item) => {
      if (item.M) {
        acc[item.M] = (acc[item.M] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const total = filteredData.length;
    const novo = situacoes['N'] || 0;
    const usado = situacoes['U'] || 0;
    const recapado = situacoes['R'] || 0;
    
    return [
      {
        title: 'Novo',
        value: novo,
        percentage: total > 0 ? (novo / total) * 100 : 0
      },
      {
        title: 'Usado',
        value: usado,
        percentage: total > 0 ? (usado / total) * 100 : 0
      },
      {
        title: 'Recapado',
        value: recapado,
        percentage: total > 0 ? (recapado / total) * 100 : 0
      }
    ];
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Situação dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-4">
          {situacaoPneus.map((situacao, index) => (
            <StatCard
              key={situacao.title}
              title={situacao.title}
              value={situacao.value}
              percentage={situacao.percentage}
              className="bg-secondary/30 border-secondary/50"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SituacaoPneusChart;
