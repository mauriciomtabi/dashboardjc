
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { ManutencaoData } from '@/contexts/DataContext';
import { Truck } from 'lucide-react';

interface ManutencaoVeiculosChartProps {
  filteredData: ManutencaoData[];
}

const ManutencaoVeiculosChart = ({ filteredData }: ManutencaoVeiculosChartProps) => {
  
  const chartData = React.useMemo(() => {
    const veiculoCounts = filteredData.reduce((acc, item) => {
      if (item.B) {
        if (!acc[item.B]) {
          acc[item.B] = { preventiva: 0, corretiva: 0, custoTotal: 0 };
        }
        
        const valor = parseFloat(item.Q) || 0;
        acc[item.B].custoTotal += valor;
        
        if (item.Z === 'P') {
          acc[item.B].preventiva += valor;
        } else if (item.Z === 'C') {
          acc[item.B].corretiva += valor;
        }
      }
      return acc;
    }, {} as Record<string, { preventiva: number; corretiva: number; custoTotal: number }>);

    return Object.entries(veiculoCounts)
      .map(([veiculo, counts]) => ({
        name: veiculo,
        preventiva: counts.preventiva,
        corretiva: counts.corretiva,
        total: counts.custoTotal,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  }, [filteredData]);

  const chartConfig = {
    preventiva: {
      label: "Preventiva",
      color: "#10b981",
    },
    corretiva: {
      label: "Corretiva", 
      color: "#ef4444",
    },
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <Truck className="h-5 w-5 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Top 15 Veículos - Custo de Manutenção
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="overflow-x-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
            
            <ChartContainer config={chartConfig} className="w-full h-[300px]">
              <ResponsiveContainer width={Math.max(1000, chartData.length * 60)} height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                  <YAxis 
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        name === 'preventiva' ? 'Preventiva' : 'Corretiva'
                      ]}
                    />} 
                  />
                  <Bar 
                    dataKey="preventiva" 
                    stackId="manutencao"
                    fill="#10b981"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="corretiva" 
                    stackId="manutencao"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                  >
                    <LabelList dataKey="total" position="top" fontSize={10} formatter={(value) => `R$ ${(Number(value) / 1000).toFixed(0)}k`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManutencaoVeiculosChart;
