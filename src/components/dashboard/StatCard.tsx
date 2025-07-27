
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'estoque' | 'conforme' | 'nao-conforme';
}

const StatCard = ({ title, value, percentage, icon, className, variant = 'default' }: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'estoque':
        return {
          sideDetailColor: 'bg-gradient-to-b from-emerald-500 to-emerald-600',
          progressColor: 'from-emerald-500 via-emerald-400 to-emerald-500',
          iconBgColor: 'from-emerald-500/10 to-emerald-500/20 group-hover:from-emerald-500/20 group-hover:to-emerald-500/30',
          glowColor: 'group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
          lightAccentColor: 'from-emerald-500/20 via-transparent to-emerald-500/20',
          backgroundGradient: 'from-emerald-500/5 via-transparent to-emerald-500/10',
          cornerGlow: 'from-emerald-500/20',
          valueColor: 'text-emerald-600'
        };
      case 'conforme':
        return {
          sideDetailColor: 'bg-gradient-to-b from-green-500 to-green-600',
          progressColor: 'from-green-500 via-green-400 to-green-500',
          iconBgColor: 'from-green-500/10 to-green-500/20 group-hover:from-green-500/20 group-hover:to-green-500/30',
          glowColor: 'group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]',
          lightAccentColor: 'from-green-500/20 via-transparent to-green-500/20',
          backgroundGradient: 'from-green-500/5 via-transparent to-green-500/10',
          cornerGlow: 'from-green-500/20',
          valueColor: 'text-green-600'
        };
      case 'nao-conforme':
        return {
          sideDetailColor: 'bg-gradient-to-b from-red-500 to-red-600',
          progressColor: 'from-red-500 via-red-400 to-red-500',
          iconBgColor: 'from-red-500/10 to-red-500/20 group-hover:from-red-500/20 group-hover:to-red-500/30',
          glowColor: 'group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
          lightAccentColor: 'from-red-500/20 via-transparent to-red-500/20',
          backgroundGradient: 'from-red-500/5 via-transparent to-red-500/10',
          cornerGlow: 'from-red-500/20',
          valueColor: 'text-red-600'
        };
      default:
        return {
          sideDetailColor: 'bg-gradient-to-b from-primary to-primary/80',
          progressColor: 'from-primary via-primary/90 to-primary/70',
          iconBgColor: 'from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30',
          glowColor: 'group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
          lightAccentColor: 'from-primary/20 via-transparent to-primary/20',
          backgroundGradient: 'from-primary/5 via-transparent to-primary/10',
          cornerGlow: 'from-primary/20',
          valueColor: 'text-primary'
        };
    }
  };

  const styles = getVariantStyles();

  const getDefaultIcon = () => {
    if (variant === 'conforme') {
      return <Check className="h-4 w-4" />;
    }
    if (variant === 'nao-conforme') {
      return <X className="h-4 w-4" />;
    }
    return null;
  };

  const displayIcon = icon || getDefaultIcon();

  return (
    <Card className={`group relative overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background via-background to-muted/30 hover:scale-[1.02] ${className}`}>
      {/* Detalhe lateral esquerdo com efeito 3D */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.sideDetailColor} group-hover:w-2 transition-all duration-300 shadow-lg`}>
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-40" />
      </div>
      
      {/* Efeito de luz de fundo premium */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.backgroundGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Efeito de brilho premium no canto */}
      <div className={`absolute -top-2 -right-2 w-24 h-24 bg-gradient-to-br ${styles.cornerGlow} to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700`} />
      
      {/* Borda luminosa avançada */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${styles.lightAccentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]`}>
        <div className="w-full h-full rounded-lg bg-background" />
      </div>
      
      {/* Reflexo sutil no topo */}
      <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="relative z-10 ml-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {title}
          </CardTitle>
          {displayIcon && (
            <div className={`p-2 rounded-full bg-gradient-to-br ${styles.iconBgColor} transition-all duration-300 group-hover:scale-110 shadow-sm group-hover:shadow-lg relative overflow-hidden`}>
              {/* Brilho interno do ícone */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              <div className={`${styles.glowColor} transition-all duration-300 relative z-10`}>
                {displayIcon}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          <div className={`text-xl font-bold ${styles.valueColor} transition-all duration-300 drop-shadow-sm`}>
            {value}
          </div>
          {percentage !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Barra de progresso premium */}
                <div className="h-2 w-full bg-gradient-to-r from-muted/40 to-muted/60 rounded-full overflow-hidden relative shadow-inner">
                  {/* Fundo com textura sutil */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent" />
                  {/* Barra de progresso com múltiplos efeitos */}
                  <div 
                    className={`h-full bg-gradient-to-r ${styles.progressColor} rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-lg`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    {/* Efeito de brilho animado na barra */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                    {/* Reflexo superior */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-semibold whitespace-nowrap min-w-[3rem] group-hover:text-foreground transition-colors duration-300 tabular-nums">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </div>
      
      {/* Sistema de partículas de luz premium */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className={`absolute top-4 left-4 w-1.5 h-1.5 ${styles.cornerGlow.replace('from-', 'bg-').replace('/20', '/40')} rounded-full animate-pulse`} />
        <div className={`absolute top-8 right-8 w-1 h-1 ${styles.cornerGlow.replace('from-', 'bg-').replace('/20', '/30')} rounded-full animate-pulse delay-300`} />
        <div className={`absolute bottom-6 left-8 w-0.5 h-0.5 ${styles.cornerGlow.replace('from-', 'bg-').replace('/20', '/20')} rounded-full animate-pulse delay-700`} />
        <div className={`absolute bottom-8 right-6 w-1 h-1 ${styles.cornerGlow.replace('from-', 'bg-').replace('/20', '/25')} rounded-full animate-pulse delay-1000`} />
      </div>
      
      {/* Efeito de ondulação no hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${styles.backgroundGradient} animate-pulse`} />
      </div>
    </Card>
  );
};

export default StatCard;
