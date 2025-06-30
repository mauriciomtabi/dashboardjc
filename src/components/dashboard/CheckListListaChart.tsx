
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';

interface CheckListListaChartProps {
  filteredData: CheckListData[];
}

const CheckListListaChart = ({ filteredData }: CheckListListaChartProps) => {
  
  const chartData = React.useMemo(() => {
    const listaCounts = filteredData.reduce((acc, item) => {
      if (item.Y) {
        acc[item.Y] = (acc[item.Y] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(listaCounts)
      .map(([lista, count]) => ({
        name: lista,
        value: count,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Lista de Inspeção</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Quantidade",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CheckListListaChart;
