
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Gauge } from 'lucide-react';

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
    <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-full bg-primary/10">
            <Gauge className="h-6 w-6 text-primary" />
          </div>
          Vida dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-8">
          {/* Gráfico */}
          <div className="relative flex-1">
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
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
          
          {/* Legenda no lado direito */}
          {vidaPneus.length > 0 && (
            <div className="w-48 space-y-3">
              {vidaPneus.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name} {Number(item.value)}</div>
                    <div className="text-xs text-muted-foreground">
                      ({((Number(item.value) / filteredData.length) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstoqueVidaPneusChart;
