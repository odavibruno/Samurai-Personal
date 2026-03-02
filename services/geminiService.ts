
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Student, Exercise } from "../types";

// Always use the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAdvice = async (prompt: string, userContext: UserProfile) => {
  try {
    // Use gemini-3-pro-preview for tasks requiring high-quality reasoning and coaching.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é um Mentor Samurai do Clã Warllley Samurai. Você é especialista em Musculação, Dieta, Descanso, Performance e Saúde Integral.
        O perfil do Membro do Clã é: Nome: ${userContext.name}, Objetivo: ${userContext.goal}, Nível de Batalha: ${userContext.level}.
        
        Suas funções principais:
        1. Responder qualquer dúvida sobre treinamento (técnicas, intensidade, volume).
        2. Orientar sobre nutrição esportiva e hidratação.
        3. Ensinar sobre a importância do descanso e sono.
        4. ENSINAR O MEMBRO A USAR O APLICATIVO:
           - Aba Dojo (Início): Resumo de evolução, frases motivacionais e METAS.
           - Aba Técnicas: Biblioteca de movimentos e execução.
           - Aba Guerra: Protocolos de treino atuais.
           - Aba Saúde: Diário biométrico e evolução.
           - Menu Pergaminho (Sidebar): Perfil, Falar com o Mestre e Configurações.
        
        Use uma linguagem motivadora, ancestral e técnica, inspirada na filosofia samurai. Seja direto e encorajador. Trate o usuário sempre como Membro do Clã.`,
        temperature: 0.7,
      }
    });
    // The .text property directly returns the generated string.
    return response.text || "Ocorreu uma falha na conexão espiritual. Tente novamente.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a sabedoria do Coach AI.";
  }
};

export const generateWorkoutPlan = async (
  student: Student, 
  availableExercises: Partial<Exercise>[],
  config: { mesocycles: number, split: string }
) => {
  try {
    const prompt = `
      Crie um plano de treino de musculação completo e detalhado.
      
      PERFIL DO ALUNO:
      - Nome: ${student.name}
      - Nível: ${student.level}
      - Idade: ${new Date().getFullYear() - new Date(student.birthDate).getFullYear()} anos
      - Peso: ${student.weight}kg
      - Objetivo: ${student.goal}
      
      CONFIGURAÇÃO DO TREINO:
      - Divisão: ${config.split} (Ex: ABC significa 3 treinos diferentes).
      - Periodização: Foco no Mesociclo ${config.mesocycles} (1=Adaptação/Resistência, 2=Hipertrofia/Força, 3=Definição/Metabólico).
      
      REGRAS OBRIGATÓRIAS:
      1. Use APENAS exercícios que sejam similares ou iguais a esta lista disponível (mas adapte se necessário para atingir o objetivo): 
         ${availableExercises.map(e => e.name).join(', ')}.
      2. Retorne APENAS um JSON válido. Não inclua markdown, aspas triplas ou explicações extras.
      3. O JSON deve ser um array de objetos "Workout".
      
      ESTRUTURA DO JSON ESPERADA:
      [
        {
          "title": "Treino A - Peito e Tríceps",
          "description": "Foco em cargas altas e descanso longo.",
          "exercises": [
            {
              "name": "Supino Reto",
              "sets": 4,
              "reps": "8-10",
              "weight": 0,
              "rest": "90s",
              "category": "Peito",
              "type": "Peso Livre"
            }
          ]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, // Mais preciso para seguir instruções técnicas
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro ao gerar treino:", error);
    return [];
  }
};

export const generateWorkoutFromText = async (
  textInput: string,
  availableExercises: Partial<Exercise>[],
  scope: 'SINGLE' | 'MULTI' | 'MESO' | 'MACRO' = 'SINGLE'
) => {
  try {
    let scopeInstruction = "";
    switch (scope) {
        case 'SINGLE':
            scopeInstruction = "Gere APENAS 1 treino (Workout) baseado no texto. Se o texto mencionar vários dias, condense ou pegue o primeiro.";
            break;
        case 'MULTI':
            scopeInstruction = "Gere MÚLTIPLOS treinos (Array de Workouts) separando corretamente conforme a divisão sugerida no texto (Ex: A, B, C).";
            break;
        case 'MESO':
            scopeInstruction = "Gere uma estrutura de MESOCICLO (4-8 semanas). Crie os treinos base, mas na descrição de cada treino, inclua instruções de progressão de carga e volume para o mesociclo.";
            break;
        case 'MACRO':
            scopeInstruction = "Gere uma PERIODIZAÇÃO COMPLETA. Crie treinos distintos para diferentes fases (Base, Força, Hipertrofia/Pico) sugeridas ou implícitas no texto. Use os títulos para indicar a fase.";
            break;
    }

    const prompt = `
      Transforme as anotações brutas do Mestre em um treino estruturado JSON.
      
      ANOTAÇÕES DO MESTRE:
      "${textInput}"
      
      ESCOPO DA CRIAÇÃO: ${scopeInstruction}
      
      LISTA DE EXERCÍCIOS DISPONÍVEIS NO SISTEMA:
      ${availableExercises.map(e => e.name).join(', ')}
      
      REGRAS:
      1. Identifique os exercícios, séries e repetições no texto do mestre.
      2. Se o exercício existir na lista disponível, use o nome exato.
      3. Se o exercício NÃO existir na lista, use o nome que o mestre escreveu (o sistema irá cadastrá-lo depois).
      4. Organize em um ou mais treinos (Workout) conforme a lógica do texto e o ESCOPO definido.
      5. Extraia sets e reps. Se não especificar peso ou descanso, use 0 e "60s".
      
      SAÍDA ESPERADA (JSON Array):
      [
        {
          "title": "Treino A",
          "description": "Prescrição do Mestre...",
          "exercises": [ ... ]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Baixa temperatura para fidelidade ao texto original
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Erro ao interpretar ideias do mestre:", error);
    return [];
  }
}

export const findExerciseDetails = async (exerciseName: string) => {
  try {
    const prompt = `
      Forneça detalhes técnicos para o exercício de musculação: "${exerciseName}".
      
      REQUISITO DE VÍDEO:
      - O videoId DEVE ser de um vídeo CURTO (YouTube Shorts ou demonstração rápida de < 1 minuto).
      - Deve ser direto ao ponto, mostrando a execução correta.
      
      Retorne um JSON estrito com:
      - name: Nome corrigido e padronizado do exercício (em Português, letras maiúsculas iniciais).
      - category: Apenas um destes: 'Peito', 'Costas', 'Pernas', 'Braços', 'Ombros', 'Core'.
      - type: Apenas um destes: 'Peso Livre', 'Polia', 'Máquina', 'Core'.
      - description: Uma frase curta (máx 10 palavras), técnica, minúscula (exceto início), sobre o foco muscular principal.
      - videoId: Um ID válido de vídeo do YouTube (APENAS O ID). 
      
      Exemplo de JSON:
      {
        "name": "Supino Inclinado com Halteres",
        "category": "Peito",
        "type": "Peso Livre",
        "description": "foco na porção superior do peitoral e deltoide",
        "videoId": "8iPEnn-ltC8"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro ao buscar exercício com IA:", error);
    return null;
  }
};

export const analyzeStudentProfile = async (answers: {question: string, answer: string}[], studentName: string) => {
  try {
    const qaText = answers.map(a => `P: ${a.question}\nR: ${a.answer}`).join('\n\n');
    
    const prompt = `
      Você é um especialista em Psicologia do Esporte e Treinamento de Alta Performance.
      Analise as respostas do seguinte questionário de anamnese ("Questionário de Honra") respondido pelo aluno ${studentName}.
      
      RESPOSTAS DO ALUNO:
      ${qaText}
      
      SUA TAREFA:
      Crie um RESUMO ESTRATÉGICO para o Personal Trainer (Mestre) contendo:
      1. Perfil Psicológico: O que motiva esse aluno? Medos? Nível de disciplina?
      2. Pontos de Atenção: Barreiras mencionadas que podem causar desistência.
      3. Recomendação de Abordagem: Como o mestre deve cobrar/falar com esse aluno (ex: ser duro, ser parceiro, focar em dados, focar em estética)?
      4. Sugestão de Foco no Treino: Baseado nos objetivos de transformação citados.
      
      IMPORTANTE:
      - Seja direto, técnico e útil para o treinador.
      - Escreva em tópicos (Markdown).
      - Mantenha um tom profissional e analítico.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.6,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao analisar perfil do aluno:", error);
    return "Não foi possível gerar a análise automática neste momento.";
  }
};
