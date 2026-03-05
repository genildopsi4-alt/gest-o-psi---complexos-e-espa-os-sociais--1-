import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RedeItem } from '../types';

// Fix for default Leaflet icons using CDN
const defaultIconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl: defaultIconUrl, shadowUrl, iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

// ---------- Ícones coloridos por categoria ----------
function createColorIcon(color: string) {
    return L.divIcon({
        className: '',
        html: `<div style="
            background:${color};
            width:22px;height:32px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.4);
        "></div>`,
        iconAnchor: [11, 32],
        popupAnchor: [1, -34],
    });
}

const ICONS: Record<string, L.DivIcon> = {
    Complexo: createColorIcon('#10b981'),  // verde
    CAPS: createColorIcon('#ef4444'),  // vermelho
    UAPS: createColorIcon('#f97316'),  // laranja
    CRAS: createColorIcon('#8b5cf6'),  // roxo
    CREAS: createColorIcon('#6d28d9'),  // roxo escuro
    UA: createColorIcon('#ec4899'),  // rosa
    Residência: createColorIcon('#14b8a6'),  // teal
    Cidadania: createColorIcon('#3b82f6'),  // azul
};

function getIcon(tipo: string) {
    for (const key of Object.keys(ICONS)) {
        if (tipo.includes(key)) return ICONS[key];
    }
    return ICONS['Cidadania'];
}

// ---------- Dados reais da RAPS / UAPS ----------
const redeData: RedeItem[] = [
    // --- SR I ---
    { id: 1, nome: 'CAPS AD 24h Dr. Airton Monte', tipo: 'CAPS AD', lat: -3.7095, lng: -38.5528, regiao: 'SR I', endereco: 'Av. Monsenhor Hélio Campos, 138 – Cristo Redentor', telefone: '(85) 3433-9513', responsavel: '' },
    { id: 2, nome: 'CAPS Geral Nise da Silveira', tipo: 'CAPS Geral', lat: -3.7210, lng: -38.5460, regiao: 'SR I', endereco: 'Rua Soares Bulcão, 1494 – São Gerardo', telefone: '(85) 3105-1119', responsavel: '' },

    // --- SR II ---
    { id: 3, nome: 'CAPS AD Glauco Lobo', tipo: 'CAPS AD', lat: -3.7328, lng: -38.5023, regiao: 'SR II', endereco: 'Rua Pinto Madeira, 1550 – Aldeota', telefone: '(85) 3105-2632', responsavel: '' },

    // --- SR III ---
    { id: 4, nome: 'UAPS César Cals de Oliveira Filho', tipo: 'UAPS', lat: -3.7720, lng: -38.5910, regiao: 'SR III', endereco: 'Rua Pernambuco, 3172 – Pici', telefone: '(85) 3233-4055', responsavel: 'Maria Rachel Ribeiro Sombra' },
    { id: 5, nome: 'UAPS Gilmário Mourão (CEDEFAM/UFC)', tipo: 'UAPS', lat: -3.7680, lng: -38.5870, regiao: 'SR III', endereco: 'Rua Pernambuco, 1674 – Planalto Pici', telefone: '(85) 3366-9371', responsavel: 'Prof. Bernardo Diniz Coutinho' },
    { id: 6, nome: 'CAPS Infantil Estudante Nogueira Jucá', tipo: 'CAPS Infantil', lat: -3.7530, lng: -38.5710, regiao: 'SR III', endereco: 'Rua Porfírio Sampaio, 1905 – Rodolfo Teófilo', telefone: '(85) 3105-3721', responsavel: 'Luiz Henrique Sampaio Martins' },
    { id: 7, nome: 'CAPS Geral Prof. Gerardo da Frota Pinto', tipo: 'CAPS Geral', lat: -3.7480, lng: -38.5680, regiao: 'SR III', endereco: 'Rua Francisco Pedro, 1269 – Rodolfo Teófilo', telefone: '(85) 3433-2568', responsavel: 'Francelina Gonçalves Bandeira' },
    { id: 8, nome: 'CAPS AD – Amadeu Furtado', tipo: 'CAPS AD', lat: -3.7560, lng: -38.5800, regiao: 'SR III', endereco: 'Rua Gal. Bernardo Figueiredo, 1991 – Amadeu Furtado', telefone: '(85) 3105-3722', responsavel: 'Solange Cid Holanda' },

    // --- SR IV ---
    { id: 9, nome: 'CAPS AD Alto da Coruja', tipo: 'CAPS AD', lat: -3.7900, lng: -38.5410, regiao: 'SR IV', endereco: 'Rua Betel, 1826 – Itaperi', telefone: '(85) 3493-5538', responsavel: '' },

    // --- SR V / XI ---
    { id: 10, nome: 'CAPS Infantil Granja Portugal', tipo: 'CAPS Infantil', lat: -3.8210, lng: -38.6150, regiao: 'SR V/XI', endereco: 'Rua Antônio Nery, s/n (esq. Humberto Lomeu) – Granja Portugal', telefone: '(85) 2018-0050', responsavel: 'Francisco Wagner Pereira Menezes' },
    { id: 11, nome: 'CAPS Geral Bom Jardim', tipo: 'CAPS Geral', lat: -3.8290, lng: -38.6340, regiao: 'SR V/XI', endereco: 'Rua Bom Jesus, 940 – Bom Jardim', telefone: '(85) 3245-7956', responsavel: 'Ana Cristina Lopes do Nascimento' },
    { id: 12, nome: 'CAPS AD Granja Portugal', tipo: 'CAPS AD', lat: -3.8230, lng: -38.6140, regiao: 'SR V/XI', endereco: 'Rua Antônio Nery, s/n – Granja Portugal', telefone: '(85) 3105-1023', responsavel: 'Ana Paula Moura' },
    { id: 13, nome: 'UAPS Dr. João Barbosa Pires', tipo: 'UAPS', lat: -3.8270, lng: -38.6230, regiao: 'SR V/XI', endereco: 'Rua Rubi, s/n – Jd. Jatobá', telefone: '(85) 3498-4745', responsavel: '' },
    { id: 14, nome: 'UA Dr. Silas Munguba (Acolhimento)', tipo: 'UA', lat: -3.8310, lng: -38.6280, regiao: 'SR V/XI', endereco: 'Av. D, 400 – 2ª Etapa, José Walter', telefone: '(85) 3473-7882', responsavel: 'Ana Paula Moura' },
    { id: 15, nome: 'Residência Terapêutica Bom Sucesso', tipo: 'Residência', lat: -3.8350, lng: -38.6200, regiao: 'SR V/XI', endereco: 'Rua Emílio de Menezes, 1245 – Bom Sucesso', telefone: '(85) 3497-4885', responsavel: 'Ana Cristina Lopes do Nascimento' },
    { id: 16, nome: 'UAPS Dr. Pontes Neto', tipo: 'UAPS', lat: -3.8190, lng: -38.6370, regiao: 'SR V/XI', endereco: 'Rua 541, nº 150 – 2ª etapa, Conjunto Ceará', telefone: '(85) 3452-2487', responsavel: '' },
    { id: 17, nome: 'UAPS Ronaldo Albuquerque', tipo: 'UAPS', lat: -3.8240, lng: -38.6400, regiao: 'SR V/XI', endereco: 'Av. I, s/n – Conj. Ceará/Genibaú', telefone: '(85) 3259-1741', responsavel: '' },
];

// Contatos de articulação
const articuladores = [
    { cargo: 'Articuladora de Saúde Mental SR V/XI', nome: 'Fabiana Mariano Costa', email: 'fabianacosta2006@yahoo.com.br' },
    { cargo: 'Articuladora de Saúde Mental SR III', nome: 'Maria do Perpétuo Socorro', email: 'pedrazul_1@yahoo.com.br' },
    { cargo: 'Gerente Célula de Saúde Mental (SMS)', nome: 'Berta Augusta Faraday S. Pinheiro', email: 'berta.pinheiro@sms.fortaleza.ce.gov.br' },
    { cargo: 'Interface com Atenção Primária (APS)', nome: 'Mariana Pinheiro', email: 'mariana.pinheiro@sms.fortaleza.ce.gov.br' },
];

// Legenda
const LEGENDA = [
    { tipo: 'CAPS AD', cor: '#ef4444', label: 'CAPS Álcool & Drogas' },
    { tipo: 'CAPS Infantil', cor: '#f97316', label: 'CAPS Infantil' },
    { tipo: 'CAPS Geral', cor: '#dc2626', label: 'CAPS Geral' },
    { tipo: 'UAPS', cor: '#f97316', label: 'UAPS / Atenção Primária' },
    { tipo: 'UA', cor: '#ec4899', label: 'Unidade de Acolhimento' },
    { tipo: 'Residência', cor: '#14b8a6', label: 'Residência Terapêutica' },
    { tipo: 'Complexo', cor: '#10b981', label: 'Complexo Social' },
];

// MapController
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
    return null;
};

// Badge de tipo
function getBadgeStyle(tipo: string) {
    if (tipo.includes('CAPS AD')) return { background: '#fee2e2', color: '#b91c1c' };
    if (tipo.includes('CAPS Infantil')) return { background: '#ffedd5', color: '#c2410c' };
    if (tipo.includes('CAPS')) return { background: '#fecaca', color: '#991b1b' };
    if (tipo.includes('UAPS')) return { background: '#fed7aa', color: '#9a3412' };
    if (tipo.includes('CRAS')) return { background: '#ede9fe', color: '#6d28d9' };
    if (tipo.includes('CREAS')) return { background: '#ddd6fe', color: '#5b21b6' };
    if (tipo.includes('UA')) return { background: '#fce7f3', color: '#9d174d' };
    if (tipo.includes('Residência')) return { background: '#ccfbf1', color: '#0f766e' };
    return { background: '#e5e7eb', color: '#374151' };
}

type Regiao = 'todas' | 'SR I' | 'SR II' | 'SR III' | 'SR IV' | 'SR V/XI';

interface RedeProps {
    user?: UserProfile | null;
}

const Rede: React.FC<RedeProps> = ({ user }) => {
    const isGestor = user?.role === 'admin' || user?.name?.includes('Genildo');
    const [filter, setFilter] = useState<Regiao>('todas');
    const [busca, setBusca] = useState('');
    const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({ center: [-3.78, -38.57], zoom: 12 });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const filteredData = useMemo(() => {
        return redeData.filter(item => {
            const matchRegiao = filter === 'todas' || item.regiao === filter;
            const matchBusca = busca === '' || item.nome.toLowerCase().includes(busca.toLowerCase()) || item.tipo.toLowerCase().includes(busca.toLowerCase()) || item.endereco.toLowerCase().includes(busca.toLowerCase());
            return matchRegiao && matchBusca;
        });
    }, [filter, busca]);

    const handleFilterChange = (value: string) => {
        setFilter(value as Regiao);
        if (value === 'todas') {
            setMapState({ center: [-3.78, -38.57], zoom: 12 });
        } else {
            const first = redeData.find(i => i.regiao === value);
            if (first) setMapState({ center: [first.lat, first.lng], zoom: 14 });
        }
    };

    const handleItemClick = (item: RedeItem) => {
        setSelectedId(item.id);
        setMapState({ center: [item.lat, item.lng], zoom: 16 });
    };

    return (
        <section className="p-4 md:p-6 animate-fade-in h-full flex flex-col gap-4">

            {/* Cabeçalho e filtros */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800">Rede de Apoio Psicossocial – Fortaleza</h2>
                    <p className="text-xs text-gray-500">Fonte: Lista de Endereços RAPS 2024 · {redeData.length} equipamentos cadastrados</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Buscar equipamento..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 w-52"
                    />
                    <select
                        className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                        value={filter}
                        onChange={e => handleFilterChange(e.target.value)}
                    >
                        <option value="todas">Todas as Regionais</option>
                        <option value="SR I">Regional I (Cristo Redentor / São Gerardo)</option>
                        <option value="SR II">Regional II (Aldeota)</option>
                        <option value="SR III">Regional III (Pici / Rodolfo Teófilo)</option>
                        <option value="SR IV">Regional IV (Itaperi)</option>
                        <option value="SR V/XI">Regional V/XI (Bom Jardim / Granja Portugal / Ceará)</option>
                    </select>
                </div>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-3 text-xs">
                {LEGENDA.map(l => (
                    <div key={l.tipo} className="flex items-center gap-1.5">
                        <span style={{ background: l.cor, width: 12, height: 12, borderRadius: '50%', display: 'inline-block', border: '1.5px solid white', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
                        <span className="text-gray-600">{l.label}</span>
                    </div>
                ))}
            </div>

            {/* Mapa + Lista */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-[480px]">

                {/* Mapa */}
                <div className="lg:col-span-2 bg-gray-100 rounded-xl shadow-md relative overflow-hidden border border-gray-300 z-0">
                    <MapContainer
                        center={[-3.78, -38.57]}
                        zoom={12}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%', minHeight: 480 }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapController center={mapState.center} zoom={mapState.zoom} />
                        {filteredData.map(item => (
                            <Marker
                                key={item.id}
                                position={[item.lat, item.lng]}
                                icon={getIcon(item.tipo)}
                            >
                                <Popup maxWidth={260}>
                                    <div style={{ fontFamily: 'inherit', lineHeight: 1.5 }}>
                                        <p style={{ fontWeight: 700, fontSize: 13, color: '#111', marginBottom: 4 }}>{item.nome}</p>
                                        <span style={{ ...getBadgeStyle(item.tipo), fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600, display: 'inline-block', marginBottom: 6 }}>
                                            {item.tipo}
                                        </span>
                                        <br />
                                        <span style={{ fontSize: 12, color: '#555' }}>📍 {item.endereco}</span>
                                        {item.telefone && <><br /><span style={{ fontSize: 12, color: '#555' }}>📞 {item.telefone}</span></>}
                                        {item.responsavel && <><br /><span style={{ fontSize: 12, color: '#555' }}>👤 {item.responsavel}</span></>}
                                        <br />
                                        <span style={{ fontSize: 11, color: '#888', marginTop: 4, display: 'inline-block' }}>Regional: {item.regiao}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Contador overlay */}
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'rgba(255,255,255,.92)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#374151', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }}>
                        {filteredData.length} ponto{filteredData.length !== 1 ? 's' : ''} no mapa
                    </div>
                </div>

                {/* Lista lateral */}
                <div className="flex flex-col bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0 bg-gray-50">
                        <h3 className="font-bold text-gray-700 text-sm">Equipamentos ({filteredData.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredData.length === 0 && (
                            <p className="text-center text-gray-400 text-sm mt-10 px-4">Nenhum equipamento encontrado.</p>
                        )}
                        {filteredData.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedId === item.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex items-start gap-2">
                                    <span
                                        style={{ background: getBadgeStyle(item.tipo).color, width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 4 }}
                                    />
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{item.nome}</p>
                                        <span style={{ ...getBadgeStyle(item.tipo), fontSize: 10, padding: '1px 6px', borderRadius: 99, fontWeight: 600, display: 'inline-block', marginTop: 2 }}>{item.tipo}</span>
                                        <p className="text-xs text-gray-500 mt-1 leading-tight">{item.endereco}</p>
                                        {item.telefone && <p className="text-xs text-gray-400">{item.telefone}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Articuladores — só para gestor/admin */}
                    {isGestor && (
                        <div className="border-t border-gray-200 bg-blue-50 px-4 py-3 flex-shrink-0">
                            <p className="font-bold text-blue-800 text-xs mb-2">📋 Contatos de Articulação e Gestão (2024)</p>
                            <div className="space-y-1.5">
                                {articuladores.map((a, i) => (
                                    <div key={i} className="text-xs">
                                        <p className="font-semibold text-blue-700">{a.nome}</p>
                                        <p className="text-blue-500 leading-tight">{a.cargo}</p>
                                        <a href={`mailto:${a.email}`} className="text-blue-400 hover:underline break-all">{a.email}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Rede;
