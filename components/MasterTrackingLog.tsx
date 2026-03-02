
import React, { useState, useMemo } from 'react';
import { Student, TrainingLog } from '../types';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Dumbbell, Clock, Layers, Activity, ScrollText } from 'lucide-react';

interface MasterTrackingLogProps {
  onClose: () => void;
  students: Student[];
  theme: 'Dia' | 'Noite';
}

// Helper interno para combinar aluno + log
interface EnrichedLog extends TrainingLog {
  studentName: string;
  studentImage?: string;
  studentLevel: string;
}

const MasterTrackingLog: React.FC<MasterTrackingLogProps> = ({ onClose, students, theme }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedLogDetails, setSelectedLogDetails] = useState<EnrichedLog | null>(null);

  // Agrega todos os logs de todos os alunos em uma única lista plana
  const allLogs = useMemo(() => {
    const logs: EnrichedLog[] = [];
    students.forEach(student => {
      if (student.trainingLogs) {
        student.trainingLogs.forEach(log => {
          logs.push({
            ...log,
            studentName: student.name,
            studentImage: student.profileImage,
            studentLevel: student.level
          });
        });
      }
    });
    return logs;
  }, [students]);

  // Filtra logs para a data selecionada
  const logsForSelectedDate = allLogs.filter(log => log.date === selectedDateStr);

  // Helpers de Calendário
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);
    setSelectedLogDetails(null); // Limpa detalhe ao trocar data
  };

  // Styles
  const modalBg = theme === 'Noite' ? 'bg-[#121212]' : 'bg-white';
  const cardBg = theme === 'Noite' ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-zinc-200 shadow-sm';
  const textColor = theme === 'Noite' ? 'text-white' : 'text-zinc-900';
  const subTextColor = theme === 'Noite' ? 'text-zinc-500' : 'text-zinc-500';

  return (
    <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl p-6 flex items-center justify-center animate-in zoom-in-95">
      <div className={`${modalBg} w-full max-w-6xl h-[90vh] rounded-[3rem] border border-red-900/30 shadow-2xl flex flex-col overflow-hidden relative`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-red-900/10 to-transparent">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-red-900 text-white rounded-2xl shadow-lg shadow-red-900/20"><ScrollText size={24} /></div>
             <div>
                <h2 className={`text-xl font-black uppercase italic ${textColor}`}>Pergaminho do Clã</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Rastreamento de Batalhas</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-red-900 transition-colors"><X size={28} /></button>
        </div>

        <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            
            {/* Esquerda: Calendário */}
            <div className={`w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col ${theme === 'Noite' ? 'bg-zinc-900/30' : 'bg-zinc-50'}`}>
                <div className="flex justify-between items-center mb-6">
                   <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={20} className={textColor} /></button>
                   <h3 className={`text-lg font-black uppercase ${textColor}`}>{monthNames[currentDate.getMonth()]} <span className="text-red-900">{currentDate.getFullYear()}</span></h3>
                   <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={20} className={textColor} /></button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                   {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                      <div key={day} className="text-center text-[10px] font-black uppercase text-zinc-500">{day}</div>
                   ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                   {Array.from({ length: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square"></div>
                   ))}
                   {Array.from({ length: getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                      const day = i + 1;
                      const dayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const hasLogs = allLogs.some(l => l.date === dayStr);
                      const isSelected = dayStr === selectedDateStr;
                      
                      return (
                        <button 
                          key={day} 
                          onClick={() => handleDayClick(day)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all border ${isSelected ? 'border-red-900 bg-red-900 text-white shadow-lg scale-105' : `border-transparent ${theme === 'Noite' ? 'hover:bg-white/5 text-zinc-400' : 'hover:bg-zinc-200 text-zinc-600'}`}`}
                        >
                           <span className="text-sm font-bold">{day}</span>
                           {hasLogs && !isSelected && (
                             <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600"></div>
                           )}
                        </button>
                      );
                   })}
                </div>
                
                <div className="mt-auto pt-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Dias com Treino Registrado</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500">Dias de Descanso</span>
                    </div>
                </div>
            </div>

            {/* Direita: Lista de Logs do Dia */}
            <div className="w-full md:w-7/12 p-6 flex flex-col overflow-hidden relative">
                <h3 className={`text-sm font-black uppercase italic ${subTextColor} mb-4 tracking-widest`}>
                    Guerreiros em atividade em {selectedDateStr.split('-').reverse().join('/')}
                </h3>

                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3">
                    {logsForSelectedDate.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30">
                            <Dumbbell size={48} className="text-zinc-500 mb-4" />
                            <p className="text-sm font-bold uppercase italic text-zinc-500">O Dojo esteve silencioso neste dia.</p>
                        </div>
                    ) : (
                        logsForSelectedDate.map((log, idx) => (
                            <div 
                                key={`${log.id}-${idx}`}
                                onClick={() => setSelectedLogDetails(log)}
                                className={`${cardBg} p-4 rounded-2xl flex justify-between items-center cursor-pointer group hover:border-red-900/30 transition-all`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                                        {log.studentImage ? <img src={log.studentImage} className="w-full h-full object-cover" /> : <User size={20} className="text-zinc-500" />}
                                    </div>
                                    <div>
                                        <h4 className={`font-black uppercase italic text-sm ${textColor} group-hover:text-red-900 transition-colors`}>{log.studentName}</h4>
                                        <p className="text-[10px] font-bold text-zinc-500">{log.workoutTitle}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-zinc-500">
                                        <Clock size={12} /> {log.duration}
                                    </div>
                                    <div className="flex items-center justify-end gap-1 text-[10px] font-bold text-zinc-500">
                                        <Activity size={12} /> {log.totalLoad}kg
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* --- MODAL DE DETALHES (OVERLAY) --- */}
        {selectedLogDetails && (
            <div className="absolute inset-0 z-[130] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
                <div className={`${theme === 'Noite' ? 'bg-[#1A1A1A]' : 'bg-white'} w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-red-900/20 flex flex-col overflow-hidden max-h-full`}>
                    <div className="p-6 border-b border-white/5 flex justify-between items-start bg-red-900/5">
                        <div className="flex items-center gap-4">
                             <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center overflow-hidden border-2 border-red-900 shadow-lg">
                                {selectedLogDetails.studentImage ? <img src={selectedLogDetails.studentImage} className="w-full h-full object-cover" /> : <User size={24} className="text-zinc-500" />}
                             </div>
                             <div>
                                <p className="text-[10px] font-black uppercase text-red-900 tracking-widest">Relatório de Combate</p>
                                <h3 className={`text-xl font-black uppercase italic ${textColor}`}>{selectedLogDetails.studentName}</h3>
                                <p className="text-[10px] font-bold text-zinc-500">{selectedLogDetails.studentLevel}</p>
                             </div>
                        </div>
                        <button onClick={() => setSelectedLogDetails(null)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white"><X size={20} /></button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <div className="mb-6">
                            <h4 className={`text-lg font-black uppercase italic ${textColor} mb-1`}>{selectedLogDetails.workoutTitle}</h4>
                            <p className="text-xs text-zinc-500 font-bold">{selectedLogDetails.date.split('-').reverse().join('/')}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className={`p-3 rounded-2xl ${theme === 'Noite' ? 'bg-black/20' : 'bg-zinc-50'} text-center`}>
                                <Clock size={16} className="mx-auto text-red-900 mb-1" />
                                <p className="text-[9px] font-black uppercase text-zinc-500">Tempo</p>
                                <p className={`text-sm font-black ${textColor}`}>{selectedLogDetails.duration}</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${theme === 'Noite' ? 'bg-black/20' : 'bg-zinc-50'} text-center`}>
                                <Dumbbell size={16} className="mx-auto text-red-900 mb-1" />
                                <p className="text-[9px] font-black uppercase text-zinc-500">Carga</p>
                                <p className={`text-sm font-black ${textColor}`}>{selectedLogDetails.totalLoad}kg</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${theme === 'Noite' ? 'bg-black/20' : 'bg-zinc-50'} text-center`}>
                                <Layers size={16} className="mx-auto text-red-900 mb-1" />
                                <p className="text-[9px] font-black uppercase text-zinc-500">Volume</p>
                                <p className={`text-sm font-black ${textColor}`}>{selectedLogDetails.totalVolume}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pl-1">Detalhamento Técnico</h5>
                            {selectedLogDetails.exercises.map((ex, idx) => (
                                <div key={idx} className={`p-4 rounded-2xl border ${theme === 'Noite' ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50 border-zinc-100'} flex justify-between items-center`}>
                                    <div>
                                        <p className={`text-xs font-black uppercase ${textColor}`}>{ex.name}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-zinc-500 bg-black/10 px-2 py-0.5 rounded">{ex.sets} Sets</span>
                                            <span className="text-[10px] font-bold text-zinc-500 bg-black/10 px-2 py-0.5 rounded">{ex.reps} Reps</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-red-900">{ex.weight}kg</p>
                                        <p className="text-[8px] font-bold text-zinc-500 uppercase">Carga Máx</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default MasterTrackingLog;
