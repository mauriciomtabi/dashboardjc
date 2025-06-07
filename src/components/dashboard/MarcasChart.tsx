
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Package } from 'lucide-react';

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-4 z-[9999] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/5 rounded-xl" />
          <div className="relative z-10 space-y-2">
            <p className="font-semibold text-foreground border-b border-primary/20 pb-2">
              Marca: {label}
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
            <Package className="h-5 w-5 text-primary" />
          </div>
          Marcas dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={marcasPneus} 
            layout="horizontal"
            margin={{ top: 20, right: 50, left: 80, bottom: 20 }}
          >
            <defs>
              <linearGradient id="marcasGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity={0.9}/>
                <stop offset="100%" stopColor="#1e40af" stopOpacity={1}/>
              </linearGradient>
              <filter id="marcasShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.3"/>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis type="number" stroke="rgba(148, 163, 184, 0.8)" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={70}
              tick={{ fontSize: 11 }}
              stroke="rgba(148, 163, 184, 0.8)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="url(#marcasGradient)"
              filter="url(#marcasShadow)"
              radius={[0, 8, 8, 0]}
            >
              <LabelList 
                dataKey="value" 
                position="right" 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  fill: '#1e40af'
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MarcasChart;
