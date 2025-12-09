import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const StoreMap = ({ stores, selectedStore, onStoreSelect }) => {
  const [mapCenter, setMapCenter] = useState([14.5995, 120.9842]); // Manila default

  useEffect(() => {
    if (selectedStore && selectedStore.latitude && selectedStore.longitude) {
      setMapCenter([selectedStore.latitude, selectedStore.longitude]);
    } else if (stores && stores.length > 0) {
      const firstStoreWithCoords = stores.find(s => s.latitude && s.longitude);
      if (firstStoreWithCoords) {
        setMapCenter([firstStoreWithCoords.latitude, firstStoreWithCoords.longitude]);
      }
    }
  }, [selectedStore, stores]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      key={`${mapCenter[0]}-${mapCenter[1]}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stores.map((store) =>
        store.latitude && store.longitude ? (
          <Marker
            key={store.store_id}
            position={[store.latitude, store.longitude]}
            eventHandlers={{
              click: () => onStoreSelect && onStoreSelect(store),
            }}
          >
            <Popup>
              <strong>{store.name}</strong>
              <br />
              {store.address}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default StoreMap;
