import React from 'react';

interface LandingPageProps {
    onEnterSystem: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {

    const [newsItems, setNewsItems] = React.useState([
        {
            tag: 'Benefício Social',
            title: 'Governo do Ceará disponibiliza consulta ao novo lote do Vale Gás Social',
            desc: 'Confira se seu nome está na lista. As entregas ocorrem nos CRAS e Complexos Sociais Mais Infância.',
            date: 'JANEIRO/2026',
            color: 'emerald',
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
            link: 'https://www.sps.ce.gov.br'
        },
        {
            tag: 'Cidadania',
            title: 'Balcão da Cidadania leva serviços essenciais a territórios indígenas',
            desc: 'Emissão de documentação básica e cadastro único para comunidades tradicionais em Cavcaia.',
            date: '29 JAN - 02 FEV',
            color: 'blue',
            image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=800&auto=format&fit=crop',
            link: 'https://www.sps.ce.gov.br'
        },
        {
            tag: 'Política Sobre Drogas',
            title: 'Projeto Acolher chega a Sobral com oferta de serviços gratuitos',
            desc: 'Ação itinerante promove cidadania, saúde e qualificação profissional nos bairros.',
            date: '05 FEV',
            color: 'emerald',
            image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
            link: 'https://www.sps.ce.gov.br'
        },
        {
            tag: 'Artesanato',
            title: 'Ceará feito a mão: CeArt percorre Aracati e amplia o acesso',
            desc: 'Caminhão da CeArt leva cadastramento e curadoria para artesãos do litoral leste.',
            date: 'FEVEREIRO/2026',
            color: 'orange',
            image: 'https://images.unsplash.com/photo-1606105961732-683267d532b2?q=80&w=800&auto=format&fit=crop',
            link: 'https://www.sps.ce.gov.br'
        }
    ]);

    React.useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/sps-news');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setNewsItems(data);
                    }
                }
            } catch (error) {
                console.log('Using static fallback news');
            }
        };

        fetchNews();
    }, []);

    const getTagStyle = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-600 text-white';
            case 'orange': return 'bg-orange-600 text-white';
            case 'emerald': return 'bg-emerald-600 text-white';
            case 'purple': return 'bg-purple-600 text-white';
            default: return 'bg-slate-600 text-white';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">

            {/* --- HEADER --- */}
            <header className="bg-teal-600 text-white py-4 px-6 fixed w-full top-0 z-50 shadow-lg border-b-4 border-teal-700">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 text-2xl font-black shadow-lg mr-3 transform -rotate-6 border-2 border-teal-200">
                            Ψ
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-black text-2xl tracking-tight leading-none drop-shadow-sm">Gestão PSI</h1>
                            <span className="text-[10px] font-bold text-teal-50 uppercase tracking-widest mt-0.5">Complexos e Espaços Sociais</span>
                        </div>
                    </div>
                    <button
                        onClick={onEnterSystem}
                        className="bg-white text-teal-800 px-5 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-teal-50 transition shadow-lg transform hover:-translate-y-0.5"
                    >
                        <i className="fa-solid fa-right-to-bracket mr-2"></i> LOGIN
                    </button>
                </div>
            </header>

            {/* --- HERO --- */}
            <section className="pt-28 pb-10 px-4 bg-gradient-to-b from-teal-50/50 to-white">
                <div className="max-w-5xl mx-auto text-center mb-10">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
                        <span className="text-teal-600">Psicologia Social</span> <span className="text-orange-500">Mais Infância</span>
                    </h2>
                    <div className="flex flex-col items-center max-w-3xl mx-auto">
                        <p className="text-sm md:text-lg text-slate-600 font-bold leading-relaxed opacity-80 italic">
                            "Precisamos priorizar a primeira infância e focar nos mais vulneráveis. Só assim teremos uma sociedade menos desigual."
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="h-px w-6 bg-teal-300"></span>
                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Onélia Leite Santana</span>
                            <span className="h-px w-6 bg-teal-300"></span>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-emerald-100 relative group hover:-translate-y-1 transition duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm group-hover:bg-emerald-600 group-hover:text-white transition">
                                <i className="fa-solid fa-bullseye"></i>
                            </div>
                            <h3 className="font-black text-lg text-slate-800">Nossa Missão</h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Atuar no cuidado integral e integrado às crianças e suas famílias, em espaços de transformação social intergeracional, sob a orientação de equipe multidisciplinar.
                        </p>
                        <div className="h-1 w-8 bg-emerald-500 mt-3 rounded-full"></div>
                    </div>

                    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-emerald-100 relative group hover:-translate-y-1 transition duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm group-hover:bg-blue-600 group-hover:text-white transition">
                                <i className="fa-regular fa-eye"></i>
                            </div>
                            <h3 className="font-black text-lg text-slate-800">Nossa Visão</h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Até 2027, ser referência nacional no cuidado com a criança a partir de sua família, consolidando a Psicologia Social como pilar de prevenção.
                        </p>
                        <div className="h-1 w-8 bg-blue-500 mt-3 rounded-full"></div>
                    </div>

                    <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-emerald-100 relative group hover:-translate-y-1 transition duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm group-hover:bg-purple-600 group-hover:text-white transition">
                                <i className="fa-solid fa-heart"></i>
                            </div>
                            <h3 className="font-black text-lg text-slate-800">Nossos Valores</h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {['Ética', 'Equidade', 'Empatia', 'Transparência', 'Diversidade', 'Resp. Social'].map(v => (
                                <span key={v} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-md border border-slate-100">{v}</span>
                            ))}
                        </div>
                        <div className="h-1 w-8 bg-purple-500 mt-3 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* --- NOTÍCIAS --- */}
            <section className="py-10 px-6 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Atualizações em Tempo Real</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Acontece na SPS</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {newsItems.map((news, index) => (
                            <a
                                key={index}
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full cursor-pointer block"
                            >
                                <div className="h-32 overflow-hidden relative">
                                    <img src={news.image} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${getTagStyle(news.color)}`}>{news.tag}</span>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-black text-sm text-slate-800 mb-1 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">{news.title}</h3>
                                    <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{news.desc}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FLUXO DE TRABALHO BIZAGI (Otimizado) --- */}
            <section className="bg-slate-100 py-16 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Fluxo de Processo Psicossocial</h2>
                        <div className="h-1 w-20 bg-teal-500 mx-auto mt-2 rounded-full"></div>
                    </div>

                    {/* Container do Diagrama SEM SCROLL horizontal em Desktop */}
                    <div className="bg-white p-4 lg:p-8 rounded-[2rem] shadow-2xl border border-slate-300 relative overflow-hidden flex items-stretch min-h-[500px]">
                        {/* Papel Milimetrado */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Pool Sidebar - Título solicitado */}
                        <div className="w-12 bg-slate-200 border-r-2 border-slate-300 flex items-center justify-center rounded-l-[1.8rem] shrink-0 shadow-inner overflow-hidden">
                            <span className="-rotate-90 whitespace-nowrap text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase w-max">
                                SETOR DE PSICOLOGIA • COMPLEXOS SOCIAIS E ESPAÇOS SOCIAIS
                            </span>
                        </div>

                        {/* Área do Fluxo */}
                        <div className="flex-1 px-4 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-2 relative z-10">

                            {/* Coluna 1: Entradas */}
                            <div className="flex flex-col gap-6 w-full lg:w-auto items-center lg:items-start">
                                <div className="flex items-center gap-3 group relative w-full lg:w-48">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-600 shadow-sm flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all z-10">
                                        <i className="fa-solid fa-person-walking text-lg"></i>
                                    </div>
                                    <div className="bg-white border-2 border-slate-200 rounded-xl p-2 shadow-sm text-[9px] font-black uppercase flex-1 group-hover:border-emerald-500 transition-colors">
                                        Demanda Espontânea
                                        <span className="block text-[7px] text-slate-400 font-bold lowercase mt-0.5">(acolhimento direto)</span>
                                    </div>
                                    {/* Linha de conexão vertical interna para o próximo item */}
                                    <div className="absolute left-6 top-12 w-px h-6 bg-slate-300 hidden lg:block"></div>
                                </div>

                                <div className="flex items-center gap-3 group relative w-full lg:w-48">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 border-2 border-orange-500 shadow-sm flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all z-10">
                                        <i className="fa-solid fa-file-signature text-lg"></i>
                                    </div>
                                    <div className="bg-white border-2 border-slate-200 rounded-xl p-2 shadow-sm text-[9px] font-black uppercase flex-1 group-hover:border-orange-500 transition-colors">
                                        Busca Ativa / Enc. Interno
                                        <span className="block text-[7px] text-orange-400 font-bold lowercase mt-0.5">(integral, esporte, arte...)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Seta de Junção */}
                            <div className="hidden lg:block w-10 h-px bg-slate-400 relative">
                                <i className="fa-solid fa-caret-right absolute -right-1.5 -top-1.5 text-slate-400"></i>
                            </div>

                            {/* Coluna 2: Processo Central */}
                            <div className="flex flex-col items-center gap-6 w-full lg:w-auto">
                                <div className="w-48 h-20 bg-white border-2 border-blue-600 rounded-2xl shadow-xl flex items-center justify-center hover:shadow-blue-200/50 transition-all relative group overflow-hidden">
                                    <div className="text-center relative z-10">
                                        <span className="text-[10px] font-black text-blue-900 uppercase block tracking-tighter">Atendimento Individual</span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">(Escuta / Triagem / Instrumental)</span>
                                    </div>
                                    <i className="fa-solid fa-gear absolute top-1 right-1 text-[8px] text-blue-300 animate-spin-slow"></i>
                                </div>

                                <i className="fa-solid fa-arrow-down text-slate-300 hidden lg:block"></i>

                                {/* Gateway */}
                                <div className="relative w-20 h-20 flex items-center justify-center group cursor-pointer">
                                    <div className="w-14 h-14 bg-amber-50 border-2 border-amber-500 rotate-45 shadow-lg absolute z-0 group-hover:bg-amber-100 transition-colors"></div>
                                    <div className="z-10 text-center text-[8px] font-black uppercase leading-tight w-14 text-amber-900 drop-shadow-sm">
                                        Avaliação<br />Técnica
                                    </div>
                                </div>
                            </div>

                            {/* Seta de Decisão */}
                            <div className="hidden lg:flex relative w-12 h-40 flex-col justify-between py-6">
                                <div className="h-px w-12 bg-slate-400" style={{ transform: 'translateY(10px) rotate(-30deg)' }}></div>
                                <div className="h-px w-12 bg-slate-400" style={{ transform: 'translateY(-10px) rotate(30deg)' }}></div>
                            </div>

                            {/* Coluna 3: Saídas e Finalização */}
                            <div className="flex flex-col gap-8 w-full lg:w-auto h-full justify-center">

                                {/* Saída A: Rede */}
                                <div className="flex items-center gap-4 w-full lg:w-56">
                                    <div className="flex-1 bg-slate-50 border-2 border-slate-400 border-dashed rounded-xl p-3 shadow-sm relative group hover:bg-white hover:border-solid transition-all">
                                        <span className="text-[9px] font-black text-slate-700 uppercase block">Encaminhamento Rede</span>
                                        <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">(CRAS, CREAS, CAPS, SAÚDE...)</p>
                                        <i className="fa-solid fa-share-nodes absolute -top-2 -right-2 bg-slate-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] shadow-md group-hover:scale-110 transition"></i>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-4 border-red-500 bg-red-50 flex items-center justify-center shadow-lg group shrink-0">
                                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Saída B: Transição e Contra-referência */}
                                <div className="flex flex-col gap-3 p-3 border-2 border-teal-100 rounded-2xl bg-teal-50/20 shadow-inner relative w-full lg:w-auto">
                                    <span className="absolute -top-2.5 left-4 bg-white border border-teal-200 px-2 py-0.5 rounded-full text-[7px] font-black text-teal-600 uppercase">Transição Interna</span>

                                    <div className="flex items-center gap-4">
                                        <div className="w-36 h-16 bg-white border-2 border-teal-600 rounded-xl shadow-lg flex items-center justify-center hover:shadow-teal-100 transition relative">
                                            <div className="text-center">
                                                <span className="text-[9px] font-black text-teal-900 uppercase block leading-tight">Inserção em Grupos</span>
                                                <span className="text-[7px] font-bold text-slate-400 uppercase">(GAP, GFA, GPI, ACT)</span>
                                            </div>
                                        </div>

                                        <i className="fa-solid fa-arrow-right text-teal-300 text-xs"></i>

                                        <div className="w-36 h-16 bg-teal-600 border-2 border-teal-700 rounded-xl shadow-xl flex items-center justify-center hover:bg-teal-700 transition relative">
                                            <div className="text-center text-white">
                                                <span className="text-[9px] font-black uppercase block tracking-tighter">Contra-referência</span>
                                                <span className="text-[7px] font-bold text-teal-100 uppercase">(Devolutiva p/ Integral)</span>
                                            </div>
                                            <i className="fa-solid fa-reply-all absolute top-1 right-1 text-teal-300/40 text-[9px]"></i>
                                        </div>

                                        <div className="w-10 h-10 rounded-full border-4 border-red-500 bg-red-50 flex items-center justify-center shadow-lg shrink-0">
                                            <span className="text-[8px] font-black text-red-700">FIM</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Legenda Compacta */}
                    <div className="mt-6 flex flex-wrap justify-center gap-6 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white w-max mx-auto px-6 py-2 rounded-full shadow-lg border border-slate-200">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-100 border-2 border-emerald-600 rounded-full block"></span> Início</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-3 bg-white border-2 border-blue-600 rounded block"></span> Atividade</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-50 border-2 border-amber-500 rotate-45 block"></span> Avaliação</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-100 border-4 border-red-600 rounded-full block"></span> Fim</div>
                    </div>
                </div>
            </section>

            {/* --- OPERAÇÃO TÁTICA --- */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <i className="fa-solid fa-gears text-3xl text-slate-300 mb-2"></i>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Eixos de Intervenção</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Item 1 */}
                        <div className="border-l-4 border-emerald-500 pl-4 py-1">
                            <h3 className="text-lg font-bold text-emerald-800 mb-1">Vínculos & Comunidade</h3>
                            <div className="space-y-2 mt-4">
                                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                    <h4 className="font-black text-emerald-900 flex items-center gap-2 text-xs">GAP / GPI / GFA</h4>
                                </div>
                            </div>
                        </div>
                        {/* Item 2 */}
                        <div className="border-l-4 border-blue-500 pl-4 py-1">
                            <h3 className="text-lg font-bold text-blue-800 mb-1">Prevenção & Paz</h3>
                            <div className="space-y-2 mt-4">
                                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                    <h4 className="font-black text-blue-900 flex items-center gap-2 text-xs">ACT / Círculos de Paz</h4>
                                </div>
                            </div>
                        </div>
                        {/* Item 3 */}
                        <div className="border-l-4 border-purple-500 pl-4 py-1">
                            <h3 className="text-lg font-bold text-purple-800 mb-1">Individual & Rede</h3>
                            <div className="space-y-2 mt-4">
                                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                                    <h4 className="font-black text-purple-900 flex items-center gap-2 text-xs">Escuta / Gestão de Rede</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center text-[10px]">
                <p className="font-bold mb-1 uppercase">SECRETARIA DA PROTEÇÃO SOCIAL • GOVERNO DO ESTADO DO CEARÁ</p>
                <p>Célula de Gestão dos Complexos Sociais Mais Infância</p>
                <p className="mt-4 opacity-50">&copy; 2026 Gestão PSI. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
