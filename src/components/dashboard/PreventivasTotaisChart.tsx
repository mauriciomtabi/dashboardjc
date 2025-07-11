import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PreventivaData } from '@/contexts/DataContext';
import { useInteractiveFilter } from '@/contexts/InteractiveFilterContext';

interface PreventivasTotaisChartProps {
  filteredData: PreventivaData[];
}

const PreventivasTotaisChart: React.FC<PreventivasTotaisChartProps> = ({ filteredData }) => {
  const { setActiveFilter, activeFilter } = useInteractiveFilter();
  const data = React.useMemo(() => {
    const preventivas = filteredData.reduce((acc: { [key: string]: number }, item) => {
      const preventiva = item.preventiva || 'Não informado';
      acc[preventiva] = (acc[preventiva] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(preventivas)
      .map(([preventiva, total]) => ({
        preventiva,
        total
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredData]);

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-primary))",
    },
  };

  const handleBarClick = (data: any) => {
    if (activeFilter.type === 'preventiva' && activeFilter.value === data.preventiva) {
      setActiveFilter({ type: null, value: null });
    } else {
      setActiveFilter({ type: 'preventiva', value: data.preventiva });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preventivas por Tipo</CardTitle>
        <CardDescription>Quantidade de preventivas por tipo (maior para menor)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 60 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(120 85% 55%)" />
                  <stop offset="100%" stopColor="hsl(120 85% 35%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="preventiva" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="url(#barGradient)" cursor="pointer" onClick={handleBarClick}>
                <LabelList dataKey="total" position="top" fontSize={12} />
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={activeFilter.type === 'preventiva' && activeFilter.value === entry.preventiva 
                      ? "hsl(var(--chart-primary) / 0.8)" 
                      : "url(#barGradient)"
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PreventivasTotaisChart;