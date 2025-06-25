
import html2canvas from 'html2canvas';

export const capturePageSections = async (): Promise<string[]> => {
  try {
    console.log('Iniciando captura por seções...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sections = [
      '.max-w-7xl > div:first-child',
      '[class*="grid"][class*="gap-6"]',
      '[class*="w-full"]',
      '.grid.grid-cols-1',
      '.grid.grid-cols-2',
      '.grid.grid-cols-3',
      '.grid.grid-cols-4',
    ];
    
    const images: string[] = [];
    
    for (const selector of sections) {
      const elements = document.querySelectorAll(selector);
      
      for (const element of elements) {
        if (element && element.scrollHeight > 50) {
          try {
            const canvas = await html2canvas(element as HTMLElement, {
              height: element.scrollHeight,
              width: element.scrollWidth,
              useCORS: true,
              allowTaint: true,
              background: '#ffffff',
              logging: false,
              scale: 2,
              onclone: (clonedDoc) => {
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
    
    if (images.length === 0) {
      const element = document.querySelector('.max-w-7xl') || document.body;
      const canvas = await html2canvas(element as HTMLElement, {
        height: Math.max(window.innerHeight * 3, element.scrollHeight),
        width: element.scrollWidth,
        useCORS: true,
        allowTaint: true,
        background: '#ffffff',
        logging: false,
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
    throw new Error(`Falha na captura da página: ${(error as Error).message}`);
  }
};
