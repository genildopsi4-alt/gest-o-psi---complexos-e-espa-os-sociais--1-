import React from 'react';

interface LandingPageProps {
    onEnterSystem: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {

    const [selectedNews, setSelectedNews] = React.useState<any | null>(null);

    const [newsItems, setNewsItems] = React.useState([
        {
            tag: 'Cidadania',
            title: 'Caminhão do Cidadão leva serviços de cidadania a bairros de Fortaleza',
            desc: 'Após o feriado do Carnaval, o Caminhão do Cidadão retoma sua agenda de atendimentos levando serviços essenciais aos bairros de Fortaleza.',
            date: '18 FEVEREIRO 2026',
            color: 'blue',
            image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/IMG_7750-600x400.jpg',
            link: 'https://www.sps.ce.gov.br/2026/02/18/caminhao-do-cidadao-leva-servicos-a-bairros-de-fortaleza-e-ao-pecem-no-pos-carnaval/'
        },
        {
            tag: 'Política Sobre Drogas',
            title: 'Projeto Acolher leva serviços gratuitos ao Cits Jangurussu',
            desc: 'O Projeto Acolher oferta serviços gratuitos de saúde, inclusão social e orientação jurídica à população em situação de vulnerabilidade.',
            date: '12 FEVEREIRO 2026',
            color: 'emerald',
            image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/Acolher-22-2-600x400.jpg',
            link: 'https://www.sps.ce.gov.br/2026/02/12/projeto-acolher-leva-servicos-gratuitos-ao-cits-jangurussu-nesta-sexta-13/'
        },
        {
            tag: 'Editais',
            title: 'Seleção para a 4ª Mostra de Experiências Exitosas em Vigilância Socioassistencial',
            desc: 'Inscrição e seleção de experiências exitosas municipais em Vigilância Socioassistencial no âmbito da CGSuas.',
            date: '12 FEVEREIRO 2026',
            color: 'purple',
            image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2024/06/Marca-SPS-500x500-1.png',
            link: 'https://www.sps.ce.gov.br/2026/02/12/selecao-para-a-4a-mostra-de-experiencias-exitosas-em-vigilancia-socioassistencial-do-ceara/'
        },
        {
            tag: 'Mais Infância',
            title: 'Casa da Criança e do Adolescente do Ceará abre seleção para OSC em Juazeiro do Norte',
            desc: 'Edital seleciona Organizações da Sociedade Civil para gerenciamento e execução da Casa da Criança e do Adolescente.',
            date: '11 FEVEREIRO 2026',
            color: 'orange',
            image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2024/06/Marca-SPS-500x500-1.png',
            link: 'https://www.sps.ce.gov.br/2026/02/11/selecao-de-osc-para-gerenciamento-e-execucao-da-casa-da-crianca-e-do-adolescente-do-ceara-na-regiao-de-juazeiro-do-norte/'
        }
    ]);

    React.useEffect(() => {
        // Simulating Real-Time Fetch
        const fetchRealNews = async () => {
            // Fallback data (Real SPS Content Simulation)
            const fallbackNews = [
                {
                    tag: 'Cidadania',
                    title: 'Caminhão do Cidadão leva serviços de cidadania a bairros de Fortaleza e ao Pecém',
                    desc: 'Após o feriado do Carnaval, o Caminhão do Cidadão retoma sua agenda de atendimentos levando serviços essenciais aos bairros de Fortaleza e ao município de São Gonçalo do Amarante.',
                    date: '18 FEVEREIRO 2026',
                    color: 'blue',
                    image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/IMG_7750-600x400.jpg',
                    link: 'https://www.sps.ce.gov.br/2026/02/18/caminhao-do-cidadao-leva-servicos-a-bairros-de-fortaleza-e-ao-pecem-no-pos-carnaval/'
                },
                {
                    tag: 'Política Sobre Drogas',
                    title: 'Projeto Acolher leva serviços gratuitos ao Cits Jangurussu',
                    desc: 'O Projeto Acolher, iniciativa da Secretaria da Proteção Social, oferta serviços gratuitos de saúde, inclusão social e orientação jurídica.',
                    date: '12 FEVEREIRO 2026',
                    color: 'emerald',
                    image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/Acolher-22-2-600x400.jpg',
                    link: 'https://www.sps.ce.gov.br/2026/02/12/projeto-acolher-leva-servicos-gratuitos-ao-cits-jangurussu-nesta-sexta-13/'
                },
                {
                    tag: 'Editais',
                    title: 'Seleção para a 4ª Mostra de Experiências Exitosas em Vigilância Socioassistencial do Ceará',
                    desc: 'A 4ª Mostra de Experiências em Vigilância Socioassistencial é uma iniciativa da SPS no âmbito da Coordenadoria de Gestão do SUAS.',
                    date: '12 FEVEREIRO 2026',
                    color: 'purple',
                    image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2024/06/Marca-SPS-500x500-1.png',
                    link: 'https://www.sps.ce.gov.br/2026/02/12/selecao-para-a-4a-mostra-de-experiencias-exitosas-em-vigilancia-socioassistencial-do-ceara/'
                },
                {
                    tag: 'Mais Infância',
                    title: 'Casa da Criança e do Adolescente do Ceará abre seleção para OSC em Juazeiro do Norte',
                    desc: 'Edital seleciona Organizações da Sociedade Civil para gerenciamento e execução da Casa da Criança e do Adolescente do Ceará.',
                    date: '11 FEVEREIRO 2026',
                    color: 'orange',
                    image: 'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2024/06/Marca-SPS-500x500-1.png',
                    link: 'https://www.sps.ce.gov.br/2026/02/11/selecao-de-osc-para-gerenciamento-e-execucao-da-casa-da-crianca-e-do-adolescente-do-ceara-na-regiao-de-juazeiro-do-norte/'
                }
            ];

            try {
                // Attempt to fetch from SPS WordPress API
                const response = await fetch('https://www.sps.ce.gov.br/wp-json/wp/v2/posts?per_page=4&_embed');

                if (response.ok) {
                    const data = await response.json();

                    const mappedNews = data.map((post: any) => {
                        // === Extract Image ===
                        // 1) Featured media (best quality)
                        let imageUrl = '';
                        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0] && post._embedded['wp:featuredmedia'][0].source_url) {
                            imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
                        }

                        // 2) Try to extract first image from post content
                        if (!imageUrl && post.content?.rendered) {
                            const imgMatch = post.content.rendered.match(/<img[^>]+src=["']([^"']+)["']/);
                            if (imgMatch && imgMatch[1]) {
                                imageUrl = imgMatch[1];
                            }
                        }

                        // 3) Category-based fallback images (real SPS imagery)
                        if (!imageUrl) {
                            const fallbackImages = [
                                'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/IMG_9672-600x400.jpg',
                                'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/caminhao-3-600x400.jpg',
                                'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2026/02/Acolher-22-2-600x400.jpg',
                                'https://www.sps.ce.gov.br/wp-content/uploads/sites/16/2024/06/Marca-SPS-500x500-1.png'
                            ];
                            imageUrl = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                        }

                        // === Determine Category/Tag ===
                        let tag = 'SPS Notícias';
                        let color = 'blue';
                        if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0] && post._embedded['wp:term'][0][0]) {
                            const categoryName = post._embedded['wp:term'][0][0].name;
                            tag = categoryName || 'SPS Notícias';
                            const categorySlug = post._embedded['wp:term'][0][0].slug || '';
                            if (categorySlug.includes('cidadania')) color = 'blue';
                            else if (categorySlug.includes('edital') || categorySlug.includes('sexec')) color = 'purple';
                            else if (categorySlug.includes('mais-infancia') || categorySlug.includes('crianca')) color = 'orange';
                            else if (categorySlug.includes('aviso') || categorySlug.includes('pauta')) color = 'emerald';
                            else color = ['emerald', 'blue', 'purple', 'orange'][Math.floor(Math.random() * 4)];
                        }

                        // Strip HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = post.excerpt.rendered;
                        const cleanDesc = tempDiv.textContent || tempDiv.innerText || '';

                        tempDiv.innerHTML = post.title.rendered;
                        const cleanTitle = tempDiv.textContent || tempDiv.innerText || '';

                        return {
                            tag,
                            title: cleanTitle,
                            desc: cleanDesc,
                            date: new Date(post.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase(),
                            color,
                            image: imageUrl,
                            link: post.link
                        };
                    });

                    if (mappedNews.length > 0) {
                        setNewsItems(mappedNews);
                        return;
                    }
                }
            } catch (error) {
                console.warn('API Fetch failed, using fallback.');
            }

            // If fetch fails or empty, use fallback
            setNewsItems(fallbackNews);
        };

        fetchRealNews();
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {newsItems.map((news, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedNews(news)}
                                className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 flex flex-col h-full cursor-pointer hover:-translate-y-2"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={news.image}
                                        alt={news.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://www.ceara.gov.br/wp-content/themes/ceara2019/assets/images/brasao_ceara.svg';
                                            (e.target as HTMLImageElement).style.objectFit = 'contain';
                                            (e.target as HTMLImageElement).style.padding = '20px';
                                            (e.target as HTMLImageElement).style.backgroundColor = '#f1f5f9';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                    <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${getTagStyle(news.color)}`}>{news.tag}</span>
                                </div>
                                <div className="p-6 flex flex-col flex-1 relative">
                                    <div className="absolute -top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-md group-hover:text-orange-500 group-hover:scale-110 transition duration-300">
                                        <i className="fa-solid fa-arrow-right text-lg"></i>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">{news.date}</span>
                                    <h3 className="font-black text-base text-slate-800 mb-3 leading-tight group-hover:text-teal-600 transition-colors line-clamp-3">{news.title}</h3>
                                    <div className="mt-auto pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-bold text-teal-600 uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Ler notícia <i className="fa-solid fa-chevron-right text-[8px]"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- NEWS MODAL --- */}
            {selectedNews && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity animate-fade-in"
                        onClick={() => setSelectedNews(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white w-full h-[100dvh] md:h-auto md:max-h-[90vh] md:max-w-4xl rounded-none md:rounded-[2.5rem] shadow-2xl relative z-10 overflow-y-auto md:overflow-hidden flex flex-col animate-fade-in-up">

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedNews(null)}
                            className="fixed md:absolute top-6 right-6 bg-black/20 hover:bg-black/40 text-white w-12 h-12 rounded-full flex items-center justify-center transition z-50 backdrop-blur-md border border-white/20"
                            title="Fechar Notícia"
                            aria-label="Fechar"
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>

                        <div className="flex flex-col md:flex-row md:h-full">
                            {/* Image Side */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative shrink-0 bg-slate-100">
                                <img
                                    src={selectedNews.image}
                                    alt={selectedNews.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://www.ceara.gov.br/wp-content/themes/ceara2019/assets/images/brasao_ceara.svg';
                                        (e.target as HTMLImageElement).style.objectFit = 'contain';
                                        (e.target as HTMLImageElement).style.padding = '40px';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent md:hidden"></div>
                                <div className="absolute bottom-6 left-6 md:hidden text-white">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 inline-block shadow-sm ${getTagStyle(selectedNews.color)}`}>
                                        {selectedNews.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="flex-1 flex flex-col md:h-full md:overflow-hidden bg-white relative">
                                <div className="p-8 md:p-12 md:overflow-y-auto md:flex-1">
                                    <div className="hidden md:block mb-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block shadow-sm ${getTagStyle(selectedNews.color)}`}>
                                            {selectedNews.tag}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">
                                        {selectedNews.title}
                                    </h2>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 pb-8 border-b border-slate-100">
                                        <span><i className="fa-regular fa-calendar-check mr-2"></i> {selectedNews.date}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span><i className="fa-solid fa-newspaper mr-2"></i> Fonte: SPS</span>
                                    </div>

                                    <div className="prose prose-slate prose-sm max-w-none">
                                        <p className="text-lg font-bold text-slate-600 leading-relaxed mb-6">
                                            {selectedNews.desc}
                                        </p>
                                        <p className="text-slate-500 leading-relaxed mb-4">
                                            Para conferir todos os detalhes desta ação, fotos adicionais e informações completas, acesse a matéria original publicada no portal oficial da Secretaria da Proteção Social.
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={selectedNews.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-teal-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-teal-700 transition text-center shadow-lg shadow-teal-200 hover:shadow-xl text-xs flex items-center justify-center gap-3 group"
                                    >
                                        Ler matéria no site SPS <i className="fa-solid fa-arrow-up-right-from-square group-hover:translate-x-1 transition-transform"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


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
                        <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern"></div>

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
                                <div className="h-px w-12 bg-slate-400 translate-y-[10px] -rotate-[30deg]"></div>
                                <div className="h-px w-12 bg-slate-400 -translate-y-[10px] rotate-[30deg]"></div>
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
