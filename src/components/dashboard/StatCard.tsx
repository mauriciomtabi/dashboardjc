
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, percentage, icon, className }: StatCardProps) => {
  return (
    <Card className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background via-background to-muted/30 hover:scale-[1.02] ${className}`}>
      {/* Efeito de luz de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Efeito de brilho no canto */}
      <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Borda luminosa */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]">
        <div className="w-full h-full rounded-lg bg-background" />
      </div>
      
      <div className="relative z-10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {title}
          </CardTitle>
          {icon && (
            <div className="p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-lg">
              <div className="group-hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] transition-all duration-300">
                {icon}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary transition-all duration-300 drop-shadow-sm">
            {value}
          </div>
          {percentage !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden relative">
                  {/* Fundo com brilho sutil */}
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/40 to-muted/60" />
                  {/* Barra de progresso com efeito de brilho */}
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary/70 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    {/* Efeito de brilho animado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap min-w-[3rem] group-hover:text-foreground transition-colors duration-300">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              {/* Detalhes adicionais */}
              <div className="flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors duration-300" />
                  Meta atingida
                </span>
                <span className="font-medium">
                  {percentage >= 100 ? 'Completo' : percentage >= 75 ? 'Alto' : percentage >= 50 ? 'Médio' : 'Baixo'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </div>
      
      {/* Efeito de partículas de luz */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute top-3 left-3 w-1 h-1 bg-primary/40 rounded-full animate-pulse" />
        <div className="absolute top-6 right-8 w-0.5 h-0.5 bg-primary/30 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-8 left-6 w-0.5 h-0.5 bg-primary/20 rounded-full animate-pulse delay-700" />
      </div>
    </Card>
  );
};

export default StatCard;
