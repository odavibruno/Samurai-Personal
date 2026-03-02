
import React, { useState } from 'react';
import { Exercise } from '../types';
import { Search, Info, Swords, Target, Play, Edit3, X, Save, Plus, Sparkles, Loader2, Lock, PenTool, Youtube, Link as LinkIcon, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react';
import { findExerciseDetails } from '../services/geminiService';

const INITIAL_EXERCISES: Exercise[] = [
  // PEITO
  { id: 'p1', name: 'Supino Reto (Barra)', category: 'Peito', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Construtor base de volume. Cotovelos a 45º.', videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg' },
  { id: 'p2', name: 'Supino Inclinado (Halteres)', category: 'Peito', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Foco na porção clavicular. Maior amplitude.', videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8' },
  { id: 'p3', name: 'Crucifixo (Peck Deck)', category: 'Peito', type: 'Máquina', sets: 0, reps: '', weight: 0, rest: '', description: 'Isolamento total com tensão constante.', videoUrl: 'https://www.youtube.com/embed/h1KOjmgyTbw' },
  { id: 'p4', name: 'Crossover Polia Alta', category: 'Peito', type: 'Polia', sets: 0, reps: '', weight: 0, rest: '', description: 'Foco na porção inferior e miolo do peito.', videoUrl: 'https://www.youtube.com/embed/I5tJAb2gZ2A' },
  { id: 'p5', name: 'Flexão de Braços', category: 'Peito', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Controle corporal e core. Peito ao chão.', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },

  // COSTAS
  { id: 'c1', name: 'Puxada Frontal', category: 'Costas', type: 'Polia', sets: 0, reps: '', weight: 0, rest: '', description: 'Expansão dorsal. Puxe com os cotovelos.', videoUrl: 'https://www.youtube.com/embed/AOidL00T2eE' },
  { id: 'c2', name: 'Remada Curvada (Barra)', category: 'Costas', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Espessura bruta. Tronco estável.', videoUrl: 'https://www.youtube.com/embed/G8l_8chR5BE' },
  { id: 'c3', name: 'Remada Baixa (Triângulo)', category: 'Costas', type: 'Polia', sets: 0, reps: '', weight: 0, rest: '', description: 'Latíssimo inferior e miolo das costas.', videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74' },
  { id: 'c4', name: 'Levantamento Terra', category: 'Costas', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Força sistêmica. Cadeia posterior completa.', videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q' },
  { id: 'c5', name: 'Pulldown (Polia)', category: 'Costas', type: 'Polia', sets: 0, reps: '', weight: 0, rest: '', description: 'Isolamento do grande dorsal sem bíceps.', videoUrl: 'https://www.youtube.com/embed/JGeRYIzsCJI' },

  // PERNAS
  { id: 'l1', name: 'Agachamento Livre', category: 'Pernas', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Rei dos exercícios. Profundidade é essencial.', videoUrl: 'https://www.youtube.com/embed/U3HlEF_E9fo' },
  { id: 'l2', name: 'Leg Press 45', category: 'Pernas', type: 'Máquina', sets: 0, reps: '', weight: 0, rest: '', description: 'Carga alta com segurança lombar.', videoUrl: 'https://www.youtube.com/embed/qJ_l7QeLp-4' },
  { id: 'l3', name: 'Cadeira Extensora', category: 'Pernas', type: 'Máquina', sets: 0, reps: '', weight: 0, rest: '', description: 'Pico de contração do quadríceps.', videoUrl: 'https://www.youtube.com/embed/YyvSfVjQeL0' },
  { id: 'l4', name: 'Stiff (Barra)', category: 'Pernas', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Alongamento total dos posteriores.', videoUrl: 'https://www.youtube.com/embed/5Poo6p1k8Bw' },
  { id: 'l5', name: 'Afundo (Halteres)', category: 'Pernas', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Unilateral para corrigir assimetrias.', videoUrl: 'https://www.youtube.com/embed/b0dI1n9q7Dk' },
  
  // OMBROS
  { id: 'o1', name: 'Desenvolvimento (Halteres)', category: 'Ombros', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Massa geral de ombro. Estabilidade.', videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog' },
  { id: 'o2', name: 'Elevação Lateral', category: 'Ombros', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Foco na largura (cabeça lateral).', videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo' },
  { id: 'o3', name: 'Crucifixo Inverso', category: 'Ombros', type: 'Máquina', sets: 0, reps: '', weight: 0, rest: '', description: 'Postura e deltoide posterior.', videoUrl: 'https://www.youtube.com/embed/5y827aF6dHQ' },

  // BRAÇOS
  { id: 'a1', name: 'Rosca Direta (Barra W)', category: 'Braços', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Carga bruta para bíceps.', videoUrl: 'https://www.youtube.com/embed/jyMP2T2Y-Y4' },
  { id: 'a2', name: 'Tríceps Testa (Barra W)', category: 'Braços', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Cabeça longa do tríceps. Alongue bem.', videoUrl: 'https://www.youtube.com/embed/nRiJVZDpdL0' },
  { id: 'a3', name: 'Tríceps Corda', category: 'Braços', type: 'Polia', sets: 0, reps: '', weight: 0, rest: '', description: 'Esmagamento final. Abra a corda no fim.', videoUrl: 'https://www.youtube.com/embed/6yMdhi2DVao' },
  { id: 'a4', name: 'Rosca Martelo', category: 'Braços', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Braquial e antebraço. Pegada neutra.', videoUrl: 'https://www.youtube.com/embed/zC3nLlEcyqn' },

  // CORE
  { id: 'cr1', name: 'Prancha Abdominal', category: 'Core', type: 'Core', sets: 0, reps: '', weight: 0, rest: '', description: 'Estabilidade isométrica total.', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw' },
  { id: 'cr2', name: 'Abdominal Infra', category: 'Core', type: 'Peso Livre', sets: 0, reps: '', weight: 0, rest: '', description: 'Foco na porção inferior do reto abdominal.', videoUrl: 'https://www.youtube.com/embed/ByZXX5520cM' },
];

const BattleTechniques: React.FC<{ isLider: boolean, theme: 'Dia' | 'Noite' }> = ({ isLider, theme }) => {
  const [exercises, setExercises] = useState(INITIAL_EXERCISES);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'Todos' | 'Peito' | 'Costas' | 'Pernas' | 'Braços' | 'Ombros' | 'Core'>('Todos');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);
  
  // States para adição (Modal)
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [addMethod, setAddMethod] = useState<'AI' | 'MANUAL'>('AI');
  
  // State AI
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // State Manual
  const [manualForm, setManualForm] = useState<Partial<Exercise>>({
    name: '',
    category: 'Peito',
    type: 'Peso Livre',
    description: '',
    videoUrl: ''
  });

  // Função robusta para corrigir URLs do YouTube e extrair Embed e ID
  const getYouTubeInfo = (url: string) => {
    if (!url) return { embedUrl: '', videoId: '' };
    const cleanUrl = url.trim();
    let videoId = '';

    // Regex para capturar ID de vários formatos (watch, short, youtu.be, etc)
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = cleanUrl.match(regExp);

    if (match && match[2].length === 11) {
        videoId = match[2];
    } else {
        // Verifica se é apenas o ID
        if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
            videoId = cleanUrl;
        }
    }

    if (videoId) {
        // Adiciona origin e outros parametros para tentar evitar erros de permissão
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return { 
            embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${origin}`,
            videoId 
        };
    }

    return { embedUrl: '', videoId: '' };
  };

  const filtered = exercises.filter(ex => 
    (activeTab === 'Todos' || ex.category === activeTab) &&
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEx) return;
    
    // Sanitiza a URL ao salvar
    const { videoId } = getYouTubeInfo(editingEx.videoUrl);
    const finalUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : editingEx.videoUrl;

    const updatedEx = { ...editingEx, videoUrl: finalUrl };
    setExercises(exercises.map(ex => ex.id === updatedEx.id ? updatedEx : ex));
    setEditingEx(null);
  };

  const handleAiAdd = async () => {
    if (!newExerciseName.trim()) return;
    setIsGenerating(true);
    
    const details = await findExerciseDetails(newExerciseName);
    
    if (details) {
      const newEx: Exercise = {
        id: Math.random().toString(),
        name: details.name || newExerciseName,
        category: details.category || 'Core',
        type: details.type || 'Peso Livre',
        description: details.description || 'Adicionado via IA Samurai',
        videoUrl: details.videoId ? `https://www.youtube.com/embed/${details.videoId}` : '',
        sets: 0, reps: '', weight: 0, rest: '' 
      };
      
      setExercises(prev => [...prev, newEx]);
      setIsAddingMode(false);
      setNewExerciseName('');
      alert(`Técnica "${newEx.name}" adicionada ao pergaminho com sucesso!`);
    } else {
      alert("A IA não conseguiu encontrar detalhes para esta técnica. Tente outro nome ou use o modo manual.");
    }
    
    setIsGenerating(false);
  };

  const handleManualAdd = () => {
    if (!manualForm.name) {
        alert("O nome da técnica é obrigatório.");
        return;
    }

    const { videoId } = getYouTubeInfo(manualForm.videoUrl || '');
    const finalUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

    const newEx: Exercise = {
        id: Math.random().toString(),
        name: manualForm.name,
        category: (manualForm.category as any) || 'Core',
        type: (manualForm.type as any) || 'Peso Livre',
        description: manualForm.description || '',
        videoUrl: finalUrl,
        sets: 0, reps: '', weight: 0, rest: '' 
    };

    setExercises(prev => [...prev, newEx]);
    setIsAddingMode(false);
    setManualForm({ name: '', category: 'Peito', type: 'Peso Livre', description: '', videoUrl: '' });
    alert(`Técnica "${newEx.name}" registrada manualmente!`);
  };

  const bubbleColor = theme === 'Noite' ? 'bg-[#1A1A1A]' : 'bg-white border border-zinc-100 shadow-sm';
  const inputBg = theme === 'Noite' ? 'bg-[#1A1A1A]' : 'bg-white border border-zinc-100';
  const modalBg = theme === 'Noite' ? 'bg-[#121212]' : 'bg-white';

  return (
    <div className="space-y-6 pb-10">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-900/10 rounded-2xl text-red-900"><Swords size={32} /></div>
          <div>
            <h2 className="text-sm font-black uppercase text-zinc-600 tracking-widest">Dojo Library</h2>
            <h3 className="text-3xl font-black uppercase italic">Técnicas</h3>
          </div>
        </div>
        
        {isLider && (
          <button 
            onClick={() => setIsAddingMode(true)}
            className="bg-red-900 text-white p-3 rounded-2xl shadow-xl hover:bg-red-800 transition-colors active:scale-95 flex items-center gap-2"
            title="Adicionar Técnica"
          >
            <Plus size={24} />
          </button>
        )}
      </header>

      {/* Modal Adicionar Novo */}
      {isAddingMode && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md p-6 flex items-center justify-center animate-in zoom-in-95 overflow-y-auto">
          <div className={`${modalBg} w-full max-w-lg p-6 rounded-[3rem] border border-red-900/30 shadow-2xl relative flex flex-col`}>
            <button onClick={() => setIsAddingMode(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-red-900"><X size={24} /></button>
            
            <div className="flex flex-col items-center mb-6 text-center pt-2">
              <h3 className={`text-xl font-black uppercase italic ${theme === 'Dia' ? 'text-zinc-900' : 'text-white'}`}>Nova Técnica</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Expanda o conhecimento do Clã</p>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-6">
                <button 
                    onClick={() => setAddMethod('AI')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${addMethod === 'AI' ? 'bg-white dark:bg-zinc-700 shadow-md text-red-900' : 'text-zinc-400'}`}
                >
                    <Sparkles size={14} /> IA Ancestral
                </button>
                <button 
                    onClick={() => setAddMethod('MANUAL')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${addMethod === 'MANUAL' ? 'bg-white dark:bg-zinc-700 shadow-md text-red-900' : 'text-zinc-400'}`}
                >
                    <PenTool size={14} /> Registro Manual
                </button>
            </div>

            {addMethod === 'AI' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                    <div className="p-4 bg-red-900/5 rounded-2xl border border-red-900/10 mb-2">
                        <p className="text-[10px] text-zinc-500 text-center italic">A IA buscará automaticamente o grupo muscular, descrição e um vídeo de referência no YouTube.</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic ml-2">Nome da Técnica</label>
                        <input 
                        type="text" 
                        autoFocus
                        placeholder="Ex: Supino Reto, Agachamento Búlgaro..."
                        className={`w-full ${theme === 'Noite' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-zinc-200'} border rounded-2xl p-4 text-sm font-bold focus:border-red-900 focus:outline-none`} 
                        value={newExerciseName} 
                        onChange={e => setNewExerciseName(e.target.value)} 
                        onKeyPress={e => e.key === 'Enter' && handleAiAdd()}
                        />
                    </div>

                    <button 
                        onClick={handleAiAdd}
                        disabled={isGenerating || !newExerciseName.trim()}
                        className="w-full bg-red-900 text-white font-black py-4 rounded-3xl shadow-xl flex items-center justify-center gap-2 italic uppercase disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isGenerating ? <><Loader2 size={18} className="animate-spin" /> Buscando nos Pergaminhos...</> : <><Search size={18} /> Buscar e Adicionar</>}
                    </button>
                </div>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Nome</label>
                        <input 
                            className={`w-full ${inputBg} border rounded-2xl p-3 text-sm font-bold`} 
                            value={manualForm.name} 
                            onChange={e => setManualForm({...manualForm, name: e.target.value})}
                            placeholder="Nome do Exercício"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Grupo</label>
                            <select 
                                className={`w-full ${inputBg} border rounded-2xl p-3 text-xs font-bold`} 
                                value={manualForm.category} 
                                onChange={e => setManualForm({...manualForm, category: e.target.value as any})}
                            >
                                {['Peito', 'Costas', 'Pernas', 'Braços', 'Ombros', 'Core'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Tipo</label>
                            <select 
                                className={`w-full ${inputBg} border rounded-2xl p-3 text-xs font-bold`} 
                                value={manualForm.type} 
                                onChange={e => setManualForm({...manualForm, type: e.target.value as any})}
                            >
                                {['Peso Livre', 'Polia', 'Máquina', 'Core'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2">Descrição Curta</label>
                        <input 
                            className={`w-full ${inputBg} border rounded-2xl p-3 text-xs font-bold`} 
                            value={manualForm.description} 
                            onChange={e => setManualForm({...manualForm, description: e.target.value})}
                            placeholder="Foco principal..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-2 flex items-center gap-1"><LinkIcon size={10}/> Link YouTube (URL ou ID)</label>
                        <input 
                            className={`w-full ${inputBg} border rounded-2xl p-3 text-xs font-mono font-bold`} 
                            value={manualForm.videoUrl} 
                            onChange={e => setManualForm({...manualForm, videoUrl: e.target.value})}
                            placeholder="Cole o link aqui..."
                        />
                    </div>
                    
                    {/* Preview do Vídeo no Cadastro Manual */}
                    {manualForm.videoUrl && getYouTubeInfo(manualForm.videoUrl).embedUrl && (
                         <div className="rounded-xl overflow-hidden aspect-video bg-black border border-white/10 mt-2">
                            <iframe 
                                width="100%" height="100%" 
                                src={getYouTubeInfo(manualForm.videoUrl).embedUrl} 
                                title="Preview" frameBorder="0" allowFullScreen
                            ></iframe>
                         </div>
                    )}

                    <button 
                        onClick={handleManualAdd}
                        className="w-full bg-red-900 text-white font-black py-4 rounded-3xl shadow-xl flex items-center justify-center gap-2 italic uppercase mt-2 active:scale-95 transition-all"
                    >
                        <CheckCircle2 size={18} /> Salvar Manualmente
                    </button>
                </div>
            )}
          </div>
        </div>
      )}

      <div className={`${inputBg} p-2 rounded-2xl flex items-center gap-3 px-4 shadow-xl`}>
        <Search size={20} className="text-zinc-600" />
        <input 
          type="text" placeholder="Pesquisar movimento no pergaminho..."
          className={`bg-transparent border-none py-3 text-sm focus:outline-none w-full font-bold ${theme === 'Dia' ? 'text-zinc-900' : 'text-white'}`}
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scroll-hide">
        {['Todos', 'Peito', 'Costas', 'Pernas', 'Braços', 'Ombros', 'Core'].map(cat => (
          <button
            key={cat} onClick={() => setActiveTab(cat as any)}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === cat ? 'bg-red-900 text-white border-red-900' : (theme === 'Noite' ? 'bg-[#1A1A1A] text-zinc-500 border-white/5' : 'bg-white text-zinc-500 border-zinc-200')}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(ex => {
          const { embedUrl, videoId } = getYouTubeInfo(ex.videoUrl);
          const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';
          
          return (
            <div key={ex.id} className={`${bubbleColor} p-5 rounded-3xl transition-all hover:shadow-2xl hover:border-red-900/20`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-900/10 rounded-2xl flex items-center justify-center text-red-900 flex-shrink-0">
                    <Target size={24} />
                  </div>
                  <div>
                    <h4 className={`font-black uppercase italic text-sm leading-tight ${theme === 'Dia' ? 'text-zinc-900' : 'text-white'}`}>{ex.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{ex.type} • {ex.category}</p>
                    {ex.description && <p className="text-[10px] text-zinc-500 italic mt-1 line-clamp-1">{ex.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isLider ? (
                    <button onClick={() => setEditingEx(ex)} className="p-2 text-zinc-500 hover:text-red-900 transition-colors"><Edit3 size={18} /></button>
                  ) : (
                    <button className="p-2 text-zinc-300 cursor-not-allowed"><Lock size={14} /></button>
                  )}
                  <button onClick={() => setPlayingId(playingId === ex.id ? null : ex.id)} className={`p-2 rounded-xl transition-all ${playingId === ex.id ? 'bg-red-900 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-900'}`}>
                    {playingId === ex.id ? <X size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>

              {playingId === ex.id && (
                <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                    {embedUrl ? (
                      <iframe 
                          width="100%" 
                          height="100%" 
                          src={embedUrl} 
                          title={ex.name} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center flex-col text-zinc-500 gap-2">
                         <Youtube size={32} className="opacity-50" />
                         <span className="text-xs font-bold uppercase italic">Vídeo Indisponível (Link Inválido)</span>
                      </div>
                    )}
                  </div>
                  {/* Botão de Fallback Aprimorado para Erro 153 */}
                  {videoId && (
                      <div className="flex justify-center mt-2">
                        <a 
                          href={watchUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full py-3 bg-red-900/10 border border-red-900/30 rounded-xl text-[10px] text-red-700 hover:bg-red-900 hover:text-white flex items-center justify-center gap-2 uppercase font-black tracking-widest transition-all shadow-sm"
                        >
                          <AlertCircle size={14} /> Vídeo falhou? Clique para abrir no YouTube
                        </a>
                      </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p className="text-xs font-bold uppercase italic">Nenhuma técnica encontrada</p>
          </div>
        )}
      </div>

      {editingEx && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md p-6 flex items-center justify-center overflow-y-auto">
          <div className={`${modalBg} w-full max-w-md p-8 rounded-[3rem] border ${theme === 'Noite' ? 'border-red-900/30' : 'border-zinc-200'} shadow-2xl space-y-6 relative`}>
            <div className="flex justify-between items-center">
              <h3 className={`text-xl font-black uppercase italic ${theme === 'Dia' ? 'text-zinc-900' : 'text-white'}`}>Editar Técnica</h3>
              <button onClick={() => setEditingEx(null)} className="p-2 text-zinc-500 hover:text-red-900 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="bg-red-900/10 p-3 rounded-2xl border border-red-900/20 flex items-center gap-2 mb-2">
              <Lock size={14} className="text-red-900" />
              <p className="text-[9px] font-bold text-red-900 uppercase">Edição Restrita ao Mestre</p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Nome</label>
                <input type="text" className={`w-full ${theme === 'Noite' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-zinc-200'} border rounded-2xl p-4 text-sm font-bold`} value={editingEx.name} onChange={e => setEditingEx({...editingEx, name: e.target.value})} />
              </div>
              
              {/* Grupo Muscular e Tipo Lado a Lado */}
              <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Grupo</label>
                    <select className={`w-full ${theme === 'Noite' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-zinc-200'} border rounded-2xl p-4 text-sm font-bold`} value={editingEx.category} onChange={e => setEditingEx({...editingEx, category: e.target.value as any})}>
                    {['Peito', 'Costas', 'Pernas', 'Braços', 'Ombros', 'Core'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Tipo</label>
                    <select className={`w-full ${theme === 'Noite' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-zinc-200'} border rounded-2xl p-4 text-sm font-bold`} value={editingEx.type} onChange={e => setEditingEx({...editingEx, type: e.target.value as any})}>
                    {['Peso Livre', 'Polia', 'Máquina', 'Core'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>

              <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Descrição</label>
                 <input type="text" className={`w-full ${theme === 'Noite' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-zinc-200'} border rounded-2xl p-4 text-sm font-bold`} value={editingEx.description || ''} onChange={e => setEditingEx({...editingEx, description: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Link Embed (YouTube) ou ID</label>
                <input type="text" className={`w-full ${theme === 'Noite' ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-zinc-200'} border rounded-2xl p-4 text-xs font-bold font-mono`} value={editingEx.videoUrl} onChange={e => setEditingEx({...editingEx, videoUrl: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-red-900 text-white font-black py-4 rounded-3xl shadow-xl flex items-center justify-center gap-2 italic uppercase">
                <Save size={18} /> Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleTechniques;
