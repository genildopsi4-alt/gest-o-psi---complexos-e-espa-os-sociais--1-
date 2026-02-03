import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RedeItem } from '../types';

// Fix for default Leaflet icons in React using CDN URLs
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const redeData: RedeItem[] = [
    { id: 1, nome: "Complexo Social Mais Infância João XXIII", tipo: "Complexo", lat: -3.7599, lng: -38.5724, regiao: "joao23", endereco: "Rua Araguaiana, 77 - João XXIII" },
    { id: 2, nome: "UAPS João XXIII (Posto de Saúde)", tipo: "UAPS", lat: -3.7605, lng: -38.5720, regiao: "joao23", endereco: "Rua Júlio Braga, 1331 - João XXIII" },
    { id: 3, nome: "CRAS João XXIII", tipo: "CRAS", lat: -3.7620, lng: -38.5750, regiao: "joao23", endereco: "Rua Visconde de Cauípe, 200 - João XXIII" },
    { id: 4, nome: "CREAS Regional III", tipo: "CREAS", lat: -3.7500, lng: -38.5700, regiao: "joao23", endereco: "Rua Prof. Lino Encarnação" },
    { id: 5, nome: "Complexo Social Mais Infância Curió", tipo: "Complexo", lat: -3.8320, lng: -38.4870, regiao: "curio", endereco: "Rua Paulo Freire, s/n" },
    { id: 6, nome: "UAPS Terezinha Parente", tipo: "UAPS", lat: -3.8300, lng: -38.4800, regiao: "curio", endereco: "Rua da Paz, s/n" },
    { id: 7, nome: "CRAS Palmeiras", tipo: "CRAS", lat: -3.8350, lng: -38.4850, regiao: "curio", endereco: "Rua Valdir Diogo" },
    { id: 8, nome: "Complexo Social Cristo Redentor", tipo: "Complexo", lat: -3.7126, lng: -38.5635, regiao: "cristo", endereco: "Rua Camélia, 450" },
    { id: 9, nome: "UAPS Casemiro Filho", tipo: "UAPS", lat: -3.7180, lng: -38.5620, regiao: "cristo", endereco: "Av. Francisco Sá, 6449" },
    { id: 10, nome: "Vapt Vupt Antônio Bezerra", tipo: "Cidadania", lat: -3.7350, lng: -38.5850, regiao: "joao23", endereco: "Rua Demétrio Menezes, 3750" }
];

// Component to handle map view changes based on selected item
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const Rede: React.FC = () => {
    const [filter, setFilter] = useState<'todas' | 'joao23' | 'curio' | 'cristo'>('todas');
    const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({ center: [-3.75, -38.55], zoom: 12 });

    const filteredData = redeData.filter(item => filter === 'todas' || item.regiao === filter);

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter as any);
        if (newFilter === 'todas') {
            setMapState({ center: [-3.75, -38.55], zoom: 12 });
        } else {
             // Find first item of region to center
            const firstItem = redeData.find(item => item.regiao === newFilter);
            if (firstItem) {
                setMapState({ center: [firstItem.lat, firstItem.lng], zoom: 14 });
            }
        }
    };

    const handleItemClick = (item: RedeItem) => {
        setMapState({ center: [item.lat, item.lng], zoom: 16 });
    };

    const getBadgeColor = (tipo: string) => {
        if (['UAPS', 'CAPS', 'Hospital'].some(t => tipo.includes(t))) return "bg-red-100 text-red-800";
        if (['CRAS', 'CREAS'].includes(tipo)) return "bg-purple-100 text-purple-800";
        if (['Conselho Tutelar', 'Segurança'].includes(tipo)) return "bg-orange-100 text-orange-800";
        if (tipo === 'Complexo') return "bg-green-100 text-green-800 font-bold";
        return "bg-gray-200 text-gray-700";
    };

    const getIconColor = (tipo: string) => {
        if (['UAPS', 'CAPS', 'Hospital'].some(t => tipo.includes(t))) return "red";
        if (['CRAS', 'CREAS'].includes(tipo)) return "purple";
        if (['Conselho Tutelar', 'Segurança'].includes(tipo)) return "orange";
        if (tipo === 'Complexo') return "green";
        return "blue";
    }

    return (
        <section className="p-6 md:p-8 animate-fade-in h-full flex flex-col">
            <header className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
                <div className="flex gap-2 w-full md:w-auto">
                    <input type="text" placeholder="Buscar CAPS, CRAS..." className="pl-4 pr-4 py-2 border rounded-lg text-sm w-full md:w-64 outline-none focus:ring-emerald-500 border-gray-300 focus:border-emerald-500" />
                    <select
                        className="border rounded-lg text-sm px-3 py-2 bg-white border-gray-300 outline-none focus:ring-emerald-500 focus:border-emerald-500"
                        value={filter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option value="todas">Todas as Regionais</option>
                        <option value="joao23">Região João XXIII</option>
                        <option value="curio">Região Curió</option>
                        <option value="cristo">Região Cristo Redentor</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
                {/* Coluna da Esquerda: Mapa */}
                <div className="lg:col-span-2 bg-gray-100 rounded-lg shadow-inner relative overflow-hidden border border-gray-300 z-0">
                    <MapContainer center={[-3.75, -38.55]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController center={mapState.center} zoom={mapState.zoom} />
                        {filteredData.map(item => (
                            <Marker key={item.id} position={[item.lat, item.lng]}>
                                <Popup>
                                    <div>
                                        <b className="text-gray-900">{item.nome}</b><br />
                                        <span style={{ color: getIconColor(item.tipo) }} className="font-semibold text-sm">{item.tipo}</span><br />
                                        <small className="text-gray-500">{item.endereco}</small>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Coluna da Direita: Lista */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col h-full overflow-hidden">
                    <h3 className="font-bold text-gray-700 mb-3 border-b pb-2 flex-shrink-0">Equipamentos Listados</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {filteredData.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className="p-3 border-b border-gray-100 hover:bg-emerald-50 cursor-pointer transition rounded group"
                            >
                                <h4 className="font-bold text-gray-800 text-sm group-hover:text-emerald-700">{item.nome}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded inline-block mt-1 ${getBadgeColor(item.tipo)}`}>{item.tipo}</span>
                                <p className="text-xs text-gray-500 mt-1 flex items-center">
                                    <i className="fa-solid fa-location-dot mr-1 text-gray-400"></i>{item.endereco}
                                </p>
                            </div>
                        ))}
                        {filteredData.length === 0 && (
                            <p className="text-center text-gray-400 text-sm mt-10">Nenhum equipamento encontrado nesta região.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Rede;
