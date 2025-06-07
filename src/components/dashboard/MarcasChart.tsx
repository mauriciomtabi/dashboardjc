
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
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
      {/* Efeito de brilho premium */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
          <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <Package className="h-5 w-5 text-primary relative z-10" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Marcas dos Pneus
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-2 relative z-10">
        <div className="relative">
          {/* Fundo do gráfico com gradiente sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/20 rounded-lg opacity-50" />
          
          <ResponsiveContainer width="100%" height={350}>
            <BarChart 
              data={marcasPneus} 
              layout="horizontal"
              margin={{ top: 20, right: 50, left: 80, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth={1}
              />
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
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
              />
              <Bar dataKey="value" fill="url(#marcasGradient)" radius={[0, 8, 8, 0]} className="drop-shadow-lg">
                <LabelList dataKey="value" position="right" className="fill-primary font-semibold" />
              </Bar>
              
              {/* Definindo gradiente personalizado */}
              <defs>
                <linearGradient id="marcasGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="#ef4444" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={1}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarcasChart;
