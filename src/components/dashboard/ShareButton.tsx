
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Share2, FileText, MessageCircle, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  pageTitle: string;
}

const ShareButton = ({ pageTitle }: ShareButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const capturePageSections = async (): Promise<string[]> => {
    try {
      console.log('Iniciando captura por seções...');
      
      // Aguardar um pouco para garantir que a página está totalmente carregada
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sections = [
        '.max-w-7xl > div:first-child', // Header
        '[class*="grid"][class*="gap-6"]', // Cards sections
        '[class*="w-full"]', // Charts sections
      ];
      
      const images: string[] = [];
      
      for (const selector of sections) {
        const elements = document.querySelectorAll(selector);
        
        for (const element of elements) {
          if (element && element.scrollHeight > 50) { // Só capturar elementos com conteúdo
            try {
              const canvas = await html2canvas(element as HTMLElement, {
                height: element.scrollHeight,
                width: element.scrollWidth,
                useCORS: true,
                allowTaint: true,
                background: '#ffffff',
                logging: false,
                foreignObjectRendering: true,
                imageTimeout: 15000,
                scale: 2, // Melhor qualidade
                onclone: (clonedDoc) => {
                  // Garantir que estilos sejam aplicados no clone
                  const clonedElement = clonedDoc.querySelector(selector);
                  if (clonedElement) {
                    (clonedElement as HTMLElement).style.transform = 'none';
                  }
                }
              });
              
              images.push(canvas.toDataURL('image/png', 0.9));
            } catch (error) {
              console.warn(`Erro ao capturar seção ${selector}:`, error);
            }
          }
        }
      }
      
      // Se não conseguiu capturar por seções, tenta capturar a página inteira
      if (images.length === 0) {
        const element = document.querySelector('.max-w-7xl') || document.body;
        const canvas = await html2canvas(element as HTMLElement, {
          height: window.innerHeight * 3, // Altura maior para capturar scroll
          width: element.scrollWidth,
          useCORS: true,
          allowTaint: true,
          background: '#ffffff',
          logging: false,
          foreignObjectRendering: true,
          imageTimeout: 15000,
          scale: 1.5,
          scrollX: 0,
          scrollY: 0,
        });
        
        images.push(canvas.toDataURL('image/png', 0.9));
      }
      
      console.log(`Capturadas ${images.length} seções`);
      return images;
      
    } catch (error) {
      console.error('Erro detalhado na captura:', error);
      throw new Error(`Falha na captura da página: ${error.message}`);
    }
  };

  const generatePDF = async (forWhatsApp = false) => {
    setIsGenerating(true);
    try {
      console.log('=== INICIANDO GERAÇÃO DE PDF ===');
      
      toast({
        title: forWhatsApp ? "Gerando PDF para WhatsApp..." : "Gerando PDF...",
        description: "Aguarde enquanto processamos sua solicitação.",
      });

      const images = await capturePageSections();
      console.log('Imagens capturadas com sucesso para PDF');
      
      // Criar PDF em modo paisagem
      const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' = landscape (paisagem)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Cabeçalho da primeira página
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text(pageTitle, 20, 25);
      
      pdf.setFontSize(12);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 20, 35);
      
      // Linha separadora
      pdf.setDrawColor(59, 130, 246);
      pdf.line(20, 40, pdfWidth - 20, 40);
      
      let currentY = 50;
      
      // Adicionar cada imagem capturada
      images.forEach((imgData, index) => {
        if (index > 0) {
          // Nova página para cada seção (exceto a primeira)
          pdf.addPage();
          currentY = 20;
        }
        
        // Calcular dimensões mantendo proporção
        const maxWidth = pdfWidth - 40;
        const maxHeight = pdfHeight - 80;
        
        // Criar imagem temporária para obter dimensões
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          let imgWidth = maxWidth;
          let imgHeight = imgWidth / aspectRatio;
          
          if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = imgHeight * aspectRatio;
          }
          
          // Centralizar horizontalmente
          const x = (pdfWidth - imgWidth) / 2;
          
          try {
            pdf.addImage(imgData, 'PNG', x, currentY, imgWidth, imgHeight);
          } catch (error) {
            console.warn('Erro ao adicionar imagem ao PDF:', error);
          }
        };
        img.src = imgData;
        
        // Valores padrão caso a imagem não carregue
        const imgWidth = Math.min(maxWidth, 250);
        const imgHeight = Math.min(maxHeight, 150);
        const x = (pdfWidth - imgWidth) / 2;
        
        pdf.addImage(imgData, 'PNG', x, currentY, imgWidth, imgHeight);
      });
      
      // Rodapé na última página
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text('Relatório gerado automaticamente - Gestão de Pneus JC', 20, pdfHeight - 10);
        pdf.text(`Página ${i} de ${totalPages}`, pdfWidth - 40, pdfHeight - 10);
      }
      
      // Salvar
      const fileName = `${pageTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Salvando PDF:', fileName);
      
      if (forWhatsApp) {
        // Para WhatsApp, criar link de download
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        // Preparar mensagem para WhatsApp
        setTimeout(() => {
          const whatsappMessage = encodeURIComponent(`Confira este relatório: ${pageTitle}`);
          const whatsappUrl = `https://web.whatsapp.com/send?text=${whatsappMessage}`;
          window.open(whatsappUrl, '_blank');
        }, 1000);
        
        toast({
          title: "PDF baixado para WhatsApp!",
          description: "O arquivo foi baixado e o WhatsApp será aberto.",
        });
      } else {
        pdf.save(fileName);
        toast({
          title: "PDF gerado com sucesso!",
          description: "O arquivo foi baixado para seu dispositivo.",
        });
      }
      
      setIsOpen(false);
      
    } catch (error) {
      console.error('=== ERRO NA GERAÇÃO DE PDF ===', error);
      toast({
        title: "Erro ao gerar PDF",
        description: `Falha: ${error.message}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const shareWhatsApp = async () => {
    setIsGenerating(true);
    try {
      console.log('=== INICIANDO COMPARTILHAMENTO WHATSAPP ===');
      
      toast({
        title: "Preparando compartilhamento...",
        description: "Gerando imagem para WhatsApp.",
      });

      const images = await capturePageSections();
      console.log('Imagens capturadas para WhatsApp');
      
      // Para WhatsApp, vamos criar uma imagem compilada ou usar a primeira seção
      const mainImage = images[0];
      
      // Criar link para download da imagem
      const link = document.createElement('a');
      link.download = `${pageTitle.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = mainImage;
      
      // Adicionar ao DOM temporariamente
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download da imagem iniciado');
      
      // Preparar mensagem para WhatsApp
      const whatsappMessage = encodeURIComponent(`Confira este relatório: ${pageTitle}`);
      const whatsappUrl = `https://web.whatsapp.com/send?text=${whatsappMessage}`;
      
      // Aguardar um pouco antes de abrir WhatsApp
      setTimeout(() => {
        console.log('Abrindo WhatsApp Web');
        window.open(whatsappUrl, '_blank');
      }, 1000);
      
      toast({
        title: "Imagem baixada!",
        description: "A imagem foi baixada e o WhatsApp será aberto.",
      });
      
      setIsOpen(false);
      
    } catch (error) {
      console.error('=== ERRO NO COMPARTILHAMENTO WHATSAPP ===', error);
      toast({
        title: "Erro ao compartilhar",
        description: `Falha: ${error.message}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
          <Button
            onClick={() => generatePDF(false)}
            disabled={isGenerating}
            className="flex items-center gap-3 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            <FileText className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Gerar PDF</div>
              <div className="text-xs opacity-90">Documento profissional em paisagem</div>
            </div>
          </Button>
          
          <Button
            onClick={() => generatePDF(true)}
            disabled={isGenerating}
            className="flex items-center gap-3 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Download className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">PDF para WhatsApp</div>
              <div className="text-xs opacity-90">PDF completo + abrir WhatsApp</div>
            </div>
          </Button>
          
          <Button
            onClick={shareWhatsApp}
            disabled={isGenerating}
            className="flex items-center gap-3 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Imagem WhatsApp</div>
              <div className="text-xs opacity-90">Imagem rápida da página</div>
            </div>
          </Button>
          
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
