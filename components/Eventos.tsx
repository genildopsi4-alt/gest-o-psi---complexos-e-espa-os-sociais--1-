import React from 'react';
import { Evento } from '../types';

const Eventos: React.FC = () => {
  const eventos: Evento[] = [
    { id: 1, data: '15/01/2026', titulo: 'Palestra: Saúde Mental na Infância', local: 'Auditório João XXIII', publico: '45 pessoas', responsavel: 'Genildo Barbosa' },
    { id: 2, data: '20/01/2026', titulo: 'Dia D - Ação Comunitária', local: 'Quadra do Curió', publico: '120 pessoas', responsavel: 'Equipe Técnica' },
  ];

  return (
    <section className="p-6 md:p-8 animate-fade-in">
      <header className="flex justify-end items-center mb-6">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow flex items-center text-sm transition">
          <i className="fa-solid fa-plus mr-2"></i> Registrar Evento
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Local</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Público</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Responsável</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventos.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.data}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{evento.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.local}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.publico}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.responsavel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Eventos;
