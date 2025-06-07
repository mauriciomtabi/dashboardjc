
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { FileText } from 'lucide-react';

const MODERN_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

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
      .map(([name, value], index) => ({ 
        name, 
        value, 
        color: MODERN_COLORS[index % MODERN_COLORS.length] 
      }));
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-4 z-[9999] relative overflow-hidden max-w-xs">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl" />
          <div className="relative z-10 space-y-2">
            <p className="font-semibold text-foreground border-b border-primary/20 pb-2 text-sm break-words">
              {label}
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground text-sm">Quantidade:</span>
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
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Top 10 Motivos de Laudo
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={motivosLaudo} 
            margin={{ top: 20, right: 30, left: 80, bottom: 60 }}
          >
            <defs>
              {motivosLaudo.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`motivoGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                </linearGradient>
              ))}
              <filter id="motivosShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              interval={0}
              tick={{ fontSize: 10, width: 200 }}
              stroke="rgba(148, 163, 184, 0.8)"
            />
            <YAxis stroke="rgba(148, 163, 184, 0.8)" />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              filter="url(#motivosShadow)"
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
              {motivosLaudo.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#motivoGradient-${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MotivosChart;
