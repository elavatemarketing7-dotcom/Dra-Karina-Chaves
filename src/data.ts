/**
 * Data file for Dra Karina Chaves - Landing Page
 * This file contains images, video links, quiz questions, and contact info.
 * You can easily add more links or change text here.
 */

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

export const EXPERT_INFO = {
  name: "Dra Karina Chaves",
  profession: "Harmonização Facial",
  location: "São Paulo, Brasil",
  instagram: "https://www.instagram.com/drakarinachaves/reels/",
  whatsapp: "https://wa.me/5511976008888", // Realistic SP WhatsApp link (Dra Karina Chaves)
  phoneNumber: "11976008888", // For WhatsApp message formatting
  images: {
    hero: "https://i.imgur.com/4yUNRUL.png", // Main expert photo
    about: "https://i.imgur.com/FAmqDZR.png", // Expert authority / background photo
  },
  videoUrl: "https://i.imgur.com/vdDUYUk.mp4", // Imgur MP4 direct link
  videoFallback: "https://imgur.com/vdDUYUk"
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual é o seu principal objetivo ao buscar a Harmonização Facial?",
    options: [
      "Suavizar linhas de expressão e rugas",
      "Definir o contorno facial (mandíbula, queixo, maçãs)",
      "Dar volume e contorno aos lábios (Preenchimento Labial)",
      "Tratar olheiras e dar um aspecto mais descansado",
      "Melhorar a harmonia e simetria geral do rosto"
    ]
  },
  {
    id: 2,
    question: "O que você considera mais importante no resultado final?",
    options: [
      "Naturalidade absoluta (realçar sem parecer artificial)",
      "Mudança marcante e alta definição dos traços",
      "Recuperar a jovialidade que sinto que perdi com o tempo",
      "Apenas correções sutis de assimetrias"
    ]
  },
  {
    id: 3,
    question: "Você já realizou algum procedimento estético injetável antes?",
    options: [
      "Sim, realizo procedimentos frequentemente",
      "Já fiz uma ou duas vezes no passado",
      "Nunca fiz nada, esta será minha primeira vez"
    ]
  },
  {
    id: 4,
    question: "Qual o seu nível de urgência para iniciar a sua transformação?",
    options: [
      "Gostaria de agendar para os próximos dias",
      "Estou planejando para as próximas semanas",
      "Estou apenas pesquisando e tirando dúvidas"
    ]
  }
];

// GALERIA DE RESULTADOS (ANTES E DEPOIS)
// Adicione novos links de imagens de antes e depois neste array
export const BEFORE_AFTER_GALLERY = [
  {
    id: 1,
    title: "Definição e Preenchimento",
    url: "https://i.imgur.com/s4eyNKX.png",
  },
  {
    id: 2,
    title: "Harmonia e Naturalidade",
    url: "https://i.imgur.com/JoR3Ds1.png",
  },
  {
    id: 3,
    title: "Preenchimento Labial",
    url: "https://i.imgur.com/7l0L1tO.png",
  },
  {
    id: 4,
    title: "Contorno de Mandíbula",
    url: "https://i.imgur.com/BUoDkBz.png",
  },
  {
    id: 5,
    title: "Rejuvenescimento Facial",
    url: "https://i.imgur.com/5Kp8qkf.png",
  },
  // Você pode adicionar imagens adicionais como:
  // { id: 6, title: "Novo Resultado", url: "https://i.imgur.com/..." }
];

// GALERIA HARMONIZAÇÃO DE CORAÇÃO (💙)
// Adicione novos links de imagens da galeria de coração neste array
export const HEART_GALLERY = [
  {
    id: 1,
    title: "Momento Especial 1",
    url: "https://i.imgur.com/BNX36JK.png",
  },
  {
    id: 2,
    title: "Momento Especial 2",
    url: "https://i.imgur.com/OdYVVGn.png",
  },
  {
    id: 3,
    title: "Momento Especial 3",
    url: "https://i.imgur.com/VrF7Pb8.png",
  },
  {
    id: 4,
    title: "Momento Especial 4",
    url: "https://i.imgur.com/rscxrwH.png",
  },
  // Pronta para adicionar novos links futuramente:
  // { id: 5, title: "Novo Momento", url: "https://i.imgur.com/..." }
];

export const TRUST_DIFFERENTIALS = [
  {
    id: 1,
    title: "Avaliação Altamente Customizada",
    description: "Cada rosto possui proporções e dinâmicas únicas. Não utilizo receitas prontas; planejo os procedimentos respeitando a sua estrutura óssea e muscular natural.",
    icon: "Sparkles"
  },
  {
    id: 2,
    title: "Naturalidade em Primeiro Lugar",
    description: "Meu foco absoluto é realçar sua beleza natural, devolvendo volume e sustentação sem exageros ou fisionomias artificiais. Segurança é inegociável.",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    title: "Atendimento Exclusivo Comigo",
    description: "Você não será atendida por auxiliares. Do planejamento à aplicação e acompanhamento pós-procedimento, tudo é feito 100% diretamente por mim.",
    icon: "UserCheck"
  },
  {
    id: 4,
    title: "Técnicas Modernas e Seguras",
    description: "Utilizo apenas preenchedores e toxinas de marcas globais renomadas, com técnicas refinadas de alta precisão anatômica para garantir conforto e resultados duradouros.",
    icon: "Award"
  }
];

export const CONSULTATION_STEPS = [
  {
    step: "01",
    title: "Primeiro Contato via WhatsApp",
    description: "Você iniciará sua conversa e nossa equipe agendará seu horário. É um contato simples, rápido e totalmente sem compromisso."
  },
  {
    step: "02",
    title: "Mapeamento Facial Completo",
    description: "Na consulta presencial, analisamos sua queixa principal, fazemos fotos profissionais e projetamos os pontos de sustentação ideais para você."
  },
  {
    step: "03",
    title: "Procedimento e Pós-Acompanhamento",
    description: "Aplicação com técnicas de alto conforto e plano anestésico completo. Depois, você recebe acompanhamento direto para garantir total segurança e satisfação."
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Mariana S.",
    age: "34 anos",
    text: "O que mais me impressionou na Dra Karina foi a honestidade. Ela me explicou que eu precisava de muito menos do que eu achava que precisava. O resultado ficou tão natural que as pessoas dizem que estou descansada e jovem, sem saber o que eu fiz!",
    procedure: "Preenchimento Labial e Botox"
  },
  {
    id: 2,
    name: "Beatriz M.",
    age: "42 anos",
    text: "Tinha pavor de ficar com o rosto artificial. A Dra Karina tirou todas as minhas dúvidas e me passou uma segurança absurda. Fiz preenchimento de olheiras e contorno. Ficou simplesmente perfeito, minha autoestima foi lá pra cima!",
    procedure: "Preenchimento de Olheiras e Mandíbula"
  },
  {
    id: 3,
    name: "Gabriela F.",
    age: "29 anos",
    text: "Melhor profissional de São Paulo! O atendimento dela é exclusivo e ela acompanha a gente no pós-procedimento com muito carinho. Super recomendo a consulta e o método dela.",
    procedure: "Rinomodelação e Lábios"
  }
];
