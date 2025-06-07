
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
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 hover:scale-105 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {value}
        </div>
        {percentage !== undefined && (
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
              {percentage.toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
