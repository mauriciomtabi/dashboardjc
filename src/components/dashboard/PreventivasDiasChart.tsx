import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PreventivaData } from '@/contexts/DataContext';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

interface PreventivasDiasChartProps {
  filteredData: PreventivaData[];
}

const PreventivasDiasChart: React.FC<PreventivasDiasChartProps> = ({ filteredData }) => {
  const { setActiveFilter, activeFilter } = useInteractiveFilter();
  const data = React.useMemo(() => {
    return filteredData
      .map(item => ({
        placa: item.placa || 'Não informado',
        diasVencida: parseInt(item.vencidaDias) || 0,
      }))
      .filter(item => item.diasVencida > 0)
      .sort((a, b) => b.diasVencida - a.diasVencida);
  }, [filteredData]);

  const chartConfig = {
    diasVencida: {
      label: "Dias Vencida",
      color: "hsl(var(--chart-primary))",
    },
  };

  const handleBarClick = (data: any) => {
    if (activeFilter.type === 'placa' && activeFilter.value === data.placa) {
      setActiveFilter({ type: null, value: null });
    } else {
      setActiveFilter({ type: 'placa', value: data.placa });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vencimento por Dias</CardTitle>
        <CardDescription>Placas mais próximas do vencimento por dias</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig}>
          <div className="w-full overflow-x-auto">
            <div style={{ minWidth: Math.max(800, data.length * 60), height: '220px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="diasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(120 85% 55%)" />
                      <stop offset="100%" stopColor="hsl(120 85% 35%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="placa" 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="diasVencida" fill="url(#diasGradient)" cursor="pointer" onClick={handleBarClick}>
                    <LabelList dataKey="diasVencida" position="top" fontSize={12} />
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={activeFilter.type === 'placa' && activeFilter.value === entry.placa 
                          ? "hsl(var(--chart-primary) / 0.8)" 
                          : "url(#diasGradient)"
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PreventivasDiasChart;