import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-degrade-azul-medio.png.asset.json";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Upload,
  Trash2,
  ChevronsUpDown,
  Eye,
  X,
  Search,
  Image as ImageIcon,
  FileText,
  FileSearch,
  UserPlus,
  PlayCircle,
} from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

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

type LibraryItem = {
  id: string;
  title: string;
  category: string;
  kind: "Imagem" | "Documento";
  description: string;
};

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
  "Diagnóstico e conduta",
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
    }[],
    diagnostico: {
      correta: "",
      incorretas: ["", ""] as string[],
    },
    examesSolicitados: {
      corretos: [""] as string[],
      incorretos: [""] as string[],
    },
    conduta: {
      correta: "",
      incorretas: [""] as string[],
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

  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryPreviewId, setLibraryPreviewId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      });
    });
  };

  const updateDiagnostico = (field: "correta", value: string) =>
    setForm((p) => ({ ...p, diagnostico: { ...p.diagnostico, [field]: value } }));
  const updateDiagIncorreta = (i: number, value: string) =>
    setForm((p) => {
      const arr = [...p.diagnostico.incorretas];
      arr[i] = value;
      return { ...p, diagnostico: { ...p.diagnostico, incorretas: arr } };
    });
  const addDiagIncorreta = () =>
    setForm((p) => ({
      ...p,
      diagnostico: { ...p.diagnostico, incorretas: [...p.diagnostico.incorretas, ""] },
    }));
  const removeDiagIncorreta = (i: number) =>
    setForm((p) => ({
      ...p,
      diagnostico: {
        ...p.diagnostico,
        incorretas: p.diagnostico.incorretas.filter((_, idx) => idx !== i),
      },
    }));

  const updateExameList = (
    key: "corretos" | "incorretos",
    i: number,
    value: string,
  ) =>
    setForm((p) => {
      const arr = [...p.examesSolicitados[key]];
      arr[i] = value;
      return { ...p, examesSolicitados: { ...p.examesSolicitados, [key]: arr } };
    });
  const addExameList = (key: "corretos" | "incorretos") =>
    setForm((p) => ({
      ...p,
      examesSolicitados: {
        ...p.examesSolicitados,
        [key]: [...p.examesSolicitados[key], ""],
      },
    }));
  const removeExameList = (key: "corretos" | "incorretos", i: number) =>
    setForm((p) => ({
      ...p,
      examesSolicitados: {
        ...p.examesSolicitados,
        [key]: p.examesSolicitados[key].filter((_, idx) => idx !== i),
      },
    }));

  const updateCondutaCorreta = (value: string) =>
    setForm((p) => ({ ...p, conduta: { ...p.conduta, correta: value } }));
  const updateCondutaIncorreta = (i: number, value: string) =>
    setForm((p) => {
      const arr = [...p.conduta.incorretas];
      arr[i] = value;
      return { ...p, conduta: { ...p.conduta, incorretas: arr } };
    });
  const addCondutaIncorreta = () =>
    setForm((p) => ({
      ...p,
      conduta: { ...p.conduta, incorretas: [...p.conduta.incorretas, ""] },
    }));
  const removeCondutaIncorreta = (i: number) =>
    setForm((p) => ({
      ...p,
      conduta: {
        ...p.conduta,
        incorretas: p.conduta.incorretas.filter((_, idx) => idx !== i),
      },
    }));

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
          src={logoAsset.url}
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
                    className={`group overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md ${
                      selectedPersonaId === persona.id
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
                  className={`group overflow-hidden rounded-xl border-2 border-dashed bg-slate-50/50 transition-all hover:bg-white hover:shadow-md ${
                    selectedPersonaId === "custom"
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
                      <option value="Não-binário">Não-binário</option>
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

              {Object.entries(form.anamnese).map(([category, items]) => (
                <div
                  key={category}
                  className="border border-slate-200 rounded-lg p-5 space-y-4"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    {category}
                  </h3>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
                      >
                        <Field
                          label={index === 0 ? "Título da pergunta" : undefined}
                        >
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) =>
                              updateQA(category, index, "question", e.target.value)
                            }
                            placeholder="Ex.: Onde fica a dor?"
                            className="input"
                          />
                        </Field>
                        <Field
                          label={index === 0 ? "Resposta do paciente" : undefined}
                        >
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
                            className="input h-11 py-2 resize-y"
                          />
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
                                  className={`h-7 px-2.5 rounded-full text-xs border transition-colors ${
                                    active
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
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addQA(category)}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar pergunta e resposta
                  </button>
                </div>
              ))}
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

              <div className="border-2 border-dashed border-slate-200 bg-slate-50/60 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Fazer upload do computador
                  </button>
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
                  <button
                    type="button"
                    onClick={() => setLibraryOpen(true)}
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Selecionar da biblioteca
                  </button>
                </div>

                {form.attachments.length > 0 && (
                  <div className="space-y-4">
                    {form.attachments.map((a) => (
                      <div
                        key={a.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 space-y-4"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Field label="Tipo de exame" required>
                            <select
                              value={a.examType ?? ""}
                              onChange={(e) =>
                                updateAttachment(a.id, { examType: e.target.value })
                              }
                              className="input"
                            >
                              <option value="">Selecione o tipo</option>
                              <option value="Radiologia">Radiologia</option>
                              <option value="Cardiovascular">Cardiovascular</option>
                              <option value="Laboratório">Laboratório</option>
                              <option value="Ultrassonografia">Ultrassonografia</option>
                              <option value="Dermatológico">Dermatológico</option>
                              <option value="Vídeo">Vídeo</option>
                              <option value="Outro">Outro</option>
                            </select>
                          </Field>
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
                                  className={`h-9 px-4 rounded-full text-sm border transition-colors ${
                                    active
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
                            <div className="mt-3">
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
                  Diagnóstico e conduta
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Defina a hipótese diagnóstica correta, os exames a serem
                  solicitados e a conduta esperada. Adicione alternativas
                  incorretas correlacionadas ao caso para desafiar o aluno.
                </p>
              </div>

              {/* Hipótese diagnóstica */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Hipótese diagnóstica
                </h3>
                <Field label="Hipótese correta" required>
                  <input
                    type="text"
                    value={form.diagnostico.correta}
                    onChange={(e) => updateDiagnostico("correta", e.target.value)}
                    placeholder="Ex.: Infarto agudo do miocárdio"
                    className="input"
                  />
                </Field>

                <div className="space-y-3">
                  <span className="block text-sm font-medium text-slate-700">
                    Hipóteses incorretas
                  </span>
                  {form.diagnostico.incorretas.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) => updateDiagIncorreta(i, e.target.value)}
                        placeholder={`Ex.: Alternativa incorreta ${i + 1}`}
                        className="input"
                      />
                      {form.diagnostico.incorretas.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeDiagIncorreta(i)}
                          className="inline-flex items-center justify-center h-11 w-11 rounded border border-slate-200 text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addDiagIncorreta}
                  className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar hipótese incorreta
                </button>
              </div>

              {/* Solicitação de exames */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Solicitação de exames
                </h3>

                <div className="space-y-3">
                  <span className="block text-sm font-medium text-slate-700">
                    Exames corretos
                  </span>
                  {form.examesSolicitados.corretos.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) =>
                          updateExameList("corretos", i, e.target.value)
                        }
                        placeholder="Ex.: ECG de 12 derivações"
                        className="input"
                      />
                      {form.examesSolicitados.corretos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExameList("corretos", i)}
                          className="inline-flex items-center justify-center h-11 w-11 rounded border border-slate-200 text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addExameList("corretos")}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar exame correto
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="block text-sm font-medium text-slate-700">
                    Exames incorretos
                  </span>
                  {form.examesSolicitados.incorretos.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={v}
                        onChange={(e) =>
                          updateExameList("incorretos", i, e.target.value)
                        }
                        placeholder="Ex.: Alternativa não indicada"
                        className="input"
                      />
                      {form.examesSolicitados.incorretos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExameList("incorretos", i)}
                          className="inline-flex items-center justify-center h-11 w-11 rounded border border-slate-200 text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addExameList("incorretos")}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar exame incorreto
                  </button>
                </div>
              </div>

              {/* Conduta */}
              <div className="border border-slate-200 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                  Conduta
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 border border-slate-100 rounded-md p-4">
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
                      Gênero
                    </span>
                    <span className="block text-sm text-slate-800 mt-1 capitalize">
                      {form.personaGender || "—"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 -mt-2">
                  Dados carregados da primeira etapa.
                </p>

                <Field label="Prescrição correta" required>
                  <textarea
                    value={form.conduta.correta}
                    onChange={(e) => updateCondutaCorreta(e.target.value)}
                    rows={5}
                    placeholder="Descreva a conduta e a prescrição correta para o caso"
                    className="input resize-none"
                  />
                </Field>

                <div className="space-y-3">
                  <span className="block text-sm font-medium text-slate-700">
                    Condutas incorretas
                  </span>
                  {form.conduta.incorretas.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        value={v}
                        onChange={(e) =>
                          updateCondutaIncorreta(i, e.target.value)
                        }
                        rows={2}
                        placeholder={`Ex.: Alternativa incorreta ${i + 1}`}
                        className="input resize-none"
                      />
                      {form.conduta.incorretas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCondutaIncorreta(i)}
                          className="inline-flex items-center justify-center h-11 w-11 rounded border border-slate-200 text-slate-500 hover:text-red-600 self-start"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCondutaIncorreta}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded border border-[var(--brand)] text-sm font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar conduta incorreta
                  </button>
                </div>
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
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  done
                    ? "bg-[var(--brand)] border-[var(--brand)] text-white"
                    : active
                      ? "bg-white border-[var(--brand)] text-[var(--brand)]"
                      : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-xs text-center max-w-[120px] ${
                  active
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
                className={`h-0.5 flex-1 mx-2 -mt-6 ${
                  i < current ? "bg-[var(--brand)]" : "bg-slate-200"
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
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors cursor-pointer ${
                        selected
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