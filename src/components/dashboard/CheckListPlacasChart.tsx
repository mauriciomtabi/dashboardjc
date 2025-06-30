
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { CheckListData } from '@/contexts/DataContext';

interface CheckListPlacasChartProps {
  filteredData: CheckListData[];
}

const CheckListPlacasChart = ({ filteredData }: CheckListPlacasChartProps) => {
  
  const chartData = React.useMemo(() => {
    const placaCounts = filteredData.reduce((acc, item) => {
      if (item.AG) {
        acc[item.AG] = (acc[item.AG] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(placaCounts)
      .map(([placa, count]) => ({
        name: placa,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20); // Top 20 placas
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Placas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ChartContainer
            config={{
              value: {
                label: "Quantidade",
                color: "hsl(var(--chart-4))",
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

export default CheckListPlacasChart;
