
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface DOTsChartProps {
  filteredData: any[];
}

const DOTsChart = ({ filteredData }: DOTsChartProps) => {
  const topDOTs = useMemo(() => {
    const dots = filteredData.reduce((acc, item) => {
      if (item.G) {
        acc[item.G] = (acc[item.G] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(dots)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 20)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 20 DOTs mais recorrentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ResponsiveContainer width={Math.max(800, topDOTs.length * 40)} height={300}>
            <BarChart data={topDOTs} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                interval={0}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS[2]}>
                <LabelList dataKey="value" position="top" />
                {topDOTs.map((entry, index) => (
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
