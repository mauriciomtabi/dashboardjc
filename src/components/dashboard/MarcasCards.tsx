
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
      .sort(([,a], [,b]) => {
        const numA = typeof a === 'number' ? a : 0;
        const numB = typeof b === 'number' ? b : 0;
        return numB - numA;
      })
      .slice(0, 8)
      .map(([name, value]) => {
        const numValue = typeof value === 'number' ? value : 0;
        return {
          name,
          value: numValue,
          percentage: total > 0 ? (numValue / total) * 100 : 0
        };
      });
  }, [filteredData]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-6 w-6 text-primary" />
          Marcas dos Pneus
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marcasPneus.map((marca, index) => (
            <div 
              key={`${marca.name}-${index}`} 
              className="group bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 rounded-xl p-4 text-center border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-md min-h-[120px] flex flex-col justify-center"
            >
              <div className="text-2xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                {marca.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                {marca.name}
              </div>
              <div className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-1">
                {marca.percentage.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarcasCards;
