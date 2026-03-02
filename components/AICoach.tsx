
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { getAIAdvice } from '../services/geminiService';
import { Send, Shield, User, Loader2, Brain, Camera } from 'lucide-react';
import { SAGE_AVATAR as DEFAULT_SAGE_AVATAR } from '../constants';

interface AICoachProps {
  user: UserProfile;
  theme: 'Dia' | 'Noite';
  sageAvatar?: string;
  onUpdateSageAvatar?: (newUrl: string) => void;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const AICoach: React.FC<AICoachProps> = ({ user, theme, sageAvatar, onUpdateSageAvatar }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: `Saudações, honrado Membro do Clã. Sou o Sábio do Dojo. O caminho da força exige sabedoria sobre o treino, a dieta e a mente. O que buscas hoje em sua jornada?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Usa o avatar passado via prop ou o default
  const currentSageAvatar = sageAvatar || DEFAULT_SAGE_AVATAR;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    const aiResponse = await getAIAdvice(userMsg, user);
    setMessages(prev => [...prev, { role: 'bot', content: aiResponse }]);
    setIsLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onUpdateSageAvatar) {
            onUpdateSageAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const bubbleBot = theme === 'Noite' ? 'bg-[#1A1A1A] border-white/10' : 'bg-white shadow-sm border-zinc-100';
  const bubbleUser = 'bg-red-900/10 border-red-900/20';
  const textColor = theme === 'Noite' ? 'text-zinc-200' : 'text-zinc-800';
  const containerBg = theme === 'Noite' ? 'bg-[#1A1A1A]' : 'bg-white shadow-lg';

  const renderSageAvatar = () => {
    if (imageError) {
      return <Shield size={24} className="text-red-900" />;
    }
    return (
      <img 
        src={currentSageAvatar} 
        alt="Sábio" 
        className="w-full h-full object-cover" 
        onError={() => setImageError(true)}
      />
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-190px)] animate-in fade-in duration-500">
      <div className={`${containerBg} p-5 rounded-3xl border ${theme === 'Noite' ? 'border-white/5' : 'border-zinc-200'} mb-4 flex justify-between items-center`}>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-14 h-14 rounded-2xl shadow-lg shadow-red-900/20 overflow-hidden border-2 border-red-900/50 flex items-center justify-center bg-zinc-900">
                {renderSageAvatar()}
            </div>
            
            {/* Botão de Troca de Imagem (Apenas para o Mestre) */}
            {user.isLider && (
                <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                    <Camera size={20} className="text-white" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            )}
          </div>
          <div>
            <h4 className={`font-black uppercase italic text-sm tracking-tight ${theme === 'Dia' ? 'text-zinc-900' : 'text-white'}`}>Sábio do Clã</h4>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest italic">Guia Samurai IA</p>
          </div>
        </div>
        <Brain size={20} className="text-red-900 opacity-50" />
      </div>

      <div className="flex-grow overflow-y-auto space-y-5 p-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-red-900 border-red-800'}`}>
                {msg.role === 'user' ? (
                   user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover" alt="User" /> : <User size={18} className="text-white" />
                ) : (
                   renderSageAvatar()
                )}
              </div>
              <div className={`p-5 rounded-3xl text-[13px] leading-relaxed font-medium border ${msg.role === 'user' ? bubbleUser : bubbleBot} ${textColor}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-red-800 flex-shrink-0 flex items-center justify-center bg-red-900">
                  {renderSageAvatar()}
              </div>
              <div className={`${bubbleBot} p-5 rounded-3xl border`}><Loader2 size={20} className="animate-spin text-red-900" /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`mt-4 flex gap-3 ${containerBg} p-2 rounded-3xl border ${theme === 'Noite' ? 'border-white/5' : 'border-zinc-200'}`}>
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pergunte ao Sábio..."
          className={`flex-grow bg-transparent border-none px-4 py-3 text-sm focus:outline-none font-bold ${textColor}`}
        />
        <button onClick={handleSend} disabled={isLoading} className="bg-red-900 hover:bg-red-950 text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AICoach;
