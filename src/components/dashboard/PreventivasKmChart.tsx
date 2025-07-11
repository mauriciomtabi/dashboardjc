import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PreventivaData } from '@/contexts/DataContext';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

interface PreventivasKmChartProps {
  filteredData: PreventivaData[];
}

const PreventivasKmChart: React.FC<PreventivasKmChartProps> = ({ filteredData }) => {
  const { setActiveFilter, activeFilter } = useInteractiveFilter();
  const data = React.useMemo(() => {
    return filteredData
      .map(item => ({
        placa: item.placa || 'Não informado',
        kmVencida: parseInt(item.vencidaKm) || 0,
      }))
      .filter(item => item.kmVencida > 0)
      .sort((a, b) => b.kmVencida - a.kmVencida);
  }, [filteredData]);

  const chartConfig = {
    kmVencida: {
      label: "Km Vencida",
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
        <CardTitle>Vencimento por KM</CardTitle>
        <CardDescription>Placas mais próximas do vencimento por quilometragem</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[250px]">
          <div className="w-full overflow-x-auto h-full">
            <div style={{ minWidth: Math.max(800, data.length * 60), height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
                  <defs>
                    <linearGradient id="kmGradient" x1="0" y1="0" x2="0" y2="1">
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
                  <Bar dataKey="kmVencida" fill="url(#kmGradient)" cursor="pointer" onClick={handleBarClick}>
                    <LabelList dataKey="kmVencida" position="top" fontSize={12} />
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={activeFilter.type === 'placa' && activeFilter.value === entry.placa 
                          ? "hsl(var(--chart-primary) / 0.8)" 
                          : "url(#kmGradient)"
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

export default PreventivasKmChart;