import React, { useState, useRef } from 'react';
import { SoundConfig } from '../types';
import { X, Play, Save, Trash2, Check, Music, Volume2, Upload, FileAudio, AlertCircle, Info } from 'lucide-react';

interface SoundConfigModalProps {
  onClose: () => void;
  config: SoundConfig;
  onUpdate: (newConfig: SoundConfig) => void;
  theme: 'Dia' | 'Noite';
}

const SoundConfigModal: React.FC<SoundConfigModalProps> = ({ onClose, config, onUpdate, theme }) => {
  const [tempConfig, setTempConfig] = useState<SoundConfig>(JSON.parse(JSON.stringify(config)));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Limite de segurança para localStorage (350KB)
  const MAX_FILE_SIZE = 350 * 1024; 

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, category: 'start' | 'rest' | 'finish', index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de Tamanho
    if (file.size > MAX_FILE_SIZE) {
        setErrorMsg(`O arquivo "${file.name}" é muito grande (${(file.size / 1024).toFixed(0)}KB). O limite é 350KB para efeitos sonoros.`);
        setTimeout(() => setErrorMsg(null), 5000);
        return;
    }

    // Validação de Tipo
    if (!file.type.startsWith('audio/')) {
        setErrorMsg("Formato inválido. Por favor, envie um arquivo de áudio (mp3, wav, ogg).");
        setTimeout(() => setErrorMsg(null), 5000);
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const base64Audio = event.target?.result as string;
        const newUrls = [...tempConfig[category]];
        newUrls[index] = base64Audio;
        setTempConfig({ ...tempConfig, [category]: newUrls });
        setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClearSlot = (category: 'start' | 'rest' | 'finish', index: number) => {
    const newUrls = [...tempConfig[category]];
    newUrls[index] = '';
    setTempConfig({ ...tempConfig, [category]: newUrls });
  };

  const handleSelect = (category: 'start' | 'rest' | 'finish', index: number) => {
    const key = category === 'start' ? 'selectedStart' : category === 'rest' ? 'selectedRest' : 'selectedFinish';
    setTempConfig({ ...tempConfig, [key]: index });
  };

  const handlePlay = (url: string) => {
    if (!url) return;
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.play().catch(e => alert("Erro ao reproduzir áudio. Arquivo corrompido."));
    } else {
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play().catch(e => alert("Erro ao reproduzir áudio. Arquivo corrompido."));
    }
  };

  const handleSave = () => {
    onUpdate(tempConfig);
    onClose();
  };

  const modalBg = theme === 'Noite' ? 'bg-[#121212]' : 'bg-white';
  const slotBg = theme === 'Noite' ? 'bg-zinc-900 border-white/5' : 'bg-white border-zinc-200';
  const textColor = theme === 'Noite' ? 'text-white' : 'text-zinc-900';

  const renderSection = (title: string, category: 'start' | 'rest' | 'finish', selectedIndex: number) => (
    <div className={`p-5 rounded-3xl border border-white/5 mb-4 ${theme === 'Noite' ? 'bg-zinc-900/30' : 'bg-zinc-50'}`}>
        <h4 className="text-xs font-black uppercase text-red-900 mb-4 flex items-center gap-2">
            <Volume2 size={14} /> {title}
        </h4>
        <div className="space-y-3">
            {[0, 1, 2].map((idx) => {
                const hasAudio = !!tempConfig[category][idx];
                
                return (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${selectedIndex === idx ? 'border-red-900/50 bg-red-900/5' : slotBg}`}>
                        
                        {/* Botão de Seleção */}
                        <button 
                            onClick={() => handleSelect(category, idx)}
                            className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center transition-all ${selectedIndex === idx ? 'bg-red-900 text-white shadow-lg' : 'bg-zinc-800 text-zinc-600 hover:text-zinc-400'}`}
                        >
                            {selectedIndex === idx && <Check size={16} />}
                        </button>

                        {/* Área do Arquivo */}
                        <div className="flex-grow overflow-hidden">
                            {!hasAudio ? (
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-zinc-700 transition-all">
                                        <Upload size={14} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-zinc-500 group-hover:text-red-900 transition-colors">Carregar Arquivo</span>
                                    <input 
                                        type="file" 
                                        accept="audio/*" 
                                        className="hidden" 
                                        onChange={(e) => handleFileUpload(e, category, idx)}
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center text-red-900">
                                        <FileAudio size={16} />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black uppercase ${textColor}`}>Som Personalizado {idx + 1}</p>
                                        <p className="text-[8px] font-bold uppercase text-green-600">Carregado</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controles (Play / Delete) */}
                        {hasAudio && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handlePlay(tempConfig[category][idx])}
                                    className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white hover:bg-zinc-700 transition-all"
                                >
                                    <Play size={14} />
                                </button>
                                <button 
                                    onClick={() => handleClearSlot(category, idx)}
                                    className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:text-red-500 hover:bg-zinc-700 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        <p className="text-[9px] text-zinc-500 mt-2 italic px-1 flex items-center gap-1">
            <Info size={10} /> Max 350KB por som (sons curtos).
        </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-xl p-6 flex items-center justify-center animate-in zoom-in-95">
      <div className={`${modalBg} w-full max-w-lg h-[85vh] rounded-[3rem] border border-red-900/30 shadow-2xl flex flex-col overflow-hidden relative`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-red-900/10 to-transparent">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-red-900 text-white rounded-2xl shadow-lg shadow-red-900/20"><Music size={24} /></div>
             <div>
                <h2 className={`text-xl font-black uppercase italic ${textColor}`}>Estúdio do Dojo</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Carregar Arquivos</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-red-900 transition-colors"><X size={28} /></button>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
            <div className="mx-6 mt-4 bg-red-900/20 border border-red-900 text-red-200 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                <AlertCircle size={16} /> {errorMsg}
            </div>
        )}

        <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
            {renderSection("Som de Início de Treino", "start", tempConfig.selectedStart)}
            {renderSection("Som de Término de Descanso", "rest", tempConfig.selectedRest)}
            {renderSection("Som de Conclusão (Vitória)", "finish", tempConfig.selectedFinish)}
        </div>

        <div className="p-6 border-t border-white/5 bg-black/10">
            <button 
                onClick={handleSave}
                className="w-full bg-red-900 text-white font-black py-4 rounded-3xl shadow-xl uppercase italic tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
                <Save size={20} /> Salvar Configuração
            </button>
        </div>
      </div>
    </div>
  );
};

export default SoundConfigModal;