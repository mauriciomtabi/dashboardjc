import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PreventivaData } from '@/contexts/DataContext';

interface PreventivasDiasChartProps {
  filteredData: PreventivaData[];
}

const PreventivasDiasChart: React.FC<PreventivasDiasChartProps> = ({ filteredData }) => {
  const data = React.useMemo(() => {
    return filteredData
      .map(item => ({
        placa: item.K || 'Não informado',
        diasVencida: parseInt(item.V) || 0,
      }))
      .filter(item => item.diasVencida > 0)
      .sort((a, b) => b.diasVencida - a.diasVencida)
      .slice(0, 20);
  }, [filteredData]);

  const chartConfig = {
    diasVencida: {
      label: "Dias Vencida",
      color: "hsl(var(--warning))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 20 Placas - Vencimento por Dias</CardTitle>
        <CardDescription>Placas mais próximas do vencimento por dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="placa" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="diasVencida" fill="var(--color-diasVencida)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PreventivasDiasChart;