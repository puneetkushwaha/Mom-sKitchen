import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LocateFixed, MapPin, Search } from 'lucide-react';

// Fix for default marker icon in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
};

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center);
    }, [center]);
    return null;
};

const MapPicker = ({ onSelectLocation, initialPosition }) => {
    const [position, setPosition] = useState(initialPosition || { lat: 26.8467, lng: 80.9462 }); // Default to Lucknow
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // Reverse Geocoding using Nominatim (Free)
    const getAddress = async (lat, lng) => {
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            setAddress(data.display_name);
            onSelectLocation({ lat, lng, address: data.display_name });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (position) {
            getAddress(position.lat, position.lng);
        }
    }, [position]);

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setPosition(newPos);
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="h-64 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner relative group">
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                    <ChangeView center={position} />
                </MapContainer>

                <button
                    onClick={handleCurrentLocation}
                    className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-xl text-primary hover:rotate-12 transition-all active:scale-90 border border-gray-100"
                    title="Use Current Location"
                >
                    <LocateFixed className="w-5 h-5" />
                </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div className="flex-grow">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Detected Address</p>
                    {loading ? (
                        <p className="text-sm font-bold animate-pulse text-gray-400 italic">Locating your kitchen...</p>
                    ) : (
                        <p className="text-sm font-black text-secondary leading-tight">{address || 'Tap on map to pick location'}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapPicker;
