export interface QuoteType {
  texto: string;
  autor: string;
}

export const quotes: QuoteType[] = [
  { texto: "Ser multitarefa é o teu superpoder, mas saber quando parar é a tua maior inteligência.", autor: "Equilíbrio Real" },
  { texto: "Cuidar de ti não é um luxo, é a manutenção necessária para cuidares de tudo o resto.", autor: "Autocuidado" },
  { texto: "Estudar, trabalhar e cuidar dos teus: estás a construir um legado de coragem, um dia de cada vez.", autor: "Força Feminina" },
  { texto: "O sucesso não é ser perfeita em tudo, é seres fiel às tuas prioridades.", autor: "Foco OrBee" },
  { texto: "Não esperes ter tempo para ti. Reserva esse tempo como a reunião mais importante do teu dia.", autor: "Prioridade" },
  { texto: "O teu maior projeto de gestão é a tua própria vida. Trata-a com a excelência que aplicas no código.", autor: "Dev Life" },
  { texto: "Educar e programar o futuro exigem a mesma dose de paciência, amor e lógica.", autor: "Mães na Tech" },
  { texto: "O equilíbrio não é algo que encontras, é algo que crias com as tuas escolhas diárias.", autor: "Jana Kingsford" },
  { texto: "És o pilar da tua casa, mas até os pilares precisam de descanso para não cederem.", autor: "Resiliência" },
  { texto: "A tua carreira e os teus estudos são capítulos, mas tu és a autora da história completa.", autor: "Protagonista" },
  { texto: "Não te compares com quem tem menos pratos a rodar que tu. O teu malabarismo é único.", autor: "Empatia" },
  { texto: "Um passo de cada vez, um commit de cada vez, uma tarefa de cada vez. Tu consegues.", autor: "Persistência" },
  { texto: "O teu bem-estar é o Wi-Fi da tua casa: se estiver em baixo, nada funciona direito.", autor: "Analogia Tech" },
  { texto: "Ser mãe, estudante e profissional é o 'Full Stack' mais complexo e recompensador que existe.", autor: "OrBee Inspira" },
  { texto: "Aproveita o silêncio do teu café matinal; ele é o 'reset' que a tua mente precisa.", autor: "Mindfulness" },
  { texto: "As tuas conquistas profissionais são grandes, mas a mulher que te tornaste para as alcançar é maior.", autor: "Evolução" },
  { texto: "Substitui a culpa pela consciência de que estás a dar o teu melhor em cada papel.", autor: "Paz de Espírito" },
  { texto: "A disciplina nos estudos hoje é a liberdade nas tuas escolhas amanhã.", autor: "Visão de Futuro" },
  { texto: "Organizar a casa é cuidar do ambiente; organizar a mente é cuidar da alma.", autor: "Ordem Interna" },
  { texto: "Nunca peças desculpa por seres uma mulher ambiciosa e dedicada à tua família.", autor: "Poder Feminino" },
  { texto: "O teu cansaço é real, mas a tua capacidade de renovação é infinita.", autor: "Renovação" },
  { texto: "Que a tua produtividade nunca seja medida pelo quanto te desgastaste, mas pelo quanto realizaste com saúde.", autor: "Produtividade Real" },
  { texto: "Ter sonhos próprios enquanto cuidas dos sonhos dos outros é um ato de bravura.", autor: "Identidade" },
  { texto: "A tecnologia facilita processos, mas o teu instinto é o que realmente resolve problemas.", autor: "Instinto" },
  { texto: "Diz 'não' ao que te drena para poderes dizer 'sim' ao que te ilumina.", autor: "Limites" },
  { texto: "A tua casa reflete o teu cuidado, mas os teus projetos refletem o teu intelecto. Honra ambos.", autor: "Equilíbrio" },
  { texto: "Não precisas de fazer tudo hoje. O descanso também faz parte do plano de trabalho.", autor: "Descanso" },
  { texto: "Tu és a prova viva de que a suavidade e a força podem habitar o mesmo lugar.", autor: "Essência" },
  { texto: "Cada linha de código e cada lição ensinada aos teus filhos são sementes de um futuro melhor.", autor: "Propósito" },
  { texto: "Celebra as pequenas vitórias: o bug resolvido, o jantar a horas, o livro lido. Tudo conta.", autor: "Gratidão" }
];

export function getDailyQuote(): QuoteType {
  const hoje = new Date();
  const diaDoMes = hoje.getDate(); 

  return quotes[(diaDoMes - 1) % quotes.length];
}
