import React from 'react';

interface Professional {
    id: string;
    name: string;
    role: string;
    unit: string;
    crp?: string;
    avatarUrl?: string; // Optional URL for avatar image
}

interface ProfileFilterProps {
    selectedProfessionalId: string | null;
    onSelectProfessional: (id: string | null) => void;
}

export const mockProfessionals: Professional[] = [
    { id: 'genildo', name: 'Genildo Barbosa', role: 'Gestor Psicossocial', unit: 'CSMI João XXIII', crp: '11/15203' },
    { id: 'ana', name: 'Ana Paula', role: 'Psicóloga Social', unit: 'CSMI Cristo Redentor', crp: '11/05432' },
    { id: 'joao', name: 'João Silva', role: 'Psicólogo Social', unit: 'Espaço Social Quintino Cunha', crp: '11/09876' },
    { id: 'maria', name: 'Maria Souza', role: 'Psicóloga Social', unit: 'CSMI Curió', crp: '11/12345' },
];

const ProfileFilter: React.FC<ProfileFilterProps> = ({ selectedProfessionalId, onSelectProfessional }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide">

            {/* Option: All / Global */}
            <button
                onClick={() => onSelectProfessional(null)}
                className={`flex flex-col items-center gap-2 min-w-[80px] group transition-all transform hover:scale-105 ${selectedProfessionalId === null ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-4 transition-colors ${selectedProfessionalId === null ? 'bg-indigo-600 border-indigo-200' : 'bg-slate-200 border-white'}`}>
                    <i className={`fa-solid fa-users text-xl ${selectedProfessionalId === null ? 'text-white' : 'text-slate-400'}`}></i>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide text-center leading-tight ${selectedProfessionalId === null ? 'text-indigo-700' : 'text-slate-400'}`}>
                    Todos
                </span>
            </button>

            {/* Professionals List */}
            {mockProfessionals.map(prof => (
                <button
                    key={prof.id}
                    onClick={() => onSelectProfessional(prof.id)}
                    className={`flex flex-col items-center gap-2 min-w-[80px] group transition-all transform hover:scale-105 ${selectedProfessionalId === prof.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-4 transition-colors overflow-hidden ${selectedProfessionalId === prof.id ? 'border-orange-400' : 'border-white'}`}>
                        {/* Fallback to Initials if no image */}
                        <div className={`w-full h-full flex items-center justify-center ${selectedProfessionalId === prof.id ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="font-black text-lg">{prof.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className={`block text-[10px] font-bold uppercase tracking-wide leading-tight ${selectedProfessionalId === prof.id ? 'text-orange-700' : 'text-slate-500'}`}>
                            {prof.name.split(' ')[0]}
                        </span>
                        <span className="block text-[8px] font-bold text-slate-300 uppercase truncate max-w-[80px]">
                            {prof.unit.replace('CSMI ', '')}
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ProfileFilter;
