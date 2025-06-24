
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ShareActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
}

const ShareActionButton = ({ 
  onClick, 
  disabled, 
  icon: Icon, 
  title, 
  description, 
  className 
}: ShareActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 h-12 ${className}`}
    >
      <Icon className="h-5 w-5" />
      <div className="text-left">
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-90">{description}</div>
      </div>
    </Button>
  );
};

export default ShareActionButton;
