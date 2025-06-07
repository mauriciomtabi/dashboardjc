
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface EstoqueVidaPneusChartProps {
  filteredData: any[];
}

const EstoqueVidaPneusChart = ({ filteredData }: EstoqueVidaPneusChartProps) => {
  const vidaPneus = useMemo(() => {
    const vidas = filteredData.reduce((acc, item) => {
      if (item.F) {
        acc[item.F] = (acc[item.F] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(vidas).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vida dos Pneus</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={vidaPneus}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {vidaPneus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EstoqueVidaPneusChart;
