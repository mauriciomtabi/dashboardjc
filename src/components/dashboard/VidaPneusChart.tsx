
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Gauge } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

interface VidaPneusChartProps {
  filteredData: any[];
}

const VidaPneusChart = ({ filteredData }: VidaPneusChartProps) => {
  const vidaPneus = useMemo(() => {
    const vidas = filteredData.reduce((acc, item) => {
      if (item.J) {
        acc[item.J] = (acc[item.J] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(vidas).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-primary font-semibold">{data.value} pneus</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Gauge className="h-6 w-6 text-primary" />
          Vida dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={vidaPneus}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {vidaPneus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Imagem do pneu no centro */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-600">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center relative overflow-hidden">
                {/* Padrão de banda de rodagem */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-0.5 w-12 h-12">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="bg-gray-700 rounded-sm"></div>
                    ))}
                  </div>
                </div>
                {/* Círculo interno */}
                <div className="absolute inset-2 bg-gray-800 rounded-full border border-gray-600"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legenda personalizada */}
        {vidaPneus.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              {vidaPneus.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value.toString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VidaPneusChart;
