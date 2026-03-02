
import React, { useState } from 'react';
import { Scroll, Save, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface QuestionnaireModalProps {
  onClose: () => void;
  onSave: (answers: { question: string; answer: string }[]) => void;
  theme: 'Dia' | 'Noite';
}

const QUESTIONS = [
  "Por que você decidiu começar (ou continuar) a treinar neste momento da sua vida?",
  "O que mudar no seu corpo e na sua saúde representaria uma transformação real para você?",
  "Como você se imagina física e mentalmente daqui a 6 meses se mantiver consistência total nos treinos?",
  "Qual é o maior obstáculo que normalmente faz você desistir ou perder o foco?",
  "O que mais te motiva: melhorar sua autoestima, sua saúde, sua aparência ou provar algo para si mesmo? Explique brevemente.",
  "Quando você pensa em desistir, o que você gostaria de lembrar para continuar firme?",
  "Quem são as pessoas que mais se beneficiariam ao ver você mais saudável, forte e disciplinado?",
  "Em uma escala de 0 a 10, qual é hoje o seu nível real de comprometimento com sua transformação? O que falta para chegar ao 10?",
  "Qual hábito diário você está disposto(a) a mudar imediatamente para acelerar seus resultados?",
  "Escreva uma frase de compromisso pessoal com você mesmo(a) sobre sua jornada de treino e saúde."
];

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({ onClose, onSave, theme }) => {
  const [answers, setAnswers] = useState<string[]>(new Array(QUESTIONS.length).fill(''));
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswerChange = (text: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = text;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalizar
      const formattedAnswers = QUESTIONS.map((q, i) => ({
        question: q,
        answer: answers[i]
      }));
      onSave(formattedAnswers);
    }
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  
  const modalBg = theme === 'Noite' ? 'bg-[#121212]' : 'bg-white';
  const inputBg = theme === 'Noite' ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-zinc-200';
  const textColor = theme === 'Noite' ? 'text-white' : 'text-zinc-900';

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in zoom-in-95">
      <div className={`${modalBg} w-full max-w-2xl min-h-[60vh] rounded-[3rem] border border-red-900/30 shadow-2xl flex flex-col relative overflow-hidden`}>
        
        {/* Barra de Progresso */}
        <div className="absolute top-0 left-0 w-full h-2 bg-zinc-800">
            <div className="h-full bg-red-900 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-red-900 z-10"><X size={28} /></button>

        <div className="flex-grow flex flex-col justify-center p-8 md:p-12">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-900/10 text-red-900 rounded-2xl"><Scroll size={24} /></div>
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Pergunta {currentStep + 1} de {QUESTIONS.length}</span>
                </div>
                <h3 className={`text-2xl md:text-3xl font-black italic uppercase leading-tight ${textColor}`}>
                    {QUESTIONS[currentStep]}
                </h3>
            </div>

            <textarea 
                autoFocus
                className={`w-full h-40 ${inputBg} border rounded-3xl p-6 text-lg font-medium resize-none focus:outline-none focus:border-red-900 transition-all ${textColor}`}
                placeholder="Escreva sua resposta com sinceridade..."
                value={answers[currentStep]}
                onChange={(e) => handleAnswerChange(e.target.value)}
            />
        </div>

        <div className="p-8 border-t border-white/5 flex justify-between items-center bg-black/5">
            <div className="flex gap-2">
                {QUESTIONS.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? 'bg-red-900 scale-125' : (i < currentStep ? 'bg-zinc-600' : 'bg-zinc-800')}`}></div>
                ))}
            </div>

            <button 
                onClick={handleNext}
                disabled={!answers[currentStep].trim()}
                className="px-8 py-4 bg-red-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
                {currentStep === QUESTIONS.length - 1 ? (
                    <>Finalizar e Salvar <Save size={18} /></>
                ) : (
                    <>Próxima <ChevronRight size={18} /></>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};

export default QuestionnaireModal;
