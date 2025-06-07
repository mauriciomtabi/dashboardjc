
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
        <div className="flex flex-col items-center space-y-6">
          {/* Gráfico */}
          <div className="relative w-full max-w-[300px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={vidaPneus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
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
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-600">
                <div className="w-11 h-11 bg-gray-900 rounded-full flex items-center justify-center relative overflow-hidden">
                  {/* Padrão de banda de rodagem */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5 w-8 h-8">
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
          
          {/* Legenda abaixo em linha */}
          {vidaPneus.length > 0 && (
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-4">
                {vidaPneus.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div className="text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground ml-1">
                        ({Number(item.value)} - {((Number(item.value) / filteredData.length) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstoqueVidaPneusChart;
