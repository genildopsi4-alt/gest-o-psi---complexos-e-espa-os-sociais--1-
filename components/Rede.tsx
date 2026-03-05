import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RedeItem, UserProfile } from '../types';

// ── Ícones SVG por categoria (sem dependência de CSS externo) ──────────────────
function makeSvgIcon(color: string) {
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
      <path d="M14 0 C6.27 0 0 6.27 0 14 C0 24.5 14 38 14 38 C14 38 28 24.5 28 14 C28 6.27 21.73 0 14 0 Z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.85"/>
    </svg>`;
    return L.divIcon({
        className: '',
        html: svg,
        iconSize: [28, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -40],
    });
}

const ICONS: Record<string, L.DivIcon> = {
    'CAPS AD': makeSvgIcon('#dc2626'),  // vermelho escuro
    'CAPS Infantil': makeSvgIcon('#f97316'),  // laranja
    'CAPS Geral': makeSvgIcon('#b91c1c'),  // vinho
    'UAPS': makeSvgIcon('#0284c7'),  // azul
    'UA': makeSvgIcon('#9333ea'),  // roxo
    'Residência': makeSvgIcon('#0d9488'),  // teal
    'Complexo': makeSvgIcon('#16a34a'),  // verde
    'CRAS': makeSvgIcon('#7c3aed'),
    'CREAS': makeSvgIcon('#5b21b6'),
    'default': makeSvgIcon('#6b7280'),
};

function getIcon(tipo: string): L.DivIcon {
    for (const key of Object.keys(ICONS)) {
        if (tipo.startsWith(key)) return ICONS[key];
    }
    return ICONS['default'];
}

// ── Dados reais RAPS / UAPS 2024 ──────────────────────────────────────────────
const redeData: RedeItem[] = [
    // SR I
    { id: 1, nome: 'CAPS AD 24h Dr. Airton Monte', tipo: 'CAPS AD', lat: -3.7095, lng: -38.5528, regiao: 'SR I', endereco: 'Av. Monsenhor Hélio Campos, 138 – Cristo Redentor', telefone: '(85) 3433-9513', responsavel: '' },
    { id: 2, nome: 'CAPS Geral Nise da Silveira', tipo: 'CAPS Geral', lat: -3.7210, lng: -38.5460, regiao: 'SR I', endereco: 'Rua Soares Bulcão, 1494 – São Gerardo', telefone: '(85) 3105-1119', responsavel: '' },
    // SR II
    { id: 3, nome: 'CAPS AD Glauco Lobo', tipo: 'CAPS AD', lat: -3.7328, lng: -38.5023, regiao: 'SR II', endereco: 'Rua Pinto Madeira, 1550 – Aldeota', telefone: '(85) 3105-2632', responsavel: '' },
    // SR III
    { id: 4, nome: 'UAPS César Cals de Oliveira Filho', tipo: 'UAPS', lat: -3.7720, lng: -38.5910, regiao: 'SR III', endereco: 'Rua Pernambuco, 3172 – Pici', telefone: '(85) 3233-4055', responsavel: 'Maria Rachel Ribeiro Sombra' },
    { id: 5, nome: 'UAPS Gilmário Mourão (CEDEFAM/UFC)', tipo: 'UAPS', lat: -3.7680, lng: -38.5870, regiao: 'SR III', endereco: 'Rua Pernambuco, 1674 – Planalto Pici', telefone: '(85) 3366-9371', responsavel: 'Prof. Bernardo Diniz Coutinho' },
    { id: 6, nome: 'CAPS Infantil Estudante Nogueira Jucá', tipo: 'CAPS Infantil', lat: -3.7530, lng: -38.5710, regiao: 'SR III', endereco: 'Rua Porfírio Sampaio, 1905 – Rodolfo Teófilo', telefone: '(85) 3105-3721', responsavel: 'Luiz Henrique Sampaio Martins' },
    { id: 7, nome: 'CAPS Geral Prof. Gerardo da Frota Pinto', tipo: 'CAPS Geral', lat: -3.7480, lng: -38.5680, regiao: 'SR III', endereco: 'Rua Francisco Pedro, 1269 – Rodolfo Teófilo', telefone: '(85) 3433-2568', responsavel: 'Francelina Gonçalves Bandeira' },
    { id: 8, nome: 'CAPS AD – Amadeu Furtado', tipo: 'CAPS AD', lat: -3.7560, lng: -38.5800, regiao: 'SR III', endereco: 'Rua Gal. Bernardo Figueiredo, 1991 – Amadeu Furtado', telefone: '(85) 3105-3722', responsavel: 'Solange Cid Holanda' },
    // SR IV
    { id: 9, nome: 'CAPS AD Alto da Coruja', tipo: 'CAPS AD', lat: -3.7900, lng: -38.5410, regiao: 'SR IV', endereco: 'Rua Betel, 1826 – Itaperi', telefone: '(85) 3493-5538', responsavel: '' },
    // SR V/XI
    { id: 10, nome: 'CAPS Infantil Granja Portugal', tipo: 'CAPS Infantil', lat: -3.8210, lng: -38.6150, regiao: 'SR V/XI', endereco: 'Rua Antônio Nery, s/n (esq. Humberto Lomeu) – Granja Portugal', telefone: '(85) 2018-0050', responsavel: 'Francisco Wagner Pereira Menezes' },
    { id: 11, nome: 'CAPS Geral Bom Jardim', tipo: 'CAPS Geral', lat: -3.8290, lng: -38.6340, regiao: 'SR V/XI', endereco: 'Rua Bom Jesus, 940 – Bom Jardim', telefone: '(85) 3245-7956', responsavel: 'Ana Cristina Lopes do Nascimento' },
    { id: 12, nome: 'CAPS AD Granja Portugal', tipo: 'CAPS AD', lat: -3.8230, lng: -38.6140, regiao: 'SR V/XI', endereco: 'Rua Antônio Nery, s/n – Granja Portugal', telefone: '(85) 3105-1023', responsavel: 'Ana Paula Moura' },
    { id: 13, nome: 'UAPS Dr. João Barbosa Pires', tipo: 'UAPS', lat: -3.8270, lng: -38.6230, regiao: 'SR V/XI', endereco: 'Rua Rubi, s/n – Jardim Jatobá', telefone: '(85) 3498-4745', responsavel: '' },
    { id: 14, nome: 'UA Dr. Silas Munguba (Acolhimento)', tipo: 'UA', lat: -3.8310, lng: -38.6280, regiao: 'SR V/XI', endereco: 'Av. D, 400 – 2ª Etapa, José Walter', telefone: '(85) 3473-7882', responsavel: 'Ana Paula Moura' },
    { id: 15, nome: 'Residência Terapêutica Bom Sucesso', tipo: 'Residência', lat: -3.8350, lng: -38.6200, regiao: 'SR V/XI', endereco: 'Rua Emílio de Menezes, 1245 – Bom Sucesso', telefone: '(85) 3497-4885', responsavel: 'Ana Cristina Lopes do Nascimento' },
    { id: 16, nome: 'UAPS Dr. Pontes Neto', tipo: 'UAPS', lat: -3.8190, lng: -38.6370, regiao: 'SR V/XI', endereco: 'Rua 541, 150 – 2ª Etapa, Conjunto Ceará', telefone: '(85) 3452-2487', responsavel: '' },
    { id: 17, nome: 'UAPS Ronaldo Albuquerque', tipo: 'UAPS', lat: -3.8240, lng: -38.6400, regiao: 'SR V/XI', endereco: 'Av. I, s/n – Conjunto Ceará / Genibaú', telefone: '(85) 3259-1741', responsavel: '' },
];

// ── Articuladores ─────────────────────────────────────────────────────────────
const articuladores = [
    { cargo: 'Articuladora SR V/XI', nome: 'Fabiana Mariano Costa', email: 'fabianacosta2006@yahoo.com.br' },
    { cargo: 'Articuladora SR III (Pici)', nome: 'Maria do Perpétuo Socorro', email: 'pedrazul_1@yahoo.com.br' },
    { cargo: 'Gerente Célula de Saúde Mental SMS', nome: 'Berta Augusta Faraday S. Pinheiro', email: 'berta.pinheiro@sms.fortaleza.ce.gov.br' },
    { cargo: 'Interface APS', nome: 'Mariana Pinheiro', email: 'mariana.pinheiro@sms.fortaleza.ce.gov.br' },
];

// ── Legenda ───────────────────────────────────────────────────────────────────
const LEGENDA = [
    { cor: '#dc2626', label: 'CAPS AD' },
    { cor: '#f97316', label: 'CAPS Infantil' },
    { cor: '#b91c1c', label: 'CAPS Geral' },
    { cor: '#0284c7', label: 'UAPS' },
    { cor: '#9333ea', label: 'Unidade de Acolhimento' },
    { cor: '#0d9488', label: 'Residência Terapêutica' },
    { cor: '#16a34a', label: 'Complexo Social' },
];

// ── Badge de tipo ─────────────────────────────────────────────────────────────
function getBadgeStyle(tipo: string): React.CSSProperties {
    if (tipo.startsWith('CAPS AD')) return { background: '#fee2e2', color: '#991b1b' };
    if (tipo.startsWith('CAPS Infantil')) return { background: '#ffedd5', color: '#c2410c' };
    if (tipo.startsWith('CAPS')) return { background: '#fecaca', color: '#7f1d1d' };
    if (tipo.startsWith('UAPS')) return { background: '#e0f2fe', color: '#0369a1' };
    if (tipo.startsWith('UA')) return { background: '#f3e8ff', color: '#7e22ce' };
    if (tipo.startsWith('Residência')) return { background: '#ccfbf1', color: '#0f766e' };
    if (tipo.startsWith('CRAS')) return { background: '#ede9fe', color: '#5b21b6' };
    if (tipo.startsWith('CREAS')) return { background: '#ddd6fe', color: '#4c1d95' };
    return { background: '#f3f4f6', color: '#374151' };
}

// ── MapController ─────────────────────────────────────────────────────────────
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => { map.setView(center, zoom, { animate: true }); }, [center, zoom, map]);
    return null;
};

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Regiao = 'todas' | 'SR I' | 'SR II' | 'SR III' | 'SR IV' | 'SR V/XI';

interface RedeProps { user?: UserProfile | null; }

// ── Componente principal ──────────────────────────────────────────────────────
const Rede: React.FC<RedeProps> = ({ user }) => {
    const isGestor = user?.role === 'admin' || user?.name?.includes('Genildo');
    const [filter, setFilter] = useState<Regiao>('todas');
    const [busca, setBusca] = useState('');
    const [mapState, setMapState] = useState<{ center: [number, number]; zoom: number }>({ center: [-3.78, -38.57], zoom: 12 });
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const filteredData = useMemo(() =>
        redeData.filter(item => {
            const matchRegiao = filter === 'todas' || item.regiao === filter;
            const q = busca.toLowerCase();
            const matchBusca = q === '' || item.nome.toLowerCase().includes(q) || item.tipo.toLowerCase().includes(q) || item.endereco.toLowerCase().includes(q);
            return matchRegiao && matchBusca;
        }), [filter, busca]);

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

            {/* Cabeçalho */}
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
                        title="Filtrar por Regional"
                        className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                        value={filter}
                        onChange={e => handleFilterChange(e.target.value)}
                    >
                        <option value="todas">Todas as Regionais</option>
                        <option value="SR I">SR I – Cristo Redentor / São Gerardo</option>
                        <option value="SR II">SR II – Aldeota</option>
                        <option value="SR III">SR III – Pici / Rodolfo Teófilo</option>
                        <option value="SR IV">SR IV – Itaperi</option>
                        <option value="SR V/XI">SR V/XI – Bom Jardim / Granja Portugal</option>
                    </select>
                </div>
            </div>

            {/* Legenda */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {LEGENDA.map(l => (
                    <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <svg width="12" height="16" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 0 C6.27 0 0 6.27 0 14 C0 24.5 14 38 14 38 C14 38 28 24.5 28 14 C28 6.27 21.73 0 14 0 Z" fill={l.cor} stroke="white" strokeWidth="2" />
                        </svg>
                        {l.label}
                    </div>
                ))}
            </div>

            {/* Mapa + Lista */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-[480px]">

                {/* Mapa */}
                <div className="lg:col-span-2 rounded-xl overflow-hidden border border-gray-300 shadow-md relative z-0" style={{ minHeight: 480 }}>
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
                                eventHandlers={{ click: () => handleItemClick(item) }}
                            >
                                <Popup maxWidth={270} minWidth={220}>
                                    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: 1.55 }}>
                                        <p style={{ fontWeight: 700, fontSize: 13, color: '#111827', marginBottom: 4 }}>{item.nome}</p>
                                        <span style={{ ...getBadgeStyle(item.tipo), fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600, display: 'inline-block', marginBottom: 6 }}>
                                            {item.tipo}
                                        </span>
                                        <p style={{ fontSize: 12, color: '#4b5563', marginTop: 2 }}>📍 {item.endereco}</p>
                                        {item.telefone && <p style={{ fontSize: 12, color: '#4b5563' }}>📞 {item.telefone}</p>}
                                        {item.responsavel && <p style={{ fontSize: 12, color: '#4b5563' }}>👤 {item.responsavel}</p>}
                                        <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Regional: {item.regiao}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Contador flutuante */}
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'rgba(255,255,255,0.93)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#374151', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', pointerEvents: 'none' }}>
                        {filteredData.length} ponto{filteredData.length !== 1 ? 's' : ''} no mapa
                    </div>
                </div>

                {/* Lista lateral */}
                <div className="flex flex-col bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
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
                                    <svg width="10" height="14" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, marginTop: 3 }}>
                                        <path d="M14 0 C6.27 0 0 6.27 0 14 C0 24.5 14 38 14 38 C14 38 28 24.5 28 14 C28 6.27 21.73 0 14 0 Z" fill={getBadgeStyle(item.tipo).color as string} stroke="white" strokeWidth="2" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm leading-tight">{item.nome}</p>
                                        <span style={{ ...getBadgeStyle(item.tipo), fontSize: 10, padding: '1px 6px', borderRadius: 99, fontWeight: 600, display: 'inline-block', marginTop: 2 }}>
                                            {item.tipo}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1 leading-snug">{item.endereco}</p>
                                        {item.telefone && <p className="text-xs text-gray-400">{item.telefone}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Articuladores — apenas gestor/admin */}
                    {isGestor && (
                        <div className="border-t border-blue-100 bg-blue-50 px-4 py-3 flex-shrink-0">
                            <p className="font-bold text-blue-800 text-xs mb-2">📋 Contatos de Articulação (2024)</p>
                            <div className="space-y-2">
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
