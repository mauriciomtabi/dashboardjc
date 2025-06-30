
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';
import { ClipboardList } from 'lucide-react';

interface CheckListItensChartProps {
  filteredData: CheckListData[];
}

const CheckListItensChart = ({ filteredData }: CheckListItensChartProps) => {
  
  const chartData = React.useMemo(() => {
    const itemCounts = filteredData.reduce((acc, item) => {
      if (item.T) {
        acc[item.T] = (acc[item.T] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(itemCounts)
      .map(([item, count]) => ({
        name: item,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      {/* Efeito de brilho premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <ClipboardList className="h-5 w-5 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Itens Inspecionados
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="overflow-x-auto">
          <div className="relative">
            {/* Fundo do gráfico com gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
            
            <ResponsiveContainer width={Math.max(1200, chartData.length * 60)} height={300}>
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.2)"
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <ChartTooltip 
                  formatter={(value, name) => [value, 'Quantidade']}
                  labelFormatter={(label) => label}
                  labelStyle={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}
                  contentStyle={{ 
                    maxWidth: '300px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
                <Bar dataKey="value" fill="url(#itensGradient)" radius={[8, 8, 0, 0]} className="drop-shadow-lg">
                  <LabelList dataKey="value" position="top" className="fill-primary font-semibold" />
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Bar>
                
                {/* Definindo gradiente personalizado */}
                <defs>
                  <linearGradient id="itensGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="50%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckListItensChart;
