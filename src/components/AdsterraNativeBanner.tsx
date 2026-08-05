import { useEffect, useState } from 'react';

export function AdsterraNativeBanner() {
  const [height, setHeight] = useState('250px');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
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
        title="Advertisement"
        src="/adsterra-native.html"
        width="100%"
        height="100%"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
}
