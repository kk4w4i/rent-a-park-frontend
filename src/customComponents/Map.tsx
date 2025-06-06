import { MapContainer, TileLayer, Marker, ZoomControl, Popup, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './css/Map.css'
import { useEffect, useCallback, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { Listing } from '../types/Listing';
import L from 'leaflet';
import ListingCard from './ListingCard';

type MapProps = {
    center: [number, number];
    listings: Listing[];
    onViewportChange?: (state: { center: [number, number]; zoom: number }) => void;
};

// This component is used to change the view of the map when the center changes
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

// This function is used to create the price pill icon for the marker on map
function getPricePillIcon(price: number) {
    return L.divIcon({
        className: '',
        html: `<div class="price-pill">${price ? `$${price}` : ''}</div>`,
        iconSize: [60, 32],
        iconAnchor: [30, 32],
        popupAnchor: [-40, -15],
    });
}

// This component is used to handle the map events and update the viewport when the map is moved or zoomed
function MapEvents({ onViewportChange }: { onViewportChange: (state: { center: [number, number]; zoom: number }) => void }) {
    const lastCenter = useRef<[number, number]>([0, 0]);
    const lastZoom = useRef<number>(13);

    // This function is used to handle the viewport change event and update the state
    // only when the center or zoom level changes
    // This prevents the function from being called multiple times when the map is moved or zoomed
    // and only calls the function when the center or zoom level changes
    const handleViewportChange = useCallback(
        (center: [number, number], zoom: number) => {
        if (
            center[0] !== lastCenter.current[0] ||
            center[1] !== lastCenter.current[1] ||
            zoom !== lastZoom.current
        ) {
            lastCenter.current = center;
            lastZoom.current = zoom;
            onViewportChange({ center, zoom });
        }
        },
        [onViewportChange]
    );

    // This function is used to handle the map events and update the viewport when the map is moved or zoomed
    const map = useMapEvents({
        moveend: () => {
            const center = [map.getCenter().lat, map.getCenter().lng] as [number, number];
            handleViewportChange(center, map.getZoom());
        },
        zoomend: () => {
            const center = [map.getCenter().lat, map.getCenter().lng] as [number, number];
            handleViewportChange(center, map.getZoom());
        }
    });

    return null;
}

export default function ModernMap({ center, listings, onViewportChange }: MapProps & { onViewportChange?: (state: { center: [number, number]; zoom: number }) => void }) {
    return (
      <div className="map-wrapper">
        <MapContainer 
          center={center} 
          zoom={13} 
          className="modern-map" 
          zoomControl={false}
        >
          {onViewportChange && <MapEvents onViewportChange={onViewportChange} />}
          <ChangeView center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
            subdomains="abcd"
            minZoom={0}
            maxZoom={20}
          />
          
          {listings.map(listing => (
            <Marker
              key={listing.listing_id}
              position={[listing.latitude, listing.longitude]}
              icon={getPricePillIcon(listing.rate)}
            >
              <Popup closeButton={false}>
                <ListingCard listing={listing} />
              </Popup>
            </Marker>
          ))}
          
          <ZoomControl position="bottomleft" />
        </MapContainer>
      </div>
    );
  }