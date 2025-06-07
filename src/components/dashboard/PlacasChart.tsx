
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Truck } from 'lucide-react';

const MODERN_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

interface PlacasChartProps {
  filteredData: any[];
}

const PlacasChart = ({ filteredData }: PlacasChartProps) => {
  const topPlacas = useMemo(() => {
    const placas = filteredData.reduce((acc, item) => {
      if (item.AB) {
        acc[item.AB] = (acc[item.AB] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(placas)
      .sort(([,a]: [string, number], [,b]: [string, number]) => b - a)
      .slice(0, 25)
      .map(([name, value], index) => ({ 
        name, 
        value, 
        color: MODERN_COLORS[index % MODERN_COLORS.length] 
      }));
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-4 z-[9999] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl" />
          <div className="relative z-10 space-y-2">
            <p className="font-semibold text-foreground border-b border-primary/20 pb-2">
              Placa: {label}
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Quantidade:</span>
              <span className="font-bold text-lg text-primary">{payload[0].value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
          <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          Placas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="overflow-x-auto">
          <ResponsiveContainer width={Math.max(1200, topPlacas.length * 40)} height={350}>
            <BarChart data={topPlacas} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <defs>
                {topPlacas.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`placaGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
                <filter id="placasShadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                interval={0}
                tick={{ fontSize: 10 }}
                stroke="rgba(148, 163, 184, 0.8)"
              />
              <YAxis stroke="rgba(148, 163, 184, 0.8)" />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                filter="url(#placasShadow)"
                radius={[8, 8, 0, 0]}
              >
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: '600',
                    fill: '#1e40af'
                  }}
                />
                {topPlacas.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#placaGradient-${index})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlacasChart;
