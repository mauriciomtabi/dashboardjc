
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, FileText, MessageCircle, Download } from 'lucide-react';
import { useShareActions } from '@/hooks/useShareActions';
import ShareActionButton from '@/components/dashboard/share/ShareActionButton';

interface ShareButtonProps {
  pageTitle: string;
}

const ShareButton = ({ pageTitle }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { generatePDF, shareWhatsApp, isGenerating } = useShareActions(pageTitle);

  const handleAction = async (action: () => Promise<void>) => {
    await action();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/30 hover:border-primary/50 text-primary hover:text-primary"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Compartilhar Relatório
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <ShareActionButton
            onClick={() => handleAction(() => generatePDF(false))}
            disabled={isGenerating}
            icon={FileText}
            title="Gerar PDF"
            description="Documento profissional em paisagem"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          />
          
          <ShareActionButton
            onClick={() => handleAction(() => generatePDF(true))}
            disabled={isGenerating}
            icon={Download}
            title="PDF para WhatsApp"
            description="PDF completo + abrir WhatsApp"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          />
          
          <ShareActionButton
            onClick={() => handleAction(shareWhatsApp)}
            disabled={isGenerating}
            icon={MessageCircle}
            title="Imagem WhatsApp"
            description="Imagem rápida da página"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          />
          
          {isGenerating && (
            <div className="text-center text-sm text-muted-foreground">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
              Processando...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;
