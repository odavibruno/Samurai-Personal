
import React, { useState } from 'react';
import { UserProfile, TrainingLog } from '../types';
import { X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Dumbbell, Layers, Trash2, Edit3, Save, CheckCircle2 } from 'lucide-react';

interface CalendarModalProps {
  onClose: () => void;
  user: UserProfile;
  onUpdateLog: (log: TrainingLog) => void;
  onDeleteLog: (logId: string) => void;
  theme: 'Dia' | 'Noite';
}

const CalendarModal: React.FC<CalendarModalProps> = ({ onClose, user, onUpdateLog, onDeleteLog, theme }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState<TrainingLog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado temporário para edição
  const [editForm, setEditForm] = useState<Partial<TrainingLog>>({});

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getLogForDay = (day: number) => {
    const checkDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return user.trainingLogs?.find(log => log.date === checkDate);
  };

  const handleDayClick = (day: number) => {
    const log = getLogForDay(day);
    if (log) {
      setSelectedLog(log);
      setEditForm(JSON.parse(JSON.stringify(log))); // Clone para edição
      setIsEditing(false);
    }
  };

  const handleDeleteLog = () => {
    if (!selectedLog) return;
    if (window.confirm("Tem certeza que deseja apagar este registro de batalha?")) {
      onDeleteLog(selectedLog.id);
      setSelectedLog(null);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedLog || !editForm) return;

    const updatedLog = { ...selectedLog, ...editForm } as TrainingLog;
    onUpdateLog(updatedLog);
    setSelectedLog(updatedLog);
    setIsEditing(false);
  };

  const updateExerciseField = (index: number, field: string, value: any) => {
    if (!editForm.exercises) return;
    const newExercises = [...editForm.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setEditForm({ ...editForm, exercises: newExercises });
  };

  const modalBg = theme === 'Noite' ? 'bg-[#121212]' : 'bg-white';
  const bubbleColor = theme === 'Noite' ? 'bg-[#1A1A1A]' : 'bg-slate-50 border border-zinc-200';
  const inputBg = theme === 'Noite' ? 'bg-black/40 border-white/10' : 'bg-white border-zinc-200';
  const textColor = theme === 'Noite' ? 'text-white' : 'text-zinc-900';

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl p-4 flex items-center justify-center animate-in zoom-in-95">
      <div className={`${modalBg} w-full max-w-lg h-[90vh] rounded-[3rem] shadow-2xl border ${theme === 'Noite' ? 'border-red-900/30' : 'border-zinc-200'} flex flex-col overflow-hidden relative`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-b from-black/20 to-transparent">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-900/20 rounded-xl text-red-900"><CalendarIcon size={24} /></div>
             <div>
                <h2 className={`text-lg font-black uppercase italic tracking-widest ${textColor}`}>Calendário de Guerra</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">Registros do Clã</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-red-900 transition-colors"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6">
           
           {!selectedLog ? (
             <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                {/* Navegação Mês */}
                <div className="flex justify-between items-center mb-4">
                   <button onClick={prevMonth} className={`p-3 rounded-full ${bubbleColor} hover:bg-red-900 hover:text-white transition-all`}><ChevronLeft size={20} /></button>
                   <h3 className={`text-xl font-black uppercase italic ${textColor}`}>{monthNames[currentDate.getMonth()]} <span className="text-red-900">{currentDate.getFullYear()}</span></h3>
                   <button onClick={nextMonth} className={`p-3 rounded-full ${bubbleColor} hover:bg-red-900 hover:text-white transition-all`}><ChevronRight size={20} /></button>
                </div>

                {/* Grid Calendário */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                   {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                      <div key={day} className="text-center text-[10px] font-black uppercase text-zinc-500 py-2">{day}</div>
                   ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                   {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square"></div>
                   ))}
                   {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const log = getLogForDay(day);
                      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                      
                      return (
                        <button 
                          key={day} 
                          onClick={() => handleDayClick(day)}
                          className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-90 border ${isToday ? 'border-red-900 bg-red-900/10' : 'border-transparent'} ${log ? (theme === 'Noite' ? 'bg-[#1A1A1A] hover:bg-[#252525]' : 'bg-slate-100 hover:bg-slate-200') : (theme === 'Noite' ? 'hover:bg-white/5 text-zinc-600' : 'hover:bg-slate-50 text-zinc-400')}`}
                        >
                           <span className={`text-sm font-bold ${log ? (theme === 'Dia' ? 'text-zinc-900' : 'text-white') : ''}`}>{day}</span>
                           {log && (
                             <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                           )}
                        </button>
                      );
                   })}
                </div>
                
                <div className={`mt-6 p-4 rounded-2xl ${bubbleColor} flex items-center gap-3 text-xs text-zinc-500`}>
                   <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                   <span className="font-bold uppercase italic">Dia de Batalha Concluída</span>
                </div>
             </div>
           ) : (
             <div className="space-y-6 animate-in slide-in-from-right-4">
                <button onClick={() => setSelectedLog(null)} className="text-[10px] font-black uppercase text-zinc-500 hover:text-red-900 flex items-center gap-1 mb-2">
                   <ChevronLeft size={14} /> Voltar ao Calendário
                </button>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-2xl font-black italic uppercase leading-none ${textColor}`}>{selectedLog.workoutTitle}</h3>
                    <p className="text-xs font-bold text-red-900 uppercase mt-1 italic tracking-widest">{selectedLog.date.split('-').reverse().join('/')}</p>
                  </div>
                  <div className="flex gap-2">
                     {!isEditing ? (
                        <>
                          <button onClick={() => setIsEditing(true)} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"><Edit3 size={18} /></button>
                          <button onClick={handleDeleteLog} className="p-3 bg-red-900/10 border border-red-900/20 rounded-xl text-red-700 hover:bg-red-900 hover:text-white transition-all"><Trash2 size={18} /></button>
                        </>
                     ) : (
                        <button onClick={() => setIsEditing(false)} className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all"><X size={18} /></button>
                     )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Título do Treino</label>
                        <input className={`w-full ${inputBg} p-3 rounded-2xl text-sm font-bold ${textColor}`} value={editForm.workoutTitle} onChange={e => setEditForm({...editForm, workoutTitle: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Duração</label>
                           <input className={`w-full ${inputBg} p-3 rounded-2xl text-sm font-bold ${textColor}`} value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase text-zinc-500 ml-1">Carga Total (Kg)</label>
                           <input type="number" className={`w-full ${inputBg} p-3 rounded-2xl text-sm font-bold ${textColor}`} value={editForm.totalLoad} onChange={e => setEditForm({...editForm, totalLoad: Number(e.target.value)})} />
                        </div>
                     </div>
                     
                     <div className="space-y-2 mt-4">
                        <h4 className="text-xs font-black uppercase text-red-900 italic mb-2">Exercícios Executados</h4>
                        {editForm.exercises?.map((ex, idx) => (
                           <div key={idx} className={`p-3 rounded-2xl border border-white/5 ${theme === 'Noite' ? 'bg-black/20' : 'bg-slate-50'}`}>
                              <input className={`w-full bg-transparent border-b border-white/10 mb-2 pb-1 text-xs font-black uppercase ${textColor}`} value={ex.name} onChange={e => updateExerciseField(idx, 'name', e.target.value)} />
                              <div className="grid grid-cols-3 gap-2">
                                 <div><span className="text-[8px] uppercase text-zinc-500">Sets</span><input type="number" className={`w-full bg-transparent text-xs font-bold ${textColor}`} value={ex.sets} onChange={e => updateExerciseField(idx, 'sets', Number(e.target.value))} /></div>
                                 <div><span className="text-[8px] uppercase text-zinc-500">Reps</span><input className={`w-full bg-transparent text-xs font-bold ${textColor}`} value={ex.reps} onChange={e => updateExerciseField(idx, 'reps', e.target.value)} /></div>
                                 <div><span className="text-[8px] uppercase text-zinc-500">Carga</span><input type="number" className={`w-full bg-transparent text-xs font-bold ${textColor}`} value={ex.weight} onChange={e => updateExerciseField(idx, 'weight', Number(e.target.value))} /></div>
                              </div>
                           </div>
                        ))}
                     </div>

                     <button onClick={handleSaveEdit} className="w-full bg-red-900 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 uppercase italic tracking-widest mt-4">
                        <Save size={18} /> Salvar Alterações
                     </button>
                  </div>
                ) : (
                  <>
                     <div className="grid grid-cols-3 gap-3">
                        <div className={`${bubbleColor} p-4 rounded-2xl text-center`}>
                           <Clock size={16} className="mx-auto text-red-900 mb-2" />
                           <p className="text-[9px] font-black uppercase text-zinc-500">Duração</p>
                           <p className={`text-sm font-black ${textColor}`}>{selectedLog.duration}</p>
                        </div>
                        <div className={`${bubbleColor} p-4 rounded-2xl text-center`}>
                           <Dumbbell size={16} className="mx-auto text-red-900 mb-2" />
                           <p className="text-[9px] font-black uppercase text-zinc-500">Carga Total</p>
                           <p className={`text-sm font-black ${textColor}`}>{selectedLog.totalLoad}kg</p>
                        </div>
                        <div className={`${bubbleColor} p-4 rounded-2xl text-center`}>
                           <Layers size={16} className="mx-auto text-red-900 mb-2" />
                           <p className="text-[9px] font-black uppercase text-zinc-500">Volume</p>
                           <p className={`text-sm font-black ${textColor}`}>{selectedLog.totalVolume} sets</p>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase text-zinc-500 italic tracking-widest pl-1">Relatório de Exercícios</h4>
                        {selectedLog.exercises.map((ex, idx) => (
                           <div key={idx} className={`${bubbleColor} p-4 rounded-2xl flex justify-between items-center`}>
                              <div>
                                 <p className={`text-xs font-black uppercase ${textColor}`}>{ex.name}</p>
                                 <p className="text-[10px] font-bold text-zinc-500">{ex.sets} Séries x {ex.reps}</p>
                              </div>
                              <div className="px-3 py-1 bg-red-900/10 rounded-lg">
                                 <p className="text-xs font-black text-red-900">{ex.weight}kg</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </>
                )}
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default CalendarModal;
