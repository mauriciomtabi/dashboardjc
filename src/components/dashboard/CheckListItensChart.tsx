
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';

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
      .sort((a, b) => b.value - a.value)
      .slice(0, 20); // Top 20 itens
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Itens Inspecionados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={{
              value: {
                label: "Quantidade",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px] min-w-[800px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={120}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckListItensChart;
