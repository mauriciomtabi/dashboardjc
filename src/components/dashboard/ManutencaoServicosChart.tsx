
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ManutencaoData } from '@/contexts/DataContext';
import { Wrench } from 'lucide-react';

interface ManutencaoServicosChartProps {
  filteredData: ManutencaoData[];
}

const ManutencaoServicosChart = ({ filteredData }: ManutencaoServicosChartProps) => {
  const chartData = useMemo(() => {
    const servicoData = filteredData.reduce((acc, item) => {
      if (!item.AK) return acc;
      
      if (!acc[item.AK]) {
        acc[item.AK] = { Corretiva: 0, Preventiva: 0 };
      }
      
      const valor = parseFloat(item.Q) || 0;
      if (item.Z === 'C') {
        acc[item.AK].Corretiva += valor;
      } else if (item.Z === 'P') {
        acc[item.AK].Preventiva += valor;
      }
      
      return acc;
    }, {} as Record<string, { Corretiva: number; Preventiva: number }>);

    return Object.entries(servicoData)
      .map(([servico, custos]) => ({
        name: servico,
        Corretiva: custos.Corretiva,
        Preventiva: custos.Preventiva,
        total: custos.Corretiva + custos.Preventiva
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-5">
          <p className="font-semibold text-foreground text-lg border-b border-primary/20 pb-2">
            Serviço: {label}
          </p>
          <div className="space-y-2 mt-3">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="font-medium text-foreground">{entry.dataKey}</span>
                </div>
                <span className="font-bold text-lg" style={{ color: entry.color }}>
                  {entry.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-foreground">Total:</span>
                <span className="font-bold text-lg text-primary">
                  {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <Wrench className="h-5 w-5 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Top 10 Custo por Serviço
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-2 pb-2 relative z-10">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '14px', fontWeight: '600', paddingTop: '20px' }} />
            <Bar dataKey="Corretiva" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Preventiva" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ManutencaoServicosChart;
