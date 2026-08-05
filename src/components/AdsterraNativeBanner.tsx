import { useEffect, useRef, useState } from 'react';

export function AdsterraNativeBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState('250px');

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        if (iframeDoc.getElementById('ad-loaded')) return;

        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
              </style>
            </head>
            <body>
              <script async="async" data-cfasync="false" src="https://pl30649382.effectivecpmnetwork.com/ca9c8fca25079f01c5dab2673821b2d3/invoke.js"></script>
              <div id="container-ca9c8fca25079f01c5dab2673821b2d3"></div>
              <div id="ad-loaded"></div>
              <script>
                setInterval(() => {
                  const container = document.getElementById('container-ca9c8fca25079f01c5dab2673821b2d3');
                  if (container && container.offsetHeight > 50) {
                    window.parent.postMessage({ type: 'adsterra-resize', height: container.offsetHeight }, '*');
                  }
                }, 1000);
              </script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'adsterra-resize' && event.data?.height) {
        setHeight(\`\${event.data.height + 20}px\`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="w-full flex justify-center my-6 rounded-xl bg-muted/10 transition-all duration-300" style={{ height }}>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width="100%"
        height="100%"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}
