import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-degrade-azul-medio.png";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Upload,
  Trash2,
  ChevronsUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Search,
  Image as ImageIcon,
  FileText,
  FileSearch,
  UserPlus,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import personaJovemM from "@/assets/personas/persona_1.png";
import personaJovemF from "@/assets/personas/persona_2.jpg";
import personaAdultaF from "@/assets/personas/persona_3.jpg";
import personaIdosoM from "@/assets/personas/persona_4.jpg";

const personas = [
  { id: "p1", name: "Lucas Oliveira", age: 24, gender: "Masculino", image: personaJovemM },
  { id: "p2", name: "Marina Costa", age: 27, gender: "Feminino", image: personaJovemF },
  { id: "p3", name: "Cláudia Ferreira", age: 45, gender: "Feminino", image: personaAdultaF },
  { id: "p4", name: "Seu Antônio Ribeiro", age: 74, gender: "Masculino", image: personaIdosoM },
];

const diagnosisOptions = [
  "Hipertensão arterial sistêmica",
  "Diabetes mellitus tipo 2",
  "Lesão Ligamentar Joelho",
  "Dislipidemia",
  "Infarto agudo do miocárdio",
  "Insuficiência cardíaca",
  "Arritmia cardíaca",
  "Doença arterial coronariana",
  "Acidente vascular cerebral isquêmico",
  "Acidente vascular cerebral hemorrágico",
  "Asma",
  "Doença pulmonar obstrutiva crônica",
  "Pneumonia",
  "Tuberculose",
  "COVID-19",
  "Gastrite",
  "Úlcera péptica",
  "Doença do refluxo gastroesofágico",
  "Síndrome do intestino irritável",
  "Doença de Crohn",
  "Hepatite",
  "Cirrose hepática",
  "Colecistite",
  "Pancreatite",
  "Nefrolitíase",
  "Insuficiência renal crônica",
  "Infecção urinária",
  "Hipertiroidismo",
  "Hipotiroidismo",
  "Anemia ferropriva",
  "Leucemia",
  "Linfoma",
  "Depressão",
  "Ansiedade generalizada",
  "Transtorno bipolar",
  "Enxaqueca",
  "Epilepsia",
  "Malária",
  "Dengue",
  "Zika",
  "Hanseníase",
  "HIV/AIDS",
  "Sífilis",
  "Gonorreia",
  "Herpes zoster",
  "Dermatite atópica",
  "Psoríase",
  "Acne vulgar",
  "Artrite reumatoide",
  "Lúpus eritematoso sistêmico",
  "Osteoartrite",
  "Gota",
  "Fibromialgia",
  "Escoliose",
  "Hérnia de disco",
  "Fratura de fêmur",
  "Câncer de mama",
  "Câncer de colo do útero",
  "Câncer de próstata",
  "Câncer de pulmão",
  "Câncer colorretal",
  "Outro",
];

// Hipóteses diagnósticas incorretas, porém plausíveis para o caso de lesão
// ligamentar medial do joelho — usadas pelo botão de IA de cada input de
// "Hipótese incorreta" para sortear uma alternativa da mesma área clínica.
const hipoteseIncorretaBank: string[] = [
  "Lesão de menisco medial",
  "Ruptura do ligamento cruzado anterior",
  "Condromalácia patelar",
  "Bursite pré-patelar",
  "Tendinite patelar",
];

// Exames sem indicação para investigar uma lesão ligamentar medial do
// joelho — usados pelo botão de IA de cada input de "exame inadequado".
const examesInadequadosBank: string[] = [
  "Endoscopia digestiva alta",
  "Ecocardiograma transtorácico",
  "Espirometria",
  "Ultrassom abdominal total",
  "Eletroencefalograma",
];

type AnamneseQA = { question: string; answers: string[] };

const anamneseBank: Record<string, AnamneseQA[]> = {
  "Queixa principal": [
    {
      question: "Onde exatamente você sente a dor no joelho?",
      answers: [
        "Sinto uma dor forte na parte interna do joelho direito.",
        "A dor fica bem na lateral interna, perto da linha da articulação.",
        "É uma dor do lado de dentro do joelho, perto da coxa.",
      ],
    },
    {
      question: "Há quanto tempo você sente essa dor?",
      answers: [
        "Começou há cerca de três dias, durante um jogo de futebol.",
        "Foi há uma semana, depois de um treino mais pesado.",
        "Começou ontem à noite, logo depois de uma pancada no joelho.",
      ],
    },
    {
      question: "Você sentiu ou ouviu algum estalo no momento da lesão?",
      answers: [
        "Sim, ouvi um estalo na hora em que o joelho torceu para dentro.",
        "Não ouvi nada, só senti uma dor forte de repente.",
        "Acho que sim, mas não tenho certeza, foi tudo muito rápido.",
      ],
    },
    {
      question: "O joelho ficou inchado logo após o ocorrido?",
      answers: [
        "Sim, inchou bastante poucas horas depois da pancada.",
        "Ficou um pouco inchado, mas só no dia seguinte.",
        "Não notei inchaço, só a dor e a dificuldade para mexer.",
      ],
    },
    {
      question: "Você sente instabilidade ou 'falseio' no joelho?",
      answers: [
        "Sim, sinto que o joelho pode ceder quando piso com mais força.",
        "Às vezes sinto uma leve instabilidade ao girar a perna.",
        "Não sinto instabilidade, só dor forte ao movimentar.",
      ],
    },
  ],
  "História da doença atual": [
    {
      question: "O que você estava fazendo no momento em que a dor começou?",
      answers: [
        "Estava jogando futebol quando outro jogador atingiu a lateral do meu joelho.",
        "Estava correndo e mudei de direção bruscamente quando senti a dor.",
        "Estava descendo uma escada quando o joelho torceu para dentro.",
      ],
    },
    {
      question: "Houve algum movimento de torção do joelho durante o trauma?",
      answers: [
        "Sim, meu joelho torceu para dentro enquanto eu mudava de direção.",
        "Sim, o pé ficou fixo no chão e o corpo girou para o lado.",
        "Não tenho certeza, foi tudo muito rápido.",
      ],
    },
    {
      question: "Você fez algum tratamento inicial, como gelo ou compressão?",
      answers: [
        "Coloquei gelo no local e mantive repouso nas primeiras horas.",
        "Enfaixei o joelho e evitei apoiar o peso na perna.",
        "Não fiz nada, só fiquei em repouso esperando melhorar.",
      ],
    },
    {
      question: "Os sintomas melhoraram ou pioraram desde o início?",
      answers: [
        "A dor diminuiu um pouco, mas o inchaço continua.",
        "Piorou quando tentei voltar a caminhar normalmente.",
        "Está praticamente igual desde o primeiro dia.",
      ],
    },
    {
      question: "Você procurou atendimento médico logo após a lesão?",
      answers: [
        "Fui ao pronto-socorro no mesmo dia e fizeram um raio-X.",
        "Não procurei atendimento na hora, vim direto para esta consulta.",
        "Fui a uma unidade de saúde dois dias depois, por causa do inchaço.",
      ],
    },
  ],
  "Antecedentes pessoais e familiares": [
    {
      question: "Você já teve alguma lesão no joelho anteriormente?",
      answers: [
        "Não, essa é a primeira vez que machuco esse joelho.",
        "Já tive uma torção leve há alguns anos, mas nada grave.",
        "Sim, machuquei o mesmo joelho jogando bola há dois anos.",
      ],
    },
    {
      question: "Já precisou fazer alguma cirurgia no joelho ou na perna?",
      answers: [
        "Nunca precisei de cirurgia, só de fisioterapia uma vez.",
        "Sim, operei o menisco do outro joelho há alguns anos.",
        "Não, nunca fiz nenhuma cirurgia.",
      ],
    },
    {
      question: "Alguém da sua família teve lesões ligamentares no joelho?",
      answers: [
        "Meu pai também teve uma lesão no ligamento do joelho jogando bola.",
        "Não que eu saiba, ninguém na família teve isso.",
        "Meu irmão machucou o joelho jogando futebol uma vez.",
      ],
    },
    {
      question: "Você tem alguma doença crônica, como diabetes ou hipertensão?",
      answers: [
        "Não tenho nenhuma doença crônica diagnosticada.",
        "Tenho hipertensão controlada com medicação.",
        "Tenho diabetes tipo 2, diagnosticada há alguns anos.",
      ],
    },
    {
      question: "Você tem alergia a algum medicamento?",
      answers: [
        "Tenho alergia a dipirona.",
        "Não tenho alergia a nenhum medicamento que eu conheça.",
        "Tenho alergia a anti-inflamatórios, causam reação na pele.",
      ],
    },
  ],
  "Hábitos de vida": [
    {
      question: "Com que frequência você pratica atividade física?",
      answers: [
        "Jogo futebol duas a três vezes por semana.",
        "Faço academia quase todos os dias.",
        "Pratico atividade física raramente, só aos finais de semana.",
      ],
    },
    {
      question: "Você faz aquecimento antes de jogar ou treinar?",
      answers: [
        "Geralmente faço um aquecimento rápido antes de jogar.",
        "Quase nunca aqueço antes de começar a atividade.",
        "Sim, sempre faço alongamento e aquecimento antes de treinar.",
      ],
    },
    {
      question: "Usa algum tipo de proteção para o joelho durante o esporte?",
      answers: [
        "Não uso nenhum tipo de joelheira ou proteção.",
        "Uso uma joelheira leve às vezes, mas nem sempre.",
        "Nunca usei proteção para o joelho antes.",
      ],
    },
    {
      question: "Como está sua alimentação no dia a dia?",
      answers: [
        "Minha alimentação é equilibrada, como bem na maioria dos dias.",
        "Como bastante fora de casa, nem sempre é uma alimentação saudável.",
        "Sigo uma dieta bem controlada, com acompanhamento nutricional.",
      ],
    },
    {
      question: "Quantas horas você dorme por noite, em média?",
      answers: [
        "Durmo cerca de seis horas por noite.",
        "Durmo bem, entre sete e oito horas por noite.",
        "Tenho dormido mal desde a lesão, por causa da dor.",
      ],
    },
  ],
};

function pickAnamneseQuestion(category: string): string {
  const entries = anamneseBank[category] ?? [];
  if (entries.length === 0) return "";
  return entries[Math.floor(Math.random() * entries.length)].question;
}

function pickAnamneseAnswer(category: string, question: string): string {
  const entries = anamneseBank[category] ?? [];
  const match = entries.find((e) => e.question.trim() === question.trim());
  const pool = match ? match.answers : entries.flatMap((e) => e.answers);
  if (pool.length === 0) return "";
  return pool[Math.floor(Math.random() * pool.length)];
}

type LibraryItem = {
  id: string;
  title: string;
  category: string;
  kind: "Imagem" | "Documento";
  description: string;
};

type HipoteseCorreta = {
  texto: string;
  examesCorretos: string[];
  examesIncorretos: string[];
};

type HipoteseIncorreta = {
  texto: string;
};

const emptyHipoteseCorreta = (): HipoteseCorreta => ({
  texto: "",
  examesCorretos: [""],
  examesIncorretos: [""],
});

const emptyHipoteseIncorreta = (): HipoteseIncorreta => ({
  texto: "",
});

type MedicamentoItem = {
  nome: string;
  dose: string;
  via: string;
  frequencia: string;
  duracao: string;
  orientacoes: string;
};

type ProcedimentoItem = {
  nome: string;
  descricao: string;
};

type PrescricaoData = {
  medicamentos: MedicamentoItem[];
  procedimentos: ProcedimentoItem[];
  orientacoesGerais: string;
  retorno: string;
  ativarProcedimentos: boolean;
  ativarOrientacoesGerais: boolean;
  ativarRetorno: boolean;
};

const emptyMedicamento = (): MedicamentoItem => ({
  nome: "",
  dose: "",
  via: "",
  frequencia: "",
  duracao: "",
  orientacoes: "",
});

const emptyProcedimento = (): ProcedimentoItem => ({
  nome: "",
  descricao: "",
});

const emptyPrescricao = (): PrescricaoData => ({
  medicamentos: [emptyMedicamento()],
  procedimentos: [],
  orientacoesGerais: "",
  retorno: "",
  ativarProcedimentos: false,
  ativarOrientacoesGerais: false,
  ativarRetorno: false,
});

const viasAdministracao = [
  "Via oral",
  "Intravenosa",
  "Intramuscular",
  "Subcutânea",
  "Sublingual",
  "Tópica",
  "Inalatória",
  "Retal",
];

const distractorMedicamentos: MedicamentoItem[] = [
  {
    nome: "Amoxicilina 500 mg",
    dose: "1 comprimido",
    via: "Via oral",
    frequencia: "a cada 8 horas",
    duracao: "por 7 dias",
    orientacoes: "Administrar após alimentação.",
  },
  {
    nome: "Ibuprofeno 600 mg",
    dose: "1 comprimido",
    via: "Via oral",
    frequencia: "a cada 12 horas",
    duracao: "por 5 dias",
    orientacoes: "Não administrar em jejum.",
  },
  {
    nome: "Prednisona 20 mg",
    dose: "1 comprimido",
    via: "Via oral",
    frequencia: "1x ao dia",
    duracao: "por 10 dias",
    orientacoes: "Reduzir gradualmente ao suspender.",
  },
  {
    nome: "Cetoprofeno 100 mg",
    dose: "1 cápsula",
    via: "Intramuscular",
    frequencia: "a cada 12 horas",
    duracao: "por 5 dias",
    orientacoes: "Aplicar em ambiente hospitalar.",
  },
  {
    nome: "Dexametasona 4 mg",
    dose: "1 ampola",
    via: "Intravenosa",
    frequencia: "a cada 6 horas",
    duracao: "por 3 dias",
    orientacoes: "Monitorar glicemia durante o uso.",
  },
  {
    nome: "Azitromicina 500 mg",
    dose: "1 comprimido",
    via: "Via oral",
    frequencia: "1x ao dia",
    duracao: "por 5 dias",
    orientacoes: "Não ingerir com laticínios.",
  },
];

const distractorProcedimentos: ProcedimentoItem[] = [
  { nome: "Repouso absoluto", descricao: "Por 48 horas, sem justificativa clínica para o quadro." },
  { nome: "Suspensão de atividades físicas", descricao: "Por 30 dias, sem relação com o diagnóstico." },
];

const distractorOrientacoes = [
  "Retornar apenas se houver piora significativa.",
  "Suspender atividades físicas por 30 dias.",
  "Manter dieta livre, sem restrições específicas.",
];

const distractorRetornos = [
  "Retorno em 30 dias",
  "Sem necessidade de retorno",
  "Retorno em 15 dias, se necessário",
];

function generateIncorrectPrescriptions(correta: PrescricaoData, count: number): PrescricaoData[] {
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  const meds = shuffle(distractorMedicamentos);
  const procs = shuffle(distractorProcedimentos);
  const orientacoes = shuffle(distractorOrientacoes);
  const retornos = shuffle(distractorRetornos);
  const medCount = Math.max(correta.medicamentos.length, 1);

  return Array.from({ length: count }, (_, i) => ({
    medicamentos: Array.from(
      { length: medCount },
      (_, j) => meds[(i + j) % meds.length],
    ),
    procedimentos: correta.ativarProcedimentos ? [procs[i % procs.length]] : [],
    orientacoesGerais: orientacoes[i % orientacoes.length],
    retorno: retornos[i % retornos.length],
    ativarProcedimentos: correta.ativarProcedimentos,
    ativarOrientacoesGerais: correta.ativarOrientacoesGerais,
    ativarRetorno: correta.ativarRetorno,
  }));
}

const libraryItems: LibraryItem[] = [
  {
    id: "lib-rx-torax",
    title: "Raio-X de tórax · consolidação em LID",
    category: "Radiologia",
    kind: "Imagem",
    description:
      "Opacidade homogênea em lobo inferior direito, sugestiva de consolidação. Sem derrame pleural visível.",
  },
  {
    id: "lib-tc-cranio",
    title: "Tomografia de crânio · AVC isquêmico",
    category: "Radiologia",
    kind: "Imagem",
    description:
      "Área hipodensa em território da artéria cerebral média esquerda compatível com isquemia recente.",
  },
  {
    id: "lib-us-abdominal",
    title: "Ultrassom abdominal · colelitíase",
    category: "Radiologia",
    kind: "Imagem",
    description:
      "Imagens hiperecogênicas com sombra acústica posterior no interior da vesícula biliar.",
  },
  {
    id: "lib-ecg-supra",
    title: "Eletrocardiograma · supra de ST inferior",
    category: "Cardiovascular",
    kind: "Imagem",
    description:
      "Supradesnivelamento do segmento ST em DII, DIII e aVF sugestivo de IAM de parede inferior.",
  },
  {
    id: "lib-hemograma",
    title: "Hemograma completo · anemia ferropriva",
    category: "Laboratório",
    kind: "Documento",
    description:
      "Hemoglobina reduzida com microcitose e hipocromia, compatível com anemia ferropriva.",
  },
  {
    id: "lib-gasometria",
    title: "Gasometria arterial · acidose metabólica",
    category: "Laboratório",
    kind: "Documento",
    description:
      "pH reduzido com bicarbonato baixo e BE negativo, compatível com acidose metabólica.",
  },
  {
    id: "lib-urina",
    title: "Urina tipo I · infecção urinária",
    category: "Laboratório",
    kind: "Documento",
    description:
      "Leucocitúria, nitrito positivo e bacteriúria compatíveis com infecção do trato urinário.",
  },
  {
    id: "lib-inspecao-facial",
    title: "Inspeção facial · acne grau II",
    category: "Dermatológico",
    kind: "Imagem",
    description:
      "Múltiplas pápulas e pústulas em face, sem cicatrizes evidentes, compatível com acne grau II.",
  },
];

export const Route = createFileRoute("/criar-caso")({
  head: () => ({
    meta: [
      { title: "Criar caso clínico — Paciente 360" },
      {
        name: "description",
        content:
          "Desenvolva cenários clínicos personalizados para apresentar aos alunos ou usar como atividades práticas.",
      },
      { property: "og:title", content: "Criar caso clínico — Paciente 360" },
      {
        property: "og:description",
        content:
          "Crie seu próprio caso clínico com um fluxo guiado passo a passo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CriarCaso,
});

const steps = [
  "Persona",
  "Informações do caso",
  "Anamnese",
  "Exame físico",
  "Diagnóstico e prescrição",
];

function CriarCaso() {
  const [current, setCurrent] = useState(0);
  const [buildStatus, setBuildStatus] = useState<"idle" | "ready">("idle");
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [customPersonaImage, setCustomPersonaImage] = useState<string | null>(null);
  const customPersonaFileRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    caseName: "",
    caseDescription: "",
    caseDiagnosis: "",
    personaName: "",
    personaAge: "",
    personaGender: "",
    personaAppearance: "",
    personaWeight: "",
    anamnese: {
      "Queixa principal": [{ question: "", answerType: "", customAnswer: "" }],
      "História da doença atual": [{ question: "", answerType: "", customAnswer: "" }],
      "Antecedentes pessoais e familiares": [{ question: "", answerType: "", customAnswer: "" }],
      "Hábitos de vida": [{ question: "", answerType: "", customAnswer: "" }],
    } as Record<string, { question: string; answerType: string; customAnswer: string }[]>,
    attachments: [] as {
      id: string;
      title: string;
      kind: "Imagem" | "Documento";
      source: "Biblioteca" | "Upload";
      category?: string;
      description?: string;
      examType?: string;
      examName?: string;
      results?: string;
      wantsVisualMod?: "sim" | "nao" | "";
      visualModDescription?: string;
      groupId?: string;
    }[],
    examGroups: [
      { id: "g-default", name: "Exames gerais" },
    ] as { id: string; name: string }[],
    diagnostico: {
      correta: {
        ...emptyHipoteseCorreta(),
        texto: "Lesão ligamentar medial",
        examesCorretos: ["RM"],
      },
      incorretas: [emptyHipoteseIncorreta()] as HipoteseIncorreta[],
    },
    prescricao: {
      correta: emptyPrescricao(),
      incorretas: [emptyPrescricao()] as PrescricaoData[],
    },
  });

  const update = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm({ ...form, [k]: e.target.value });

  const selectPersona = (id: string) => {
    const persona = personas.find((p) => p.id === id);
    if (!persona) return;
    setSelectedPersonaId(id);
    setForm((prev) => ({
      ...prev,
      personaName: persona.name,
      personaAge: String(persona.age),
      personaGender: persona.gender,
    }));
  };

  const selectCustomPersona = () => {
    customPersonaFileRef.current?.click();
  };

  const handleCustomPersonaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomPersonaImage(typeof reader.result === "string" ? reader.result : null);
      setSelectedPersonaId("custom");
      setForm((prev) => ({
        ...prev,
        personaName: "",
        personaAge: "",
        personaGender: "",
        personaAppearance: "",
        personaWeight: "",
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addQA = (category: string) => {
    setForm((prev) => ({
      ...prev,
      anamnese: {
        ...prev.anamnese,
        [category]: [...prev.anamnese[category], { question: "", answerType: "", customAnswer: "" }],
      },
    }));
  };

  const removeQA = (category: string, index: number) => {
    setForm((prev) => ({
      ...prev,
      anamnese: {
        ...prev.anamnese,
        [category]: prev.anamnese[category].filter((_, i) => i !== index),
      },
    }));
    setGeneratingAnamneseField((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${category}__`)) delete next[key];
      });
      return next;
    });
  };

  const updateQA = (
    category: string,
    index: number,
    field: "question" | "answerType" | "customAnswer",
    value: string,
  ) => {
    setForm((prev) => {
      const items = [...prev.anamnese[category]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, anamnese: { ...prev.anamnese, [category]: items } };
    });
  };

  const [collapsedAnamneseCategories, setCollapsedAnamneseCategories] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(Object.keys(form.anamnese).map((category) => [category, true])),
  );
  const toggleAnamneseCategory = (category: string) => {
    setCollapsedAnamneseCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const [generatingAnamneseField, setGeneratingAnamneseField] = useState<Record<string, boolean>>({});
  const handleGenerateAnamneseField = (
    category: string,
    index: number,
    field: "question" | "customAnswer",
  ) => {
    const key = `${category}__${index}__${field}`;
    setGeneratingAnamneseField((prev) => ({ ...prev, [key]: true }));
    window.setTimeout(() => {
      setForm((prev) => {
        const current = prev.anamnese[category]?.[index];
        if (!current) return prev;
        const suggestion =
          field === "question"
            ? pickAnamneseQuestion(category)
            : pickAnamneseAnswer(category, current.question);
        if (!suggestion) return prev;
        const items = [...prev.anamnese[category]];
        items[index] =
          field === "question"
            ? { ...current, question: suggestion }
            : { ...current, customAnswer: suggestion, answerType: "" };
        return { ...prev, anamnese: { ...prev.anamnese, [category]: items } };
      });
      setGeneratingAnamneseField((prev) => ({ ...prev, [key]: false }));
    }, 600 + Math.random() * 500);
  };

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryPreviewId, setLibraryPreviewId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string>("g-default");

  const addExamGroup = () => {
    const id = `g-${Date.now()}`;
    setForm((prev) => ({
      ...prev,
      examGroups: [
        ...prev.examGroups,
        { id, name: `Novo grupamento ${prev.examGroups.length + 1}` },
      ],
    }));
  };
  const renameExamGroup = (id: string, name: string) => {
    setForm((prev) => ({
      ...prev,
      examGroups: prev.examGroups.map((g) => (g.id === id ? { ...g, name } : g)),
    }));
  };
  const removeExamGroup = (id: string) => {
    setForm((prev) => ({
      ...prev,
      examGroups: prev.examGroups.filter((g) => g.id !== id),
      attachments: prev.attachments.filter((a) => a.groupId !== id),
    }));
  };
  const openUploadFor = (groupId: string) => {
    setActiveGroupId(groupId);
    fileInputRef.current?.click();
  };
  const openLibraryFor = (groupId: string) => {
    setActiveGroupId(groupId);
    setLibraryOpen(true);
  };

  const addAttachment = (a: (typeof form.attachments)[number]) => {
    setForm((prev) =>
      prev.attachments.some((x) => x.id === a.id)
        ? prev
        : { ...prev, attachments: [...prev.attachments, a] },
    );
  };
  const removeAttachment = (id: string) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };
  const updateAttachment = (
    id: string,
    patch: Partial<(typeof form.attachments)[number]>,
  ) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.map((a) =>
        a.id === id ? { ...a, ...patch } : a,
      ),
    }));
  };
  const handleUploadFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      addAttachment({
        id: `upload-${Date.now()}-${file.name}`,
        title: file.name,
        kind: file.type.startsWith("image/") ? "Imagem" : "Documento",
        source: "Upload",
        examType: "",
        examName: file.name.replace(/\.[^.]+$/, ""),
        results: "",
        wantsVisualMod: "",
        visualModDescription: "",
        groupId: activeGroupId,
      });
    });
  };

  const updateHipoteseTexto = (target: "correta" | number, value: string) =>
    setForm((p) => {
      if (target === "correta") {
        return {
          ...p,
          diagnostico: { ...p.diagnostico, correta: { ...p.diagnostico.correta, texto: value } },
        };
      }
      const incorretas = [...p.diagnostico.incorretas];
      incorretas[target] = { ...incorretas[target], texto: value };
      return { ...p, diagnostico: { ...p.diagnostico, incorretas } };
    });

  const addDiagIncorreta = () =>
    setForm((p) => ({
      ...p,
      diagnostico: {
        ...p.diagnostico,
        incorretas: [...p.diagnostico.incorretas, emptyHipoteseIncorreta()],
      },
    }));
  const removeDiagIncorreta = (i: number) =>
    setForm((p) => ({
      ...p,
      diagnostico: {
        ...p.diagnostico,
        incorretas: p.diagnostico.incorretas.filter((_, idx) => idx !== i),
      },
    }));

  const updateCorretaExame = (
    key: "examesCorretos" | "examesIncorretos",
    i: number,
    value: string,
  ) =>
    setForm((p) => {
      const arr = [...p.diagnostico.correta[key]];
      arr[i] = value;
      return {
        ...p,
        diagnostico: { ...p.diagnostico, correta: { ...p.diagnostico.correta, [key]: arr } },
      };
    });
  const addCorretaExame = (key: "examesCorretos" | "examesIncorretos") =>
    setForm((p) => ({
      ...p,
      diagnostico: {
        ...p.diagnostico,
        correta: { ...p.diagnostico.correta, [key]: [...p.diagnostico.correta[key], ""] },
      },
    }));
  const removeCorretaExame = (key: "examesCorretos" | "examesIncorretos", i: number) =>
    setForm((p) => ({
      ...p,
      diagnostico: {
        ...p.diagnostico,
        correta: {
          ...p.diagnostico.correta,
          [key]: p.diagnostico.correta[key].filter((_, idx) => idx !== i),
        },
      },
    }));

  const [generatingHipoteseIncorreta, setGeneratingHipoteseIncorreta] = useState<
    Record<number, boolean>
  >({});
  const handleGenerateHipoteseIncorreta = (index: number) => {
    setGeneratingHipoteseIncorreta((prev) => ({ ...prev, [index]: true }));
    window.setTimeout(() => {
      const suggestion =
        hipoteseIncorretaBank[Math.floor(Math.random() * hipoteseIncorretaBank.length)];
      updateHipoteseTexto(index, suggestion);
      setGeneratingHipoteseIncorreta((prev) => ({ ...prev, [index]: false }));
    }, 600 + Math.random() * 500);
  };

  const [generatingExameInadequado, setGeneratingExameInadequado] = useState<
    Record<number, boolean>
  >({});
  const handleGenerateExameInadequado = (index: number) => {
    setGeneratingExameInadequado((prev) => ({ ...prev, [index]: true }));
    window.setTimeout(() => {
      const suggestion =
        examesInadequadosBank[Math.floor(Math.random() * examesInadequadosBank.length)];
      updateCorretaExame("examesIncorretos", index, suggestion);
      setGeneratingExameInadequado((prev) => ({ ...prev, [index]: false }));
    }, 600 + Math.random() * 500);
  };

  const [presExpanded, setPresExpanded] = useState<Record<string, boolean>>({
    correta: true,
    "0": false,
  });

  const [collapsedHipoteseSection, setCollapsedHipoteseSection] = useState(true);
  const [collapsedPrescricaoSection, setCollapsedPrescricaoSection] = useState(true);

  type PrescricaoSlot = "correta" | number; // number = índice em incorretas
  const getPrescricao = (slot: PrescricaoSlot): PrescricaoData =>
    slot === "correta" ? form.prescricao.correta : form.prescricao.incorretas[slot];

  const setPrescricao = (slot: PrescricaoSlot, next: PrescricaoData) =>
    setForm((p) => {
      if (slot === "correta") {
        return { ...p, prescricao: { ...p.prescricao, correta: next } };
      }
      const arr = [...p.prescricao.incorretas];
      arr[slot] = next;
      return { ...p, prescricao: { ...p.prescricao, incorretas: arr } };
    });

  const updateMed = (
    slot: PrescricaoSlot,
    idx: number,
    key: keyof MedicamentoItem,
    value: string,
  ) => {
    const pres = getPrescricao(slot);
    const meds = pres.medicamentos.map((m, i) => (i === idx ? { ...m, [key]: value } : m));
    setPrescricao(slot, { ...pres, medicamentos: meds });
  };
  const addMed = (slot: PrescricaoSlot) => {
    const pres = getPrescricao(slot);
    setPrescricao(slot, { ...pres, medicamentos: [...pres.medicamentos, emptyMedicamento()] });
  };
  const removeMed = (slot: PrescricaoSlot, idx: number) => {
    const pres = getPrescricao(slot);
    setPrescricao(slot, {
      ...pres,
      medicamentos: pres.medicamentos.filter((_, i) => i !== idx),
    });
  };

  const updateProc = (
    slot: PrescricaoSlot,
    idx: number,
    key: keyof ProcedimentoItem,
    value: string,
  ) => {
    const pres = getPrescricao(slot);
    const procs = pres.procedimentos.map((pr, i) => (i === idx ? { ...pr, [key]: value } : pr));
    setPrescricao(slot, { ...pres, procedimentos: procs });
  };
  const addProc = (slot: PrescricaoSlot) => {
    const pres = getPrescricao(slot);
    setPrescricao(slot, { ...pres, procedimentos: [...pres.procedimentos, emptyProcedimento()] });
  };
  const removeProc = (slot: PrescricaoSlot, idx: number) => {
    const pres = getPrescricao(slot);
    setPrescricao(slot, {
      ...pres,
      procedimentos: pres.procedimentos.filter((_, i) => i !== idx),
    });
  };

  const updatePresField = (
    slot: PrescricaoSlot,
    key: "orientacoesGerais" | "retorno",
    value: string,
  ) => setPrescricao(slot, { ...getPrescricao(slot), [key]: value });

  const togglePresFlag = (
    slot: PrescricaoSlot,
    key: "ativarProcedimentos" | "ativarOrientacoesGerais" | "ativarRetorno",
  ) => {
    const pres = getPrescricao(slot);
    const next = { ...pres, [key]: !pres[key] };
    if (key === "ativarProcedimentos" && !pres.ativarProcedimentos && pres.procedimentos.length === 0) {
      next.procedimentos = [emptyProcedimento()];
    }
    setPrescricao(slot, next);
  };

  const addPrescricaoIncorreta = () =>
    setForm((p) => ({
      ...p,
      prescricao: { ...p.prescricao, incorretas: [...p.prescricao.incorretas, emptyPrescricao()] },
    }));
  const removePrescricaoIncorreta = (i: number) =>
    setForm((p) => ({
      ...p,
      prescricao: {
        ...p.prescricao,
        incorretas: p.prescricao.incorretas.filter((_, idx) => idx !== i),
      },
    }));

  const [generatingWrongIdx, setGeneratingWrongIdx] = useState<number | null>(null);
  const handleGenerateWrongPrescription = (i: number) => {
    setGeneratingWrongIdx(i);
    window.setTimeout(() => {
      setForm((p) => {
        const [generated] = generateIncorrectPrescriptions(p.prescricao.correta, 1);
        const arr = [...p.prescricao.incorretas];
        arr[i] = generated;
        return { ...p, prescricao: { ...p.prescricao, incorretas: arr } };
      });
      setPresExpanded((prev) => ({ ...prev, [String(i)]: true }));
      setGeneratingWrongIdx(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[var(--brand)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div className="h-6 w-px bg-slate-200" />
        <img
          src={logoAsset}
          alt="Paciente 360"
          className="h-9 w-auto object-contain"
        />

        <Link
          to="/executar-caso"
          className="ml-auto inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90"
        >
          <PlayCircle className="h-4 w-4" />
          Executar Caso
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-800">
            Crie seu Próprio Caso Clínico
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
            Desenvolva cenários personalizados com facilidade para apresentar aos
            alunos ou utilizar como atividades práticas.
          </p>
        </div>

        <Stepper current={current} onSelect={setCurrent} />

        <div className="mt-10 bg-white border border-slate-200 rounded-lg shadow-sm p-8">
          {current === 0 && (
            <section className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Selecione um perfil de paciente
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Escolha uma das personas pré-configuradas para o caso clínico.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => selectPersona(persona.id)}
                    className={`group overflow-hidden cursor-pointer rounded-xl border bg-white transition-all hover:shadow-md ${selectedPersonaId === persona.id
                      ? "border-[var(--brand)] ring-1 ring-[var(--brand)] shadow-sm"
                      : "border-slate-200 hover:border-[var(--brand)]"
                      }`}
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-slate-100">
                      <img
                        src={persona.image}
                        alt="Perfil de paciente"
                        loading="lazy"
                        width={512}
                        height={512}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={selectCustomPersona}
                  className={`group overflow-hidden rounded-xl border-2 border-dashed bg-slate-50/50 transition-all hover:bg-white hover:shadow-md ${selectedPersonaId === "custom"
                    ? "border-[var(--brand)] ring-1 ring-[var(--brand)] shadow-sm bg-white"
                    : "border-slate-300 hover:border-[var(--brand)]"
                    }`}
                >
                  {customPersonaImage && selectedPersonaId === "custom" ? (
                    <div className="aspect-[2/3] overflow-hidden bg-slate-100 relative">
                      <img
                        src={customPersonaImage}
                        alt="Persona personalizada"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute bottom-2 left-2 right-2 text-[11px] font-medium text-white bg-black/50 rounded px-2 py-1 text-center backdrop-blur-sm">
                        Trocar imagem
                      </span>
                    </div>
                  ) : (
                    <div className="aspect-[2/3] flex flex-col items-center justify-center gap-3 p-6 text-center">
                      <div className="h-14 w-14 rounded-full bg-[var(--brand)]/10 flex items-center justify-center text-[var(--brand)] group-hover:bg-[var(--brand)]/15 transition-colors">
                        <UserPlus className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Criar persona personalizada
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Faça upload de uma imagem do paciente
                        </p>
                      </div>
                    </div>
                  )}
                </button>
                <input
                  ref={customPersonaFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCustomPersonaFile}
                />
              </div>
            </section>
          )}

          {current === 1 && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">
                  Sobre o caso
                </h2>
                <div className="space-y-4">
                  <Field label="Nome do caso" required>
                    <input
                      type="text"
                      value={form.caseName}
                      onChange={update("caseName")}
                      placeholder="Ex.: Aperto no peito"
                      className="input"
                    />
                  </Field>
                  <Field label="Descritivo do caso" required>
                    <textarea
                      value={form.caseDescription}
                      onChange={update("caseDescription")}
                      rows={4}
                      placeholder="Descreva o contexto e os objetivos do caso clínico"
                      className="input resize-none"
                    />
                  </Field>
                  <Field label="Diagnóstico" required>
                    <DiagnosisCombobox
                      value={form.caseDiagnosis}
                      onChange={(value) =>
                        setForm((prev) => ({ ...prev, caseDiagnosis: value }))
                      }
                      options={diagnosisOptions}
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">
                  Persona selecionada
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Revise e complete as informações sobre a persona do paciente.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nome" required>
                    <input
                      type="text"
                      value={form.personaName}
                      onChange={update("personaName")}
                      placeholder="Ex.: Maria Silva"
                      className="input"
                    />
                  </Field>
                  <Field label="Idade" required>
                    <input
                      type="number"
                      value={form.personaAge}
                      onChange={update("personaAge")}
                      placeholder="Ex.: 45"
                      className="input"
                    />
                  </Field>
                  <Field label="Gênero" required>
                    <select
                      value={form.personaGender}
                      onChange={update("personaGender")}
                      className="input"
                    >
                      <option value="">Selecione</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Outro">Outro</option>
                      <option value="Prefiro não informar">
                        Prefiro não informar
                      </option>
                    </select>
                  </Field>
                  <Field label="Peso (kg)">
                    <input
                      type="number"
                      step="0.1"
                      value={form.personaWeight}
                      onChange={update("personaWeight")}
                      placeholder="Ex.: 70,5 kg"
                      className="input"
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Sinais clínicos">
                      <textarea
                        value={form.personaAppearance}
                        onChange={update("personaAppearance")}
                        rows={3}
                        placeholder="Modificações físicas perceptíveis a olho nu especificamente na região do rosto (mudanças na coloração, assimetrias, inchaços, textura da pele ou expressões características)"
                        className="input resize-none"
                      />
                    </Field>
                  </div>
                </div>
              </section>
            </div>
          )}

          {current === 2 && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Anamnese
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Aqui você pode inserir as informações básicas sobre as
                  perguntas e respostas que o paciente vai dar durante a
                  anamnese.
                </p>
              </div>

              <TooltipProvider delayDuration={200}>
                {Object.entries(form.anamnese).map(([category, items]) => {
                  const collapsed = !!collapsedAnamneseCategories[category];
                  return (
                    <div
                      key={category}
                      className="border border-slate-200 rounded-lg p-5 space-y-4"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAnamneseCategory(category)}
                        className="flex w-full items-center justify-between gap-3 -m-5 p-5 text-left hover:bg-slate-50/60 transition-colors rounded-lg"
                      >
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                          {category}
                        </h3>
                        {collapsed ? (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {!collapsed && (
                        <>
                          <div className="space-y-3">
                            {items.map((item, index) => {
                              const generatingQuestion =
                                !!generatingAnamneseField[`${category}__${index}__question`];
                              const generatingAnswer =
                                !!generatingAnamneseField[`${category}__${index}__customAnswer`];
                              return (
                                <div
                                  key={index}
                                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-start mt-4"
                                >
                                  <Field
                                    label={index === 0 ? "Título da pergunta" : undefined}
                                  >
                                    <div className="relative">
                                      <input
                                        type="text"
                                        value={item.question}
                                        onChange={(e) =>
                                          updateQA(category, index, "question", e.target.value)
                                        }
                                        placeholder="Ex.: Onde fica a dor?"
                                        className="input input-with-icon"
                                      />
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleGenerateAnamneseField(category, index, "question")
                                            }
                                            disabled={generatingQuestion}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-full text-[var(--brand)] hover:bg-sky-50 transition-colors disabled:cursor-wait"
                                          >
                                            <Sparkles
                                              className={cn(
                                                "h-4 w-4",
                                                generatingQuestion && "animate-pulse",
                                              )}
                                            />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          Gerar pergunta com IA
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </Field>
                                  <Field
                                    label={index === 0 ? "Resposta do paciente" : undefined}
                                  >
                                    <div className="relative">
                                      <textarea
                                        value={item.customAnswer}
                                        onChange={(e) => {
                                          updateQA(category, index, "customAnswer", e.target.value);
                                          if (item.answerType) {
                                            updateQA(category, index, "answerType", "");
                                          }
                                        }}
                                        rows={1}
                                        placeholder="Digite a resposta do paciente"
                                        className="input input-with-icon h-11 py-2 resize-y"
                                      />
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleGenerateAnamneseField(category, index, "customAnswer")
                                            }
                                            disabled={generatingAnswer}
                                            className="absolute right-2 top-2.5 inline-flex items-center justify-center h-6 w-6 rounded-full text-[var(--brand)] hover:bg-sky-50 transition-colors disabled:cursor-wait"
                                          >
                                            <Sparkles
                                              className={cn(
                                                "h-4 w-4",
                                                generatingAnswer && "animate-pulse",
                                              )}
                                            />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          Gerar resposta com IA
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                      <span className="text-xs text-slate-400 mr-1">
                                        Respostas rápidas:
                                      </span>
                                      {[
                                        { value: "sim", label: "Sim" },
                                        { value: "nao", label: "Não" },
                                        { value: "nao-me-lembro", label: "Não me lembro..." },
                                      ].map((opt) => {
                                        const active = item.answerType === opt.value;
                                        return (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                              updateQA(category, index, "answerType", opt.value);
                                              updateQA(category, index, "customAnswer", opt.label);
                                            }}
                                            className={`h-7 px-2.5 rounded-full text-xs border transition-colors ${active
                                              ? "border-[var(--brand)] bg-sky-50 text-[var(--brand)]"
                                              : "border-slate-200 text-slate-600 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                              }`}
                                          >
                                            {opt.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </Field>
                                  <div className="flex flex-col">
                                    {index === 0 && (
                                      <span className="block text-sm font-medium mb-1.5 invisible">
                                        Excluir
                                      </span>
                                    )}
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          type="button"
                                          onClick={() => removeQA(category, index)}
                                          disabled={items.length <= 1}
                                          className="inline-flex items-center justify-center h-11 w-11 rounded-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                        >
                                          <Trash2 className="h-5 w-5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">Excluir</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => addQA(category)}
                            className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                            Adicionar pergunta e resposta
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </TooltipProvider>
            </section>
          )}

          {current === 3 && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Exame físico
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Anexe exames do computador ou selecione da biblioteca da
                  plataforma para compor o exame físico do paciente.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  handleUploadFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              <div className="space-y-6">
                <button
                  type="button"
                  onClick={addExamGroup}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Criar grupamento de exames
                </button>

                {form.examGroups.map((group) => {
                  const items = form.attachments.filter(
                    (a) => (a.groupId ?? "g-default") === group.id,
                  );
                  return (
                    <div
                      key={group.id}
                      className="rounded-xl border border-slate-200 bg-white overflow-hidden"
                    >
                      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
                        <input
                          value={group.name}
                          onChange={(e) => renameExamGroup(group.id, e.target.value)}
                          placeholder="Nome do grupamento (ex.: Sinais vitais)"
                          className="flex-1 bg-transparent text-sm font-semibold text-slate-800 focus:outline-none placeholder:font-normal placeholder:text-slate-400"
                        />
                        <span className="text-xs text-slate-500">
                          {items.length} {items.length === 1 ? "exame" : "exames"}
                        </span>
                        {form.examGroups.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExamGroup(group.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:text-red-600"
                            aria-label="Remover grupamento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => openUploadFor(group.id)}
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                            Fazer upload
                          </button>
                          <button
                            type="button"
                            onClick={() => openLibraryFor(group.id)}
                            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            Selecionar da biblioteca
                          </button>
                        </div>

                        {items.length > 0 && (
                          <div className="space-y-4">
                            {items.map((a) => (
                              <div
                                key={a.id}
                                className="rounded-lg border border-slate-200 bg-slate-50/40 p-4 space-y-4"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-[var(--brand)]">
                                    {a.kind === "Imagem" ? (
                                      <ImageIcon className="h-4 w-4" />
                                    ) : (
                                      <FileText className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-slate-800 truncate">
                                      {a.title}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {a.kind} · {a.source}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeAttachment(a.id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:text-red-600"
                                    aria-label="Remover anexo"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                                  <Field label="Nome do exame" required>
                                    <input
                                      type="text"
                                      value={a.examName ?? ""}
                                      onChange={(e) =>
                                        updateAttachment(a.id, { examName: e.target.value })
                                      }
                                      placeholder="Ex.: Raio-X de tórax"
                                      className="input"
                                    />
                                  </Field>
                                </div>

                                <Field label="Resultados e achados encontrados">
                                  <textarea
                                    value={a.results ?? ""}
                                    onChange={(e) =>
                                      updateAttachment(a.id, { results: e.target.value })
                                    }
                                    rows={3}
                                    placeholder="Descreva os principais achados do exame (medidas, alterações, observações do laudo)."
                                    className="input resize-y"
                                  />
                                </Field>

                                <div>
                                  <span className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Deseja modificar algo visualmente neste exame?
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {[
                                      { value: "sim", label: "Sim" },
                                      { value: "nao", label: "Não" },
                                    ].map((opt) => {
                                      const active = a.wantsVisualMod === opt.value;
                                      return (
                                        <button
                                          key={opt.value}
                                          type="button"
                                          onClick={() =>
                                            updateAttachment(a.id, {
                                              wantsVisualMod: opt.value as "sim" | "nao",
                                            })
                                          }
                                          className={`h-9 px-4 rounded-full text-sm border transition-colors ${active
                                            ? "border-[var(--brand)] bg-sky-50 text-[var(--brand)]"
                                            : "border-slate-200 text-slate-600 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                                            }`}
                                        >
                                          {opt.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {a.wantsVisualMod === "sim" && (
                                    <div className="mt-8">
                                      <span className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Descreva o prompt:
                                      </span>
                                      <textarea
                                        value={a.visualModDescription ?? ""}
                                        onChange={(e) =>
                                          updateAttachment(a.id, {
                                            visualModDescription: e.target.value,
                                          })
                                        }
                                        rows={3}
                                        placeholder="Descreva as modificações visuais desejadas. Vídeos serão adaptados às características físicas da persona selecionada."
                                        className="input resize-y"
                                      />
                                      <p className="mt-1.5 text-xs text-slate-500">
                                        Dica: vídeos anexados são automaticamente ajustados
                                        para refletir as características físicas da persona
                                        escolhida no início do caso.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {libraryOpen && (
                <LibraryModal
                  search={librarySearch}
                  setSearch={setLibrarySearch}
                  previewId={libraryPreviewId}
                  setPreviewId={setLibraryPreviewId}
                  attachments={form.attachments}
                  onAdd={(item) =>
                    addAttachment({
                      id: item.id,
                      title: item.title,
                      kind: item.kind,
                      source: "Biblioteca",
                      category: item.category,
                      description: item.description,
                      examType: item.category,
                      examName: item.title,
                      results: "",
                      wantsVisualMod: "",
                      visualModDescription: "",
                      groupId: activeGroupId,
                    })
                  }
                  onClose={() => setLibraryOpen(false)}
                />
              )}
            </section>
          )}

          {current === 4 && (
            <section className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Diagnóstico e prescrição
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Defina a hipótese diagnóstica correta, os exames a serem
                  solicitados e a prescrição esperada. Adicione alternativas
                  incorretas correlacionadas ao caso para desafiar o aluno.
                </p>
              </div>

              {/* Hipótese diagnóstica + exames aninhados */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-5">
                <button
                  type="button"
                  onClick={() => setCollapsedHipoteseSection((prev) => !prev)}
                  className="flex w-full items-center justify-between gap-3 -m-5 p-5 text-left hover:bg-slate-50/60 transition-colors rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Hipótese diagnóstica
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 ">
                      Cada hipótese leva seus próprios exames: ao ser
                      selecionada durante a execução do caso, os exames
                      aparecem logo em seguida.
                    </p>
                  </div>
                  {collapsedHipoteseSection ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {!collapsedHipoteseSection && (
                  <>
                    <TooltipProvider delayDuration={200}>
                      <HipoteseCard
                        title="Hipótese adequada"
                        accent
                        texto={form.diagnostico.correta.texto}
                        placeholder="Ex.: Infarto agudo do miocárdio"
                        onChangeTexto={(v) => updateHipoteseTexto("correta", v)}
                        examesCorretos={{
                          values: form.diagnostico.correta.examesCorretos,
                          onChange: (i, v) => updateCorretaExame("examesCorretos", i, v),
                          onAdd: () => addCorretaExame("examesCorretos"),
                          onRemove: (i) => removeCorretaExame("examesCorretos", i),
                        }}
                        examesIncorretos={{
                          values: form.diagnostico.correta.examesIncorretos,
                          onChange: (i, v) => updateCorretaExame("examesIncorretos", i, v),
                          onAdd: () => addCorretaExame("examesIncorretos"),
                          onRemove: (i) => removeCorretaExame("examesIncorretos", i),
                          onGenerateItem: handleGenerateExameInadequado,
                          generatingIndex: generatingExameInadequado,
                        }}
                      />

                      <div className="space-y-4">
                        {form.diagnostico.incorretas.map((hip, i) => (
                          <HipoteseCard
                            key={i}
                            title={`Hipótese inadequada`}
                            texto={hip.texto}
                            placeholder={`Ex.: Alternativa inadequada ${i + 1}`}
                            onChangeTexto={(v) => updateHipoteseTexto(i, v)}
                            onRemoveHipotese={() => removeDiagIncorreta(i)}
                            removeDisabled={form.diagnostico.incorretas.length <= 1}
                            onGenerateTexto={() => handleGenerateHipoteseIncorreta(i)}
                            generatingTexto={!!generatingHipoteseIncorreta[i]}
                          />
                        ))}
                      </div>
                    </TooltipProvider>

                    <button
                      type="button"
                      onClick={addDiagIncorreta}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar hipótese incorreta
                    </button>
                  </>
                )}
              </div>

              {/* Prescrição */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-6">
                <button
                  type="button"
                  onClick={() => setCollapsedPrescricaoSection((prev) => !prev)}
                  className="flex w-full items-center justify-between gap-3 -m-5 p-5 text-left hover:bg-slate-50/60 transition-colors rounded-lg"
                >
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                      Prescrição
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Defina a prescrição correta e as prescrições incorretas.
                      Você pode gerar cada alternativa incorreta com IA a partir
                      da correta.
                    </p>
                  </div>
                  {collapsedPrescricaoSection ? (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {!collapsedPrescricaoSection && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4 bg-slate-50 border border-slate-100 rounded-md p-4">
                      <div>
                        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Paciente
                        </span>
                        <span className="block text-sm text-slate-800 mt-1">
                          {form.personaName || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Idade
                        </span>
                        <span className="block text-sm text-slate-800 mt-1">
                          {form.personaAge ? `${form.personaAge} anos` : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wide">
                          Peso
                        </span>
                        <span className="block text-sm text-slate-800 mt-1">
                          {form.personaWeight ? `${form.personaWeight} kg` : "—"}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Dados carregados da primeira etapa.
                    </p>

                    <PrescricaoEditor
                      slot="correta"
                      data={form.prescricao.correta}
                      title="Prescrição adequada"
                      badge="Correta"
                      badgeClass="bg-emerald-50 text-emerald-700 border-emerald-200"
                      expanded={presExpanded["correta"] ?? false}
                      onToggleExpanded={() =>
                        setPresExpanded((prev) => ({ ...prev, correta: !prev.correta }))
                      }
                      onUpdateMed={updateMed}
                      onAddMed={addMed}
                      onRemoveMed={removeMed}
                      onUpdateProc={updateProc}
                      onAddProc={addProc}
                      onRemoveProc={removeProc}
                      onUpdateField={updatePresField}
                      onToggleFlag={togglePresFlag}
                    />

                    <div className="space-y-4">
                      {form.prescricao.incorretas.map((pres, i) => (
                        <PrescricaoEditor
                          key={i}
                          slot={i}
                          data={pres}
                          title={`Prescrição inadequada ${i + 1}`}
                          badge="Incorreta"
                          badgeClass="bg-rose-50 text-rose-700 border-rose-200"
                          expanded={presExpanded[String(i)] ?? false}
                          onToggleExpanded={() =>
                            setPresExpanded((prev) => ({ ...prev, [String(i)]: !prev[String(i)] }))
                          }
                          onRemove={
                            form.prescricao.incorretas.length > 1
                              ? () => removePrescricaoIncorreta(i)
                              : undefined
                          }
                          onAutoGenerate={() => handleGenerateWrongPrescription(i)}
                          generating={generatingWrongIdx === i}
                          onUpdateMed={updateMed}
                          onAddMed={addMed}
                          onRemoveMed={removeMed}
                          onUpdateProc={updateProc}
                          onAddProc={addProc}
                          onRemoveProc={removeProc}
                          onUpdateField={updatePresField}
                          onToggleFlag={togglePresFlag}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addPrescricaoIncorreta}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar prescrição incorreta
                    </button>
                  </>
                )}
              </div>
            </section>
          )}

          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="inline-flex items-center gap-2 h-10 px-4 rounded border border-slate-200 text-sm text-slate-600 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <button
              onClick={() =>
                current === steps.length - 1
                  ? setBuildStatus("ready")
                  : setCurrent((c) => Math.min(steps.length - 1, c + 1))
              }
              className="inline-flex items-center gap-2 h-10 px-5 rounded bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90"
            >
              {current === steps.length - 1 ? "Concluir" : "Próximo"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>

      {buildStatus === "ready" && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Caso enviado para análise
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              O caso vai passar por análise e, se aprovado, será montado. Você será notificado por e-mail quando estiver pronto.
            </p>
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="inline-flex items-center h-10 px-5 rounded bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90"
              >
                Ir para o painel
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .input {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border-radius: 6px;
          border: 1px solid rgb(226 232 240);
          background: white;
          font-size: 14px;
          color: rgb(30 41 59);
          outline: none;
          transition: border-color .15s;
        }
        textarea.input { height: auto; padding: 10px 12px; }
        .input:focus { border-color: var(--brand); }
        .input.input-with-icon { padding-right: 40px; }
      `}</style>
    </div>
  );
}

function DiagnosisCombobox({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="input flex items-center justify-between text-left"
        >
          <span className={value ? "text-slate-800" : "text-slate-400"}>
            {value || "Selecione ou digite um diagnóstico"}
          </span>
          <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command
          filter={(value, search) =>
            normalize(value).includes(normalize(search)) ? 1 : 0
          }
        >
          <CommandInput
            placeholder="Buscar diagnóstico..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Nenhum diagnóstico encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <span className="flex-1 truncate">{option}</span>
                  {value === option && (
                    <Check className="h-4 w-4 text-[var(--brand)]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-[var(--brand)]">*</span>}
        </span>
      )}
      {children}
    </label>
  );
}

function ExamListEditor({
  label,
  values,
  placeholder,
  addLabel,
  onChange,
  onAdd,
  onRemove,
  onGenerateItem,
  generatingIndex,
}: {
  label: string;
  values: string[];
  placeholder: string;
  addLabel: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onGenerateItem?: (index: number) => void;
  generatingIndex?: Record<number, boolean>;
}) {
  return (
    <div className="space-y-2.5">
      <span className="block text-xs font-medium text-slate-500">{label}</span>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={placeholder}
              className={cn("input h-10 text-sm", onGenerateItem && "input-with-icon")}
            />
            {onGenerateItem && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onGenerateItem(i)}
                    disabled={!!generatingIndex?.[i]}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-full text-[var(--brand)] hover:bg-sky-50 transition-colors disabled:cursor-wait"
                  >
                    <Sparkles
                      className={cn("h-4 w-4", generatingIndex?.[i] && "animate-pulse")}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Gerar exame com IA</TooltipContent>
              </Tooltip>
            )}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onRemove(i)}
                disabled={values.length <= 1}
                className="inline-flex items-center justify-center h-10 w-10 shrink-0 rounded-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Excluir</TooltipContent>
          </Tooltip>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded border border-[var(--brand)] text-xs font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

type ExamListProps = {
  values: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onGenerateItem?: (index: number) => void;
  generatingIndex?: Record<number, boolean>;
};

function HipoteseCard({
  title,
  texto,
  placeholder,
  accent,
  onChangeTexto,
  onRemoveHipotese,
  removeDisabled,
  onGenerateTexto,
  generatingTexto,
  examesCorretos,
  examesIncorretos,
}: {
  title: string;
  texto: string;
  placeholder: string;
  accent?: boolean;
  onChangeTexto: (value: string) => void;
  onRemoveHipotese?: () => void;
  removeDisabled?: boolean;
  onGenerateTexto?: () => void;
  generatingTexto?: boolean;
  examesCorretos?: ExamListProps;
  examesIncorretos?: ExamListProps;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 space-y-4 mt-2",
        accent ? "border-[var(--brand)]/30 bg-sky-50/40" : "border-slate-200",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Field label={title} required={accent}>
            <div className="relative">
              <input
                type="text"
                value={texto}
                onChange={(e) => onChangeTexto(e.target.value)}
                placeholder={placeholder}
                className={cn("input", onGenerateTexto && "input-with-icon")}
              />
              {onGenerateTexto && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={onGenerateTexto}
                      disabled={generatingTexto}
                      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-full text-[var(--brand)] hover:bg-sky-50 transition-colors disabled:cursor-wait"
                    >
                      <Sparkles className={cn("h-4 w-4", generatingTexto && "animate-pulse")} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Gerar hipótese com IA</TooltipContent>
                </Tooltip>
              )}
            </div>
          </Field>
        </div>
        {onRemoveHipotese && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={onRemoveHipotese}
                disabled={removeDisabled}
                aria-label="Remover hipótese"
                className="mt-7 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Excluir</TooltipContent>
          </Tooltip>
        )}
      </div>

      {(examesCorretos || examesIncorretos) && (
        <div className="pl-4 border-l-2 border-slate-200 space-y-4">
          <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Exames vinculados a esta hipótese
          </span>
          {examesCorretos && (
            <ExamListEditor
              label="Exames adequados"
              placeholder="Ex.: ECG de 12 derivações"
              addLabel="Adicionar exame adequado"
              {...examesCorretos}
            />
          )}
          {examesIncorretos && (
            <ExamListEditor
              label="Exames inadequados"
              placeholder="Ex.: Alternativa não indicada"
              addLabel="Adicionar exame incorreto"
              {...examesIncorretos}
            />
          )}
        </div>
      )}
    </div>
  );
}

type PrescricaoSlotProp = "correta" | number;

function PrescricaoEditor({
  slot,
  data,
  title,
  badge,
  badgeClass,
  expanded,
  onToggleExpanded,
  onRemove,
  onAutoGenerate,
  generating,
  onUpdateMed,
  onAddMed,
  onRemoveMed,
  onUpdateProc,
  onAddProc,
  onRemoveProc,
  onUpdateField,
  onToggleFlag,
}: {
  slot: PrescricaoSlotProp;
  data: PrescricaoData;
  title: string;
  badge: string;
  badgeClass: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onRemove?: () => void;
  onAutoGenerate?: () => void;
  generating?: boolean;
  onUpdateMed: (slot: PrescricaoSlotProp, idx: number, key: keyof MedicamentoItem, value: string) => void;
  onAddMed: (slot: PrescricaoSlotProp) => void;
  onRemoveMed: (slot: PrescricaoSlotProp, idx: number) => void;
  onUpdateProc: (slot: PrescricaoSlotProp, idx: number, key: keyof ProcedimentoItem, value: string) => void;
  onAddProc: (slot: PrescricaoSlotProp) => void;
  onRemoveProc: (slot: PrescricaoSlotProp, idx: number) => void;
  onUpdateField: (slot: PrescricaoSlotProp, key: "orientacoesGerais" | "retorno", value: string) => void;
  onToggleFlag: (
    slot: PrescricaoSlotProp,
    key: "ativarProcedimentos" | "ativarOrientacoesGerais" | "ativarRetorno",
  ) => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <div
        className="flex items-center justify-between gap-3 flex-wrap cursor-pointer -m-4 p-4 hover:bg-slate-50/60 transition-colors"
        onClick={onToggleExpanded}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center h-6 px-2 rounded-full border text-[11px] font-medium ${badgeClass}`}
          >
            {badge}
          </span>
          <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {onAutoGenerate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAutoGenerate();
              }}
              disabled={generating}
              className="inline-flex items-center gap-2 h-8 px-3 rounded border border-[var(--brand)] text-xs font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              <Sparkles className={cn("h-3.5 w-3.5", generating && "animate-pulse")} />
              {generating ? "Gerando com IA..." : "Gerar automaticamente"}
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label="Remover prescrição"
              className="inline-flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <span className="inline-flex items-center justify-center h-8 w-8 rounded text-slate-400">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 space-y-5">
          <div className="space-y-3">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Medicamentos
            </span>
            {data.medicamentos.map((m, i) => (
              <div
                key={i}
                className="rounded-md border border-slate-200 p-3 space-y-3 bg-slate-50/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    Medicamento {i + 1}
                  </span>
                  {data.medicamentos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveMed(slot, i)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Nome do medicamento" required>
                    <input
                      value={m.nome}
                      onChange={(e) => onUpdateMed(slot, i, "nome", e.target.value)}
                      placeholder="Ex.: Dipirona 500 mg"
                      className="input"
                    />
                  </Field>
                  <Field label="Dose">
                    <input
                      value={m.dose}
                      onChange={(e) => onUpdateMed(slot, i, "dose", e.target.value)}
                      placeholder="Ex.: 1 comprimido"
                      className="input"
                    />
                  </Field>
                  <Field label="Via de administração">
                    <select
                      value={m.via}
                      onChange={(e) => onUpdateMed(slot, i, "via", e.target.value)}
                      className="input"
                    >
                      <option value="">Selecione...</option>
                      {viasAdministracao.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Frequência">
                    <input
                      value={m.frequencia}
                      onChange={(e) => onUpdateMed(slot, i, "frequencia", e.target.value)}
                      placeholder="Ex.: a cada 6 horas"
                      className="input"
                    />
                  </Field>
                  <Field label="Duração">
                    <input
                      value={m.duracao}
                      onChange={(e) => onUpdateMed(slot, i, "duracao", e.target.value)}
                      placeholder="Ex.: por 7 dias"
                      className="input"
                    />
                  </Field>
                  <Field label="Orientações específicas">
                    <input
                      value={m.orientacoes}
                      onChange={(e) => onUpdateMed(slot, i, "orientacoes", e.target.value)}
                      placeholder="Ex.: administrar após alimentação"
                      className="input"
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onAddMed(slot)}
              className="inline-flex items-center gap-2 h-9 px-3 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar medicamento
            </button>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50/40 overflow-hidden">
            <label className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Procedimentos / condutas não medicamentosas
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                  opcional
                </span>
              </div>
              <input
                type="checkbox"
                checked={data.ativarProcedimentos}
                onChange={() => onToggleFlag(slot, "ativarProcedimentos")}
                className="h-4 w-4 accent-[var(--brand)] cursor-pointer"
              />
            </label>
            {data.ativarProcedimentos && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                {data.procedimentos.length === 0 && (
                  <p className="text-xs text-slate-400">Nenhum procedimento adicionado.</p>
                )}
                {data.procedimentos.map((p, i) => (
                  <div key={i} className="rounded-md border border-slate-200 p-3 space-y-3 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Procedimento {i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveProc(slot, i)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Nome do procedimento">
                        <input
                          value={p.nome}
                          onChange={(e) => onUpdateProc(slot, i, "nome", e.target.value)}
                          placeholder="Ex.: Curativo com soro fisiológico"
                          className="input"
                        />
                      </Field>
                      <Field label="Descrição / justificativa">
                        <input
                          value={p.descricao}
                          onChange={(e) => onUpdateProc(slot, i, "descricao", e.target.value)}
                          placeholder="Ex.: Realizar a cada 24h"
                          className="input"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => onAddProc(slot)}
                  className="inline-flex items-center gap-2 h-9 px-3 rounded border border-slate-200 text-xs font-medium text-slate-600 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar procedimento
                </button>
              </div>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50/40 overflow-hidden">
            <label className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Orientações gerais ao paciente
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                  opcional
                </span>
              </div>
              <input
                type="checkbox"
                checked={data.ativarOrientacoesGerais}
                onChange={() => onToggleFlag(slot, "ativarOrientacoesGerais")}
                className="h-4 w-4 accent-[var(--brand)] cursor-pointer"
              />
            </label>
            {data.ativarOrientacoesGerais && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                <Field label="Orientações gerais ao paciente">
                  <textarea
                    value={data.orientacoesGerais}
                    onChange={(e) => onUpdateField(slot, "orientacoesGerais", e.target.value)}
                    rows={3}
                    placeholder="Ex.: repouso relativo, hidratação, sinais de alerta..."
                    className="input resize-none"
                  />
                </Field>
              </div>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50/40 overflow-hidden">
            <label className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Retorno / seguimento
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-medium">
                  opcional
                </span>
              </div>
              <input
                type="checkbox"
                checked={data.ativarRetorno}
                onChange={() => onToggleFlag(slot, "ativarRetorno")}
                className="h-4 w-4 accent-[var(--brand)] cursor-pointer"
              />
            </label>
            {data.ativarRetorno && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                <Field label="Retorno / seguimento">
                  <input
                    value={data.retorno}
                    onChange={(e) => onUpdateField(slot, "retorno", e.target.value)}
                    placeholder="Ex.: retorno em 7 dias com exames"
                    className="input"
                  />
                </Field>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex-1 flex items-center">
            <button
              onClick={() => onSelect(i)}
              className="flex flex-col items-center gap-2 flex-1 group"
            >
              <span
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${done
                  ? "bg-[var(--brand)] border-[var(--brand)] text-white"
                  : active
                    ? "bg-white border-[var(--brand)] text-[var(--brand)]"
                    : "bg-white border-slate-300 text-slate-400"
                  }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-xs text-center max-w-[120px] ${active
                  ? "text-[var(--brand)] font-medium"
                  : done
                    ? "text-slate-700"
                    : "text-slate-400"
                  }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-6 ${i < current ? "bg-[var(--brand)]" : "bg-slate-200"
                  }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function LibraryModal({
  search,
  setSearch,
  previewId,
  setPreviewId,
  attachments,
  onAdd,
  onClose,
}: {
  search: string;
  setSearch: (v: string) => void;
  previewId: string | null;
  setPreviewId: (id: string | null) => void;
  attachments: { id: string }[];
  onAdd: (item: LibraryItem) => void;
  onClose: () => void;
}) {
  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    if (!q) return libraryItems;
    return libraryItems.filter((i) =>
      normalize(`${i.title} ${i.category} ${i.description}`).includes(q),
    );
  }, [search]);

  const grouped = useMemo(() => {
    const map = new Map<string, LibraryItem[]>();
    filtered.forEach((i) => {
      const arr = map.get(i.category) ?? [];
      arr.push(i);
      map.set(i.category, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const preview = libraryItems.find((i) => i.id === previewId) ?? null;
  const added = new Set(attachments.map((a) => a.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 flex items-start justify-center p-4 md:p-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Biblioteca de exames e imagens
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Selecione um ou mais itens agrupados por categoria. Clique para
              pré-visualizar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-4 border-b border-slate-100">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, categoria ou descrição..."
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[var(--brand)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-[70vh]">
          <div className="min-h-0 overflow-y-auto p-4 space-y-5 border-r border-slate-100">
            {grouped.length === 0 && (
              <div className="text-sm text-slate-500 py-8 text-center">
                Nenhum item encontrado.
              </div>
            )}
            {grouped.map(([category, items]) => (
              <div key={category} className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {category} · {items.length}
                </div>
                {items.map((item) => {
                  const selected = previewId === item.id;
                  const isAdded = added.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors cursor-pointer ${selected
                        ? "border-[var(--brand)] ring-1 ring-[var(--brand)]"
                        : "border-slate-200 hover:border-slate-300"
                        }`}
                      onClick={() => setPreviewId(item.id)}
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-[var(--brand)]">
                        {item.kind === "Imagem" ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.kind}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewId(item.id);
                        }}
                        className="h-8 w-8 inline-flex items-center justify-center rounded text-slate-400 hover:text-[var(--brand)]"
                        aria-label="Pré-visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd(item);
                        }}
                        disabled={isAdded}
                        className="h-8 w-8 inline-flex items-center justify-center rounded text-slate-400 hover:text-[var(--brand)] disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Adicionar"
                      >
                        {isAdded ? (
                          <Check className="h-4 w-4 text-[var(--brand)]" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="min-h-0 overflow-y-auto bg-slate-50/60 p-6">
            {!preview ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400">
                <FileSearch className="h-8 w-8 mb-2" />
                <p className="text-sm">Selecione um item para pré-visualizar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {preview.kind === "Imagem" ? (
                    <ImageIcon className="h-4 w-4 text-[var(--brand)]" />
                  ) : (
                    <FileText className="h-4 w-4 text-[var(--brand)]" />
                  )}
                  <span>
                    {preview.category} · {preview.kind}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-slate-800">
                  {preview.title}
                </h4>
                <div className="aspect-video rounded-lg border border-dashed border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400">
                  {preview.kind === "Imagem" ? (
                    <ImageIcon className="h-8 w-8 mb-2" />
                  ) : (
                    <FileText className="h-8 w-8 mb-2" />
                  )}
                  <p className="text-sm">
                    Pré-visualização{" "}
                    {preview.kind === "Imagem" ? "da imagem" : "do documento"}
                  </p>
                </div>
                <div className="rounded-lg bg-white border border-slate-200 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Descrição
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {preview.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(preview)}
                  disabled={added.has(preview.id)}
                  className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[var(--brand)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {added.has(preview.id) ? (
                    <>
                      <Check className="h-4 w-4" />
                      Adicionado à tarefa
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Adicionar à tarefa
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}