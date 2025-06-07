
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, RotateCcw, Circle } from 'lucide-react';

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
        percentage: total > 0 ? (novo / total) * 100 : 0,
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      {
        title: 'Usado',
        value: usado,
        percentage: total > 0 ? (usado / total) * 100 : 0,
        icon: Circle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      {
        title: 'Recapado',
        value: recapado,
        percentage: total > 0 ? (recapado / total) * 100 : 0,
        icon: RotateCcw,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    ];
  }, [filteredData]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Activity className="h-6 w-6 text-primary" />
          Situação dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-4">
          {situacaoPneus.map((situacao, index) => {
            const IconComponent = situacao.icon;
            return (
              <Card key={situacao.title} className={`${situacao.bgColor} ${situacao.borderColor} border-2 hover:shadow-md transition-all duration-300 hover:scale-105`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-white shadow-sm`}>
                        <IconComponent className={`h-5 w-5 ${situacao.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{situacao.title}</h3>
                        <p className="text-sm text-gray-600">{situacao.percentage.toFixed(1)}% do total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${situacao.color}`}>
                        {situacao.value}
                      </div>
                      <div className="text-xs text-gray-500">pneus</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SituacaoPneusChart;
