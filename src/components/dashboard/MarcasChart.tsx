
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface MarcasChartProps {
  filteredData: any[];
}

const MarcasChart = ({ filteredData }: MarcasChartProps) => {
  const marcasPneus = useMemo(() => {
    const marcas = filteredData.reduce((acc, item) => {
      if (item.Y) {
        acc[item.Y] = (acc[item.Y] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(marcas)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marcas dos Pneus</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={marcasPneus} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              interval={0} 
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'Quantidade']}
            />
            <Bar dataKey="value" fill={COLORS[1]}>
              <LabelList dataKey="value" position="top" />
              {marcasPneus.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MarcasChart;
