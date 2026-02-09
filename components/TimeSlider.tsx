import React, { useState } from 'react';

interface TimeSliderProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ currentDate, onDateChange }) => {
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onDateChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onDateChange(newDate);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between w-full max-w-md mx-auto">
            <button
                onClick={handlePrevMonth}
                className="text-slate-400 hover:text-indigo-600 transition p-2"
                aria-label="Mês Anterior"
            >
                <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>

            <div className="text-center">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest leading-none">
                    {months[currentDate.getMonth()]}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {currentDate.getFullYear()}
                </p>
            </div>

            <button
                onClick={handleNextMonth}
                className="text-slate-400 hover:text-indigo-600 transition p-2"
                aria-label="Próximo Mês"
            >
                <i className="fa-solid fa-chevron-right text-xl"></i>
            </button>
        </div>
    );
};

export default TimeSlider;
