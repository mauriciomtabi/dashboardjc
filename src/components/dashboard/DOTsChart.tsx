
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Hash } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface DOTsChartProps {
  filteredData: any[];
}

const DOTsChart = ({ filteredData }: DOTsChartProps) => {
  const allDOTs = useMemo(() => {
    const dots = filteredData.reduce((acc, item) => {
      if (item.G) {
        acc[item.G] = (acc[item.G] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(dots)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Todos os DOTs
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2">
        <div className="overflow-x-auto">
          <ResponsiveContainer width={Math.max(1200, allDOTs.length * 40)} height={350}>
            <BarChart data={allDOTs} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS[2]}>
                <LabelList dataKey="value" position="top" />
                {allDOTs.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DOTsChart;
