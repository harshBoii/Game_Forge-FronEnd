export async function captureGameThumbnail(html: string): Promise<string> {
  return new Promise((resolve) => {
    // Create a temporary iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);

    iframe.onload = () => {
      setTimeout(() => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 600;
          const ctx = canvas.getContext('2d');
          
          if (ctx && iframe.contentDocument) {
            // Simple fallback: use a gradient
            const gradient = ctx.createLinearGradient(0, 0, 800, 600);
            gradient.addColorStop(0, '#8B5CF6');
            gradient.addColorStop(1, '#EF4444');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 800, 600);
            
            // Add game title text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 48px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Preview', 400, 300);
          }
          
          const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
          document.body.removeChild(iframe);
          resolve(thumbnail);
        } catch (error) {
          console.error('Thumbnail capture error:', error);
          document.body.removeChild(iframe);
          resolve(''); // Return empty string on error
        }
      }, 1000);
    };

    iframe.srcdoc = html;
  });
}
