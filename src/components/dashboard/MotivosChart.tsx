
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { FileText } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface MotivosChartProps {
  filteredData: any[];
}

const MotivosChart = ({ filteredData }: MotivosChartProps) => {
  const motivosLaudo = useMemo(() => {
    const motivos = filteredData.reduce((acc, item) => {
      if (item.S) {
        acc[item.S] = (acc[item.S] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(motivos)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Top 10 Motivos de Laudo
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={motivosLaudo} 
            margin={{ top: 20, right: 30, left: 80, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fontSize: 10, width: 200 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, 'Quantidade']}
              labelFormatter={(label) => label}
              labelStyle={{ whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '200px' }}
              contentStyle={{ maxWidth: '300px' }}
            />
            <Bar dataKey="value" fill={COLORS[0]} radius={[8, 8, 0, 0]}>
              <LabelList dataKey="value" position="top" />
              {motivosLaudo.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MotivosChart;
