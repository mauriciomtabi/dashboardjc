
export const openWhatsApp = (message: string): void => {
  const whatsappMessage = encodeURIComponent(message);
  const whatsappUrl = `https://web.whatsapp.com/send?text=${whatsappMessage}`;
  window.open(whatsappUrl, '_blank');
};

export const downloadImage = (imageData: string, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = imageData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
