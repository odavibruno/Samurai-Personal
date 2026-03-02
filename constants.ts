
import { UserProfile } from './types';

export const PRIVACY_POLICY = `Política de Privacidade e Termos de Uso do Dojo Warllley Samurai

1. Proteção de Dados do Guerreiro
Todas as informações estratégicas (peso, medidas, fotos) são armazenadas com criptografia de honra. Somente o Mestre e o discípulo possuem acesso.

2. Uso da Inteligência Ancestral
Os dados são processados por algoritmos para gerar estratégias de batalha (treinos e dietas). Nenhuma informação é vendida a mercadores externos.

3. Código de Conduta
O uso do aplicativo exige respeito e disciplina. O Mestre reserva-se o direito de banir membros que desonrem o Clã.

4. Responsabilidade
A prática de exercícios físicos requer aprovação médica. O Dojo fornece as ferramentas, mas a integridade física é responsabilidade do guerreiro.

5. Contato
Para questões sobre seus dados, envie um pergaminho digital para w.samurai.fitness@gmail.com.`;

export const JAPANESE_QUOTES = [
  "Nana korobi ya oki (Cair sete vezes, levantar oito).",
  "A disciplina cedo ou tarde vencerá a inteligência.",
  "Não tenhas medo de ir devagar, tenhas medo de ficar parado.",
  "O bambu que se curva é mais forte que o carvalho que resiste.",
  "A espada só é polida com o atrito da pedra.",
  "Conheça a si mesmo e vencerá todas as batalhas.",
  "O guerreiro de sucesso é um homem comum com foco de laser.",
  "A dor é a fraqueza saindo do corpo.",
  "Hoje melhor que ontem, amanhã melhor que hoje (Kaizen)."
];

export const SAGE_AVATAR = "https://img.freepik.com/premium-photo/portrait-old-samurai-general-armor_1028938-143394.jpg";

export const INITIAL_USER_DATA: UserProfile = {
  id: 'guest',
  name: "Novo Guerreiro",
  birthDate: "",
  gender: "Masculino",
  email: "",
  password: "",
  goal: "Definir Objetivo",
  level: "Gokenin (Iniciante)",
  weight: 70,
  height: 170,
  waterIntake: 2.5,
  date: new Date().toISOString().split('T')[0],
  goals: [
    { id: '1', title: 'Peso de Guerra', target: 75, current: 70, unit: 'kg', icon: 'Scale' },
    { id: '2', title: 'Frequência no Dojo', target: 5, current: 0, unit: 'dias/sem', icon: 'Flame' }
  ],
  workouts: [],
  statsHistory: [],
  dailyMeals: [],
  messages: [
    { id: '1', senderName: 'Mestre Samurai', title: 'Bem-vindo ao Clã', content: 'Sua jornada começa agora. Explore as técnicas, registre seus treinos e mantenha a disciplina.', date: 'Hoje', isRead: false }
  ],
  trainingLogs: [],
  financial: {
    status: 'Em dia',
    plan: 'Mensal',
    dueDate: new Date().toISOString().split('T')[0],
    lastPayment: new Date().toISOString().split('T')[0],
    value: 0,
    history: []
  },
  schedule: [] // Nova propriedade inicializada
};
