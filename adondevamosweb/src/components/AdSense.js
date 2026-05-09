import React, { useEffect, useRef } from 'react';

/**
 * Google AdSense Component
 * @param {string} slot - AdSense ad slot ID (data-ad-slot)
 * @param {string} format - Ad format (auto, fluid, rectangle, vertical, horizontal)
 * @param {boolean} responsive - Whether the ad is responsive (default: true)
 * @param {string} style - Custom inline styles for the ad container
 * @param {string} className - Custom CSS class name
 */
const AdSense = ({ 
  slot, 
  format = 'auto', 
  responsive = true,
  style = {},
  className = '' 
}) => {
  const clientId = process.env.REACT_APP_ADSENSE_CLIENT_ID;
  const adRef = useRef(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    // Only load ads if client ID is configured and ad hasn't been pushed yet
    if (clientId && clientId !== 'ca-pub-XXXXXXXXXXXXXXXX' && !isAdPushed.current) {
      try {
        // Check if the ad element exists and doesn't already have an ad
        const insElement = adRef.current?.querySelector('.adsbygoogle');
        if (insElement && !insElement.getAttribute('data-adsbygoogle-status')) {
          // Push ads to adsbygoogle array
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          isAdPushed.current = true;
        }
      } catch (error) {
        // Silently handle the error if ad already exists
        if (!error.message?.includes('already have ads')) {
          console.error('AdSense error:', error);
        }
      }
    }

    // Cleanup function to reset on unmount
    return () => {
      isAdPushed.current = false;
    };
  }, [clientId, slot]);

  // Don't render if no client ID is set or it's the placeholder
  if (!clientId || clientId === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return null;
  }

  return (
    <div ref={adRef} className={className} style={style}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdSense;
