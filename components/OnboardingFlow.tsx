
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PRIVACY_POLICY } from '../constants';
import { ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  user: UserProfile;
  onComplete: (newPassword: string) => void;
  theme: 'Dia' | 'Noite';
}

type Step = 'TERMS' | 'PASSWORD';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete, theme }) => {
  // Se já aceitou termos, pula para senha. Caso contrário, começa nos termos.
  const [step, setStep] = useState<Step>(user.hasAcceptedTerms ? 'PASSWORD' : 'TERMS');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleAcceptTerms = () => {
    setStep('PASSWORD');
  };

  const handlePasswordSubmit = () => {
    setError('');
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Os códigos não coincidem.');
      return;
    }
    onComplete(password);
  };

  const bgColor = theme === 'Noite' ? 'bg-zinc-950' : 'bg-zinc-100';
  const cardBg = theme === 'Noite' ? 'bg-[#121212]' : 'bg-white';
  const textColor = theme === 'Noite' ? 'text-white' : 'text-zinc-900';
  const inputBg = theme === 'Noite' ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-zinc-200';

  return (
    <div className={`fixed inset-0 z-[200] ${bgColor} flex items-center justify-center p-6`}>
      <div className={`${cardBg} w-full max-w-lg p-8 rounded-[3rem] shadow-2xl border border-red-900/30 flex flex-col items-center text-center animate-in zoom-in-95 duration-500`}>
        
        {step === 'TERMS' && (
          <div className="w-full flex flex-col h-full">
            <div className="mb-6 flex justify-center">
               <div className="w-16 h-16 rounded-2xl bg-red-900/10 flex items-center justify-center text-red-900">
                  <ShieldCheck size={32} />
               </div>
            </div>
            <h2 className={`text-2xl font-black uppercase italic ${textColor} mb-2`}>Código de Honra</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Termos de Uso e Privacidade</p>
            
            <div className={`flex-grow bg-black/20 rounded-2xl p-4 text-left overflow-y-auto h-64 mb-6 border border-white/5 custom-scrollbar`}>
               <p className={`text-xs font-medium leading-relaxed whitespace-pre-line ${theme === 'Noite' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {PRIVACY_POLICY}
               </p>
            </div>

            <button 
              onClick={handleAcceptTerms}
              className="w-full bg-red-900 text-white font-black py-5 rounded-3xl shadow-xl uppercase italic tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-800"
            >
              Li e Aceito as Regras <CheckCircle2 size={18} />
            </button>
          </div>
        )}

        {step === 'PASSWORD' && (
          <div className="w-full flex flex-col">
             <div className="mb-6 flex justify-center">
               <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <Lock size={32} />
               </div>
            </div>
            <h2 className={`text-2xl font-black uppercase italic ${textColor} mb-2`}>Proteja seu Dojo</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-8">Defina seu novo código de acesso pessoal</p>

            <div className="space-y-4 mb-8 w-full text-left">
                {error && (
                    <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-2xl text-red-500 text-xs font-bold text-center">
                        {error}
                    </div>
                )}
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Novo Código</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full ${inputBg} p-4 rounded-2xl text-sm font-bold ${textColor} focus:outline-none focus:border-red-900 transition-colors`}
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-500 ml-2">Repita o Código</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full ${inputBg} p-4 rounded-2xl text-sm font-bold ${textColor} focus:outline-none focus:border-red-900 transition-colors`}
                        placeholder="Confirme a senha"
                    />
                </div>
            </div>

            <button 
              onClick={handlePasswordSubmit}
              disabled={!password || !confirmPassword}
              className="w-full bg-red-900 text-white font-black py-5 rounded-3xl shadow-xl uppercase italic tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar e Entrar <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default OnboardingFlow;
