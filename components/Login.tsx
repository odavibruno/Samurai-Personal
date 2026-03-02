
import React, { useState } from 'react';
import { Loader2, AlertCircle, Shield } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>; // Agora retorna uma Promise<boolean> para saber se deu certo
  theme: 'Dia' | 'Noite';
  customLogo?: string;
}

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

const Login: React.FC<LoginProps> = ({ onLogin, theme, customLogo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRestoreButton, setShowRestoreButton] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowRestoreButton(false);

    // Simulação de delay de rede samurai para dar peso à ação
    setTimeout(async () => {
      try {
        const success = await onLogin(email, password);
        
        if (!success) {
           // This might not be reached if onLogin throws, but kept for logic safety
           setError('Acesso negado. Verifique suas credenciais.');
           setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Login error:", err);
        let msg = 'Erro ao conectar com o Dojo.';
        
        const code = err.code;
        if (code === 'auth/invalid-credential') {
            msg = 'Credenciais inválidas. O portão do Dojo permanece fechado.';
        } else if (code === 'auth/user-not-found') {
            msg = 'Usuário não encontrado. Você não pertence a este Dojo.';
            if (email.toLowerCase().trim() === 'w.samurai.fitness@gmail.com') {
                setShowRestoreButton(true);
            }
        } else if (code === 'auth/wrong-password') {
            msg = 'Senha incorreta. Concentre-se e tente novamente.';
        } else if (code === 'auth/too-many-requests') {
            msg = 'Muitas tentativas. Medite um pouco e tente novamente mais tarde.';
        } else if (code === 'auth/user-disabled') {
            msg = 'Este guerreiro foi banido do Dojo.';
        } else if (code === 'auth/network-request-failed') {
            msg = 'Falha na conexão espiritual (Internet).';
        } else if (code === 'auth/invalid-email') {
            msg = 'O formato do e-mail é inválido.';
        }
        
        // Debug code for unknown errors
        if (msg === 'Erro ao conectar com o Dojo.') {
            msg += ` (Código: ${code || 'Desconhecido'})`;
        }
        
        setError(msg);
        setIsLoading(false);
      }
    }, 800);
  };

  const isMasterEmail = email.toLowerCase().trim() === 'w.samurai.fitness@gmail.com';

  const bgColor = theme === 'Noite' ? 'bg-zinc-950' : 'bg-zinc-100';
  const inputBg = theme === 'Noite' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200';
  const textColor = theme === 'Noite' ? 'text-white' : 'text-zinc-900';
  const labelColor = theme === 'Noite' ? 'text-zinc-500' : 'text-zinc-500';

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${bgColor} relative overflow-hidden transition-colors duration-500`}>
      {/* Elemento Decorativo de Fundo */}
      <div className={`absolute top-[-20%] right-[-10%] w-[35rem] h-[35rem] ${theme === 'Noite' ? 'bg-red-900/5' : 'bg-red-500/5'} blur-[150px] rounded-full`}></div>
      <div className={`absolute bottom-[-10%] left-[-10%] w-[25rem] h-[25rem] ${theme === 'Noite' ? 'bg-zinc-800/10' : 'bg-zinc-300/20'} blur-[100px] rounded-full`}></div>
      
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-12">
          {/* Logo container */}
          <div className="w-44 h-44 mx-auto mb-6 relative group flex items-center justify-center">
            {customLogo ? (
               <img 
                 src={customLogo} 
                 alt="Samurai Fit Logo" 
                 className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(153,27,27,0.3)] rounded-xl"
               />
            ) : (
               /* Quadrado Vermelho (Estilo Selo Oriental) */
               <div className="w-32 h-32 bg-red-800 rounded-xl shadow-[0_0_30px_rgba(185,28,28,0.4)] border-4 border-red-900 transform rotate-45 group-hover:rotate-0 transition-all duration-700 flex items-center justify-center relative overflow-hidden">
                  {/* Detalhe interno sutil */}
                  <div className="absolute inset-2 border border-red-700/50 rounded-lg"></div>
                  <span className="text-white text-5xl font-black opacity-20 select-none font-oriental -rotate-45 group-hover:rotate-0 transition-all duration-700">侍</span>
               </div>
            )}
          </div>
          
          <h1 className={`text-7xl ${textColor} font-oriental text-red-700 drop-shadow-md leading-tight`}>
            Samurai Fit
          </h1>
          <p className={`${labelColor} text-[10px] font-black uppercase tracking-[0.5em] mt-3 italic`}>O Caminho da Maestria</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/10 border border-red-900/20 p-5 rounded-3xl flex items-center gap-3 text-red-700 text-xs font-bold animate-in slide-in-from-top-4">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${labelColor} ml-2 italic`}>Guerreiro (E-mail)</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className={`w-full ${inputBg} border rounded-3xl px-6 py-5 ${textColor} focus:outline-none focus:border-red-700 transition-all font-bold placeholder:text-zinc-500 shadow-sm`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${labelColor} ml-2 italic`}>Código de Honra</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className={`w-full ${inputBg} border rounded-3xl px-6 py-5 ${textColor} focus:outline-none focus:border-red-700 transition-all font-bold placeholder:text-zinc-500 shadow-sm`}
            />
          </div>

          <div className="flex items-center gap-3 px-2">
            <button 
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-red-700 border-red-700 shadow-[0_0_10px_rgba(185,28,28,0.3)]' : `border-zinc-300 dark:border-zinc-700 ${theme === 'Noite' ? 'bg-zinc-900' : 'bg-white'}`}`}
            >
              {rememberMe && <div className="w-2 h-2 bg-white rounded-sm" />}
            </button>
            <span className={`text-[10px] font-black uppercase ${labelColor} tracking-widest cursor-pointer hover:text-red-700 transition-colors`} onClick={() => setRememberMe(!rememberMe)}>Lembrar de mim</span>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full bg-red-800 hover:bg-red-900 disabled:bg-zinc-400 text-white font-black py-5 rounded-3xl shadow-xl shadow-red-900/20 transition-all flex items-center justify-center gap-3 uppercase italic tracking-widest active:scale-95"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <>Entrar no Dojo <Shield size={20} /></>}
          </button>
        </form>

        <p className={`mt-12 text-center ${labelColor} text-[10px] font-black uppercase tracking-[0.3em] italic`}>
          Desenvolvido por Warlley Samurai • MESTRE DO CLÃ
        </p>

        {/* Botão de Emergência para Restaurar Mestre (Apenas visível se email for do mestre) */}
        {(isMasterEmail || showRestoreButton) && (
            <button 
                type="button"
                onClick={async () => {
                    if(!window.confirm("Deseja recriar o acesso do Mestre no Auth?")) return;
                    setIsLoading(true);
                    try {
                        // Tenta criar com a senha digitada ou a padrão
                        const passToUse = password || 'samuraifitness';
                        console.log("Tentando criar usuário mestre com senha:", passToUse);
                        
                        await createUserWithEmailAndPassword(auth, 'w.samurai.fitness@gmail.com', passToUse);
                        alert("Acesso Mestre Restaurado! Tente entrar agora.");
                        setError('');
                        setShowRestoreButton(false);
                    } catch (e: any) {
                        console.error("Erro ao restaurar:", e);
                        if (e.code === 'auth/email-already-in-use') {
                            alert("O usuário já existe. O erro de login pode ser senha incorreta. Tente 'samuraifitness' ou sua senha habitual.");
                        } else {
                            alert(`Erro ao restaurar: ${e.code} - ${e.message}`);
                        }
                    } finally {
                        setIsLoading(false);
                    }
                }}
                className="mt-6 w-full text-[9px] font-black uppercase tracking-widest text-red-900/40 hover:text-red-900 cursor-pointer text-center transition-colors"
            >
                [ Restaurar Acesso Mestre ]
            </button>
        )}
      </div>
    </div>
  );
};

export default Login;
