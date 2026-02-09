import { useEffect, useRef } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import '../styles/Map.css';

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent loading script multiple times
    if (window.google && window.google.maps) {
      new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // India
        zoom: 4,
      });
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;

    script.onload = () => {
      new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 4,
      });
    };

    document.head.appendChild(script);
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
      </div>
    </div>
  );
};

export default Map;
