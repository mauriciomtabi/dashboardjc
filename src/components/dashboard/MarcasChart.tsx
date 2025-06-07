
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Package } from 'lucide-react';

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
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Marcas dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={marcasPneus} 
            layout="horizontal"
            margin={{ top: 20, right: 50, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={70}
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              formatter={(value, name) => [value, 'Quantidade']}
              labelFormatter={(label) => `Marca: ${label}`}
            />
            <Bar dataKey="value" fill={COLORS[1]} radius={[0, 8, 8, 0]}>
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MarcasChart;
