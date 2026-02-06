import React, { useState } from 'react';
import { Beneficiario } from '../types';

interface BeneficiariosProps {
  beneficiarios: Beneficiario[];
  setBeneficiarios: React.Dispatch<React.SetStateAction<Beneficiario[]>>;
  initialGroupFilter?: string;
}

const Beneficiarios: React.FC<BeneficiariosProps> = ({ beneficiarios, setBeneficiarios, initialGroupFilter }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [beneficiaryToDelete, setBeneficiaryToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    grupo: 'GAP',
    unidade: 'joao23',
    status: 'regular',
    idade: ''
  });

  // Filter Logic
  const filteredBeneficiarios = beneficiarios.filter(b => {
    const matchesSearch = b.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = initialGroupFilter && initialGroupFilter !== 'todos' ? b.grupo === initialGroupFilter : true;
    return matchesSearch && matchesGroup;
  });

  const unidades = [
    { label: '-- Complexos Sociais --', disabled: true },
    { value: 'joao23', label: 'João XXIII' },
    { value: 'cristo', label: 'Cristo Redentor' },
    { value: 'curio', label: 'Curió' },
    { value: 'barbalha', label: 'Barbalha' },
    { label: '-- Espaços Sociais --', disabled: true },
    { value: 'quintino', label: 'Quintino Cunha' },
    { value: 'barra', label: 'Barra do Ceará' },
    { value: 'dias_macedo', label: 'Dias Macedo' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const maxId = beneficiarios.length > 0 ? Math.max(...beneficiarios.map(b => b.id)) : 0;
    const newId = maxId + 1;
    const colors = ['bg-orange-100', 'bg-teal-100', 'bg-purple-100', 'bg-amber-100', 'bg-sky-100'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const textColor = randomColor.replace('100', '700');

    const unitLabel = unidades.find(u => u.value === formData.unidade)?.label || formData.unidade;

    const newBeneficiario: Beneficiario = {
      id: newId,
      nome: formData.nome,
      grupo: formData.grupo,
      unidade: unitLabel,
      status: formData.status as 'regular' | 'busca_ativa',
      frequencia: ['futuro', 'futuro', 'futuro', 'futuro'],
      avatar_bg: formData.status === 'busca_ativa' ? 'bg-red-200' : randomColor,
      avatar_text: formData.status === 'busca_ativa' ? 'text-red-700' : textColor,
      avatar_letter: formData.nome.charAt(0).toUpperCase(),
      age: formData.idade ? `${formData.idade} anos` : undefined,
      responsavel: ''
    };

    setBeneficiarios([newBeneficiario, ...beneficiarios]);
    setIsModalOpen(false);
    setFormData({
      nome: '',
      grupo: 'GAP',
      unidade: 'joao23',
      status: 'regular',
      idade: ''
    });
  };

  const confirmDelete = () => {
    if (beneficiaryToDelete !== null) {
      setBeneficiarios(prev => prev.filter(b => b.id !== beneficiaryToDelete));
      setBeneficiaryToDelete(null);
    }
  };

  return (
    <section className="p-6 md:p-8 animate-fade-in relative">
      <header className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar no Brincar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-full text-sm w-full sm:w-72 outline-none focus:ring-orange-500 focus:border-orange-500 transition shadow-sm font-medium"
            />
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 shadow-lg flex items-center justify-center text-sm font-black uppercase tracking-wider transition-all hover:-translate-y-0.5">
            <i className="fa-solid fa-user-plus mr-2"></i> Novo Registro
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Participante</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Grupo</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidade</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Frequência</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-50">
              {filteredBeneficiarios.map((b) => (
                <tr key={b.id} className={b.status === 'busca_ativa' ? 'bg-red-50/30' : 'hover:bg-orange-50/20 transition'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-2xl ${b.avatar_bg} flex items-center justify-center ${b.avatar_text} font-black text-sm shrink-0 shadow-inner`}>
                        {b.avatar_letter}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-black text-slate-800">{b.nome}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{b.age}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${b.grupo === 'GAP' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                      {b.grupo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-500 max-w-[200px] truncate">{b.unidade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1.5">
                      {b.frequencia.map((f, idx) => {
                        let color = 'bg-slate-200';
                        if (f === 'presente') color = 'bg-emerald-500';
                        if (f === 'falta') color = 'bg-red-500';
                        if (f === 'justificada') color = 'bg-yellow-400';

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setBeneficiarios(prev => prev.map(benef => {
                                if (benef.id !== b.id) return benef;
                                const newFreq = [...benef.frequencia];
                                const current = newFreq[idx];
                                let next = 'futuro';
                                if (current === 'futuro') next = 'presente';
                                else if (current === 'presente') next = 'falta';
                                else if (current === 'falta') next = 'justificada';
                                else if (current === 'justificada') next = 'futuro';
                                newFreq[idx] = next;
                                return { ...benef, frequencia: newFreq };
                              }));
                            }}
                            className={`w-3 h-3 rounded-full ${color} shadow-sm cursor-pointer hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-300`}
                            title={`Clique para mudar: Atual ${f}`}
                          ></button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {b.status === 'busca_ativa' ? (
                      <span className="px-3 py-1 inline-flex text-[9px] font-black uppercase rounded-full bg-red-500 text-white shadow-sm animate-pulse">ALERTA</span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-[9px] font-black uppercase rounded-full bg-emerald-100 text-emerald-700">Ativo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-orange-500 transition">
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button onClick={() => setBeneficiaryToDelete(b.id)} className="p-2 text-slate-400 hover:text-red-500 transition">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-slate-100">
            <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl uppercase tracking-tight">Novo Cadastro</h3>
                <p className="text-xs font-bold text-orange-100">Vincular participante ao Brincar</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:rotate-90 transition duration-300 w-10 h-10 flex items-center justify-center">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nome Completo</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} className="w-full border-2 border-slate-100 rounded-2xl p-3 outline-none focus:border-orange-500 transition font-bold text-slate-700" placeholder="Ex: Ana Clara" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Idade</label>
                  <input type="number" name="idade" value={formData.idade} onChange={handleInputChange} className="w-full border-2 border-slate-100 rounded-2xl p-3 outline-none focus:border-orange-500 transition font-bold text-slate-700" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Grupo de Vínculo</label>
                  <select name="grupo" value={formData.grupo} onChange={handleInputChange} className="w-full border-2 border-slate-100 rounded-2xl p-3 outline-none focus:border-orange-500 transition font-bold text-slate-700">
                    <option value="GAP">GAP (Adolescentes)</option>
                    <option value="GFA">GFA (Família Atípica)</option>
                    <option value="ACT">ACT (Parentalidade)</option>
                    <option value="GPI">GPI (Idosos)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Unidade Destino</label>
                <select name="unidade" value={formData.unidade} onChange={handleInputChange} className="w-full border-2 border-slate-100 rounded-2xl p-3 outline-none focus:border-orange-500 transition font-bold text-slate-700">
                  {unidades.map((u, i) => (
                    <option key={i} value={u.value} disabled={u.disabled}>{u.label}</option>
                  ))}
                </select>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase text-slate-400 hover:text-slate-600 transition">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-orange-600 transition hover:-translate-y-1">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Beneficiarios;
