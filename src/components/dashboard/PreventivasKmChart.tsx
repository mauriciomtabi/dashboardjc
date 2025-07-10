import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PreventivaData } from '@/contexts/DataContext';

interface PreventivasKmChartProps {
  filteredData: PreventivaData[];
}

const PreventivasKmChart: React.FC<PreventivasKmChartProps> = ({ filteredData }) => {
  const data = React.useMemo(() => {
    return filteredData
      .map(item => ({
        placa: item.K || 'Não informado',
        kmVencida: parseInt(item.U) || 0,
      }))
      .filter(item => item.kmVencida > 0)
      .sort((a, b) => b.kmVencida - a.kmVencida)
      .slice(0, 20);
  }, [filteredData]);

  const chartConfig = {
    kmVencida: {
      label: "Km Vencida",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 20 Placas - Vencimento por KM</CardTitle>
        <CardDescription>Placas mais próximas do vencimento por quilometragem</CardDescription>
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
              <Bar dataKey="kmVencida" fill="var(--color-kmVencida)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PreventivasKmChart;