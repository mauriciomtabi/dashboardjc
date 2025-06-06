
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
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentage !== undefined && (
          <p className="text-xs text-muted-foreground">
            {percentage.toFixed(1)}% do total
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
