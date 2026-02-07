import { useEffect, useRef } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import '../styles/Map.css';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2
        });
      };
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="map-page">
      <div className="container">
        <div className="map-header">
          <FaMapMarkedAlt className="map-icon" />
          <h1>Travel Map</h1>
          <p>Visualize your destinations on the map</p>
        </div>
        <div ref={mapRef} className="map-container" />
        <div className="map-note">
          <p>Note: Add your Google Maps API key in the .env file to enable map functionality</p>
        </div>
      </div>
    </div>
  );
};

export default Map;

