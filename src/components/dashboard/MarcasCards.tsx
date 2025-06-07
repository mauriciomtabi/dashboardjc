
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface MarcasCardsProps {
  filteredData: any[];
}

const MarcasCards = ({ filteredData }: MarcasCardsProps) => {
  const marcasPneus = useMemo(() => {
    const marcas = filteredData.reduce((acc, item) => {
      if (item.Y && typeof item.Y === 'string') {
        acc[item.Y] = (acc[item.Y] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const total = filteredData.length;
    
    return Object.entries(marcas)
      .sort(([,a], [,b]) => (b || 0) - (a || 0))
      .slice(0, 8)
      .map(([name, value]) => ({
        name,
        value: value || 0,
        percentage: total > 0 ? ((value || 0) / total) * 100 : 0
      }));
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Marcas dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marcasPneus.map((marca, index) => (
            <div 
              key={`${marca.name}-${index}`} 
              className="bg-muted/50 rounded-lg p-3 text-center border"
            >
              <div className="text-lg font-bold text-primary">{marca.value}</div>
              <div className="text-xs text-muted-foreground mb-1">{String(marca.name)}</div>
              <div className="text-xs font-medium">{marca.percentage.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarcasCards;
