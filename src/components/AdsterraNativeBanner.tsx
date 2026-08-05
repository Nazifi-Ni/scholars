import { useEffect, useRef } from 'react';

export function AdsterraNativeBanner() {
  const containerId = "container-ca9c8fca25079f01c5dab2673821b2d3";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only inject if it hasn't been injected into this specific container yet
    if (ref.current && !ref.current.querySelector('script')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl30649382.effectivecpmnetwork.com/ca9c8fca25079f01c5dab2673821b2d3/invoke.js';
      
      // Append the script directly inside the container div so the ad script
      // can find it relatively if it uses document.currentScript
      ref.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden rounded-xl bg-muted/10 min-h-[90px]">
      <div id={containerId} ref={ref} className="flex justify-center items-center w-full"></div>
    </div>
  );
}
