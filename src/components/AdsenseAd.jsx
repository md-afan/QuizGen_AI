import { useEffect } from 'react';

const AdsenseAd = ({ 
  client = "ca-pub-2929289514348107", // Your AdSense client ID
  slot, 
  format = "auto", 
  style = { display: 'block' },
  responsive = true 
}) => {
  useEffect(() => {
    try {
      // Load AdSense script if not already loaded
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2929289514348107';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      
      // Trigger ad refresh
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className="my-4 text-center">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdsenseAd;