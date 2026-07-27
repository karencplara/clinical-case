import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  LogOut,
  MessageCircleQuestion,
  MessageSquareReply,
  Stethoscope,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import loopVideo from "@/assets/videos/videos-caso-clinico/00-loop.mp4";
import olaDoutorVideo from "@/assets/videos/videos-caso-clinico/01-ola_doutor.mp4";
import foiJogandoFutebolVideo from "@/assets/videos/videos-caso-clinico/02-foi_jogando_futebol.mp4";
import faz2DiasVideo from "@/assets/videos/videos-caso-clinico/03-faz_2_dias.mp4";
import estaInchadoVideo from "@/assets/videos/videos-caso-clinico/04-esta_inchado.mp4";
import exameFisicoVideo from "@/assets/videos/exame-fisico.mp4";
import simVideo from "@/assets/videos/videos-caso-clinico/sim.mp4";
import naoVideo from "@/assets/videos/videos-caso-clinico/nao.mp4";
import naoTenhoVideo from "@/assets/videos/videos-caso-clinico/nao_tenho.mp4";
import naoTenhoCertezaVideo from "@/assets/videos/videos-caso-clinico/nao_tenho_certeza.mp4";

export const Route = createFileRoute("/executar-caso")({
  head: () => ({
    meta: [
      { title: "Executar caso clínico — Paciente 360" },
      {
        name: "description",
        content: "Execute o caso clínico e conduza o atendimento do paciente.",
      },
      { property: "og:title", content: "Executar caso clínico — Paciente 360" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExecutarCaso,
});

type PanelKey = "anamnese" | "exame" | "conduta" | "respostas";

const hipoteses = [
  {
    id: "lca",
    label: "Lesão do ligamento cruzado anterior (LCA)",
    correct: false,
    message:
      "A probabilidade pré-teste da lesão do LCA já era baixa devido a negatividade dos testes ao exame físico e a ressonância magnética excluiu essa lesão.",
  },
  {
    id: "colateral-medial",
    label: "Lesão do ligamento colateral medial",
    correct: true,
    message:
      "Dor medial pós trauma com teste de estresse em valgo positivo aponta para provável lesão ligamentar colateral medial. E a ressonância magnética confirmou o diagnóstico.",
  },
  {
    id: "meniscal-medial",
    label: "Lesão meniscal medial",
    correct: false,
    message:
      "No caso de Alexandre, a ausência de dor a palpação das interlinhas articulares associado as teste de Murray negativo já reduziam a probabilidade desse diagnóstico e a ressonância magnética não evidenciou lesões meniscais.",
  },
];

const exames = [
  {
    id: "tomografia",
    label: "Tomografia de joelho",
    correct: false,
    message:
      "A tomografia é um exame que avalia estruturas ósseas. No atendimento inicial do trauma deve ser solicitado radiografias simples, que são exames de baixo custo e que podem detectar fratura. A tomografia deve ser reservada para o estudo de uma fratura articular já diagnosticada, por exemplo.",
  },
  {
    id: "radiografia",
    label: "Radiografia de joelho",
    correct: false,
    message:
      "Ao aplicar a regra de Ottawa para trauma de joelho (idade ≥ 55 anos, dor à palpação da cabeça da fíbula, dor isolada à palpação da patela, incapacidade de fletir o joelho à 90 graus, inabilidade de dar 4 passos imediatamente após o trauma e ao exame clínico), observa-se que Alexandre não preenche nenhum dos critérios. Estes possuem alta sensibilidade para detectar possível fratura de joelho, e portanto, não há necessidade de radiografia no momento.",
  },
  {
    id: "ressonancia",
    label: "Ressonância magnética de joelho",
    correct: true,
    message:
      "A ressonância magnética é o exame padrão ouro para avaliar lesões ligamentares e de menisco. Também pode detectar fraturas ocultas, corpos livres intra-articulares e derrame articular.",
  },
];

const condutaOpcoes = [
  {
    id: "opcao-1",
    label: "Opção 1",
    correct: false,
    message:
      "Não há necessidade de estender o uso de AINEs por mais uma semana. Ademais, o tratamento cirúrgico não é superior ao conservador, portanto, não está indicado.",
    sections: [
      {
        heading: "Via oral:",
        items: [
          { text: "1. Dipirona 1 g", note: "Tomar um comprimido, a cada 6 horas." },
          {
            text: "2. Cetoprofeno 100 mg",
            note: "Tomar um comprimido, a cada 12 horas, durante 7 dias.",
          },
        ],
      },
      {
        heading: "Procedimento:",
        items: [{ text: "3. Videoartroscopia para reparo agudo do ligamento" }],
      },
    ],
  },
  {
    id: "opcao-2",
    label: "Opção 2",
    correct: false,
    message: "A infiltração articular do joelho não está indicada nas lesões ligamentares agudas.",
    sections: [
      {
        heading: undefined as string | undefined,
        items: [
          {
            text: "1. Infiltração articular no joelho com dipropionato de betametasona 5 mg + fosfato dissódico de betametasona 2 mg",
            note: "1 ampola por infiltração.",
          },
          { text: "2. Enfaixamento ou joelheira." },
        ],
      },
    ],
  },
  {
    id: "opcao-3",
    label: "Opção 3",
    correct: true,
    message:
      "Na lesão ligamentar do colateral medial está indicado tratamento conservador inicialmente, com proteção do joelho através do uso por curtos períodos de órteses, analgésicos, gelo e evitando sobrecarga no local da lesão. O paciente deverá ser encaminhado a fisioterapia para reabilitação. De forma geral, o prognóstico é bom e a maioria dos pacientes podem retornar às atividades em 3 a 6 semanas.",
    sections: [
      {
        heading: "Via oral:",
        items: [
          {
            text: "1. Dipirona 1 g",
            note: "Tomar um comprimido via oral, a cada 6 horas, se houver dor.",
          },
        ],
      },
      {
        heading: "Orientações:",
        items: [
          {
            text: "2. Evitar esforço físico, carregar peso e caminhadas prolongadas durante o tratamento.",
          },
          { text: "3. Compressa de gelo", note: "Aplicar 3 vezes ao dia por 20 minutos." },
        ],
      },
      {
        heading: "Encaminhamento:",
        items: [{ text: "4. Fisioterapia para reabilitação." }],
      },
    ],
  },
];

type ReviewState = {
  correct: boolean;
  correctTitle: string;
  incorrectTitle: string;
  description: string;
  onProsseguir?: () => void;
} | null;

function ExecutarCaso() {
  const [player, setPlayer] = useState({ src: loopVideo, nonce: 0 });
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [pausedPanel, setPausedPanel] = useState<PanelKey | null>(null);
  const [anamneseSection, setAnamneseSection] = useState("");
  const [jerkDone, setJerkDone] = useState(false);
  const [condutaStep, setCondutaStep] = useState<"hipotese" | "exames" | "conduta">("hipotese");
  const [hipotese, setHipotese] = useState<string | null>(null);
  const [condutaTab, setCondutaTab] = useState(condutaOpcoes[0].id);
  const [reviewModal, setReviewModal] = useState<ReviewState>(null);

  const isIdle = player.src === loopVideo;

  const playClip = (src: string) => {
    setPausedPanel(activePanel);
    setActivePanel(null);
    setPlayer((p) => ({ src, nonce: p.nonce + 1 }));
  };

  const stopClip = () => {
    setPlayer((p) => ({ src: loopVideo, nonce: p.nonce + 1 }));
    setActivePanel((current) => current ?? pausedPanel);
    setPausedPanel(null);
  };

  const handleEnded = () => {
    if (!isIdle) stopClip();
  };

  const togglePanel = (panel: PanelKey) =>
    setActivePanel((current) => (current === panel ? null : panel));

  const handleSelectHipotese = (h: (typeof hipoteses)[number]) => {
    setHipotese(h.id);
    setReviewModal({
      correct: h.correct,
      correctTitle: "Diagnóstico adequado",
      incorrectTitle: "Reveja seu diagnóstico",
      description: h.message,
      onProsseguir: h.correct ? () => setCondutaStep("exames") : undefined,
    });
  };

  const handleSelectExame = (exame: (typeof exames)[number]) => {
    setReviewModal({
      correct: exame.correct,
      correctTitle: "Solicitação adequada",
      incorrectTitle: "Reveja sua solicitação",
      description: exame.message,
      onProsseguir: exame.correct ? () => setCondutaStep("conduta") : undefined,
    });
  };

  const handleVoltarConduta = () => {
    setCondutaStep((current) => {
      if (current === "conduta") return "exames";
      if (current === "exames") return "hipotese";
      return current;
    });
  };

  const handleSubmitConduta = (opcao: (typeof condutaOpcoes)[number]) => {
    setReviewModal({
      correct: opcao.correct,
      correctTitle: "Conduta adequada",
      incorrectTitle: "Reveja sua conduta",
      description: opcao.message,
      onProsseguir: opcao.correct ? () => setActivePanel(null) : undefined,
    });
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <video
        key={`${player.src}-${player.nonce}`}
        src={player.src}
        autoPlay
        loop={isIdle}
        muted={isIdle}
        playsInline
        onEnded={handleEnded}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <TooltipProvider delayDuration={200}>
        {!isIdle && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={stopClip}
                aria-label="Parar vídeo"
                className="absolute bottom-6 left-1/2 z-30 flex h-10 w-10 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
              >
                <X className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Parar vídeo</TooltipContent>
          </Tooltip>
        )}

        <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-4">
          <PanelIconButton
            icon={MessageCircleQuestion}
            label="Anamnese"
            description="Anamnese"
            active={activePanel === "anamnese"}
            onClick={() => togglePanel("anamnese")}
          />
          <PanelIconButton
            icon={Stethoscope}
            label="Exame físico"
            description="Exame físico"
            active={activePanel === "exame"}
            onClick={() => togglePanel("exame")}
          />
          <PanelIconButton
            icon={ClipboardList}
            label="Conduta"
            description="Conduta"
            active={activePanel === "conduta"}
            onClick={() => togglePanel("conduta")}
          />
          <PanelIconButton
            icon={MessageSquareReply}
            label="Respostas rápidas"
            description="Respostas rápidas"
            active={activePanel === "respostas"}
            onClick={() => togglePanel("respostas")}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/criar-caso"
                aria-label="Sair"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-colors hover:bg-red-700"
              >
                <LogOut className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">Sair</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-full max-w-md bg-slate-900/90 shadow-2xl backdrop-blur-sm transition-transform duration-300",
          activePanel ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {activePanel === "anamnese" && (
          <AnamnesePanel
            onClose={() => setActivePanel(null)}
            onAskOQueSente={() => playClip(olaDoutorVideo)}
            onAskComoLesionou={() => playClip(foiJogandoFutebolVideo)}
            onAskQuandoAconteceu={() => playClip(faz2DiasVideo)}
            onAskJoelhoInchado={() => playClip(estaInchadoVideo)}
            onAskDificuldadeCaminhar={() => playClip(simVideo)}
            onAskJoelhoTrava={() => playClip(naoVideo)}
            accordionValue={anamneseSection}
            onAccordionValueChange={setAnamneseSection}
          />
        )}
        {activePanel === "exame" && (
          <ExameFisicoPanel
            onClose={() => setActivePanel(null)}
            jerkDone={jerkDone}
            onJerk={() => {
              playClip(exameFisicoVideo);
              setJerkDone(true);
            }}
          />
        )}
        {activePanel === "conduta" && (
          <CondutaPanel
            onClose={() => setActivePanel(null)}
            step={condutaStep}
            hipotese={hipotese}
            onSelectHipotese={handleSelectHipotese}
            onSelectExame={handleSelectExame}
            condutaTab={condutaTab}
            onCondutaTabChange={setCondutaTab}
            onSubmitConduta={handleSubmitConduta}
            onVoltar={handleVoltarConduta}
          />
        )}
        {activePanel === "respostas" && (
          <RespostasRapidasPanel onClose={() => setActivePanel(null)} onReply={playClip} />
        )}
      </div>

      <ReviewModal review={reviewModal} onClose={() => setReviewModal(null)} />
    </div>
  );
}

function PanelIconButton({
  icon: Icon,
  label,
  description,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className={cn(
            "flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-colors",
            active
              ? "bg-[var(--brand)] text-white"
              : "bg-[var(--sidebar-bg)] text-[var(--sidebar-muted)] hover:text-white",
          )}
        >
          <Icon className="h-6 w-6" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{description}</TooltipContent>
    </Tooltip>
  );
}

function QuickReplyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 cursor-pointer rounded-full bg-[var(--brand)] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {label}
    </button>
  );
}

function PanelHeader({
  title,
  subtitle,
  onClose,
  onBack,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-start justify-between px-6 pt-6 pb-4">
      <div className="flex items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar ao passo anterior"
            className="mt-1 cursor-pointer text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-wide text-[var(--brand)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="cursor-pointer text-white/60 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function AnamnesePanel({
  onClose,
  onAskOQueSente,
  onAskComoLesionou,
  onAskQuandoAconteceu,
  onAskJoelhoInchado,
  onAskDificuldadeCaminhar,
  onAskJoelhoTrava,
  accordionValue,
  onAccordionValueChange,
}: {
  onClose: () => void;
  onAskOQueSente: () => void;
  onAskComoLesionou: () => void;
  onAskQuandoAconteceu: () => void;
  onAskJoelhoInchado: () => void;
  onAskDificuldadeCaminhar: () => void;
  onAskJoelhoTrava: () => void;
  accordionValue: string;
  onAccordionValueChange: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader title="Anamnese" subtitle="Realize as perguntas necessárias" onClose={onClose} />
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={onAccordionValueChange}
        className="px-6"
      >
        <AccordionItem value="queixa-principal" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Queixa principal
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={onAskOQueSente}
                className="cursor-pointer rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                O que você está sentindo?
              </button>
              <button
                type="button"
                onClick={onAskComoLesionou}
                className="cursor-pointer rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                Como foi que você se lesionou?
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hda" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            História da doença atual
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={onAskQuandoAconteceu}
                className="cursor-pointer rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                Quando isso aconteceu?
              </button>
              <button
                type="button"
                onClick={onAskJoelhoInchado}
                className="cursor-pointer rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                O joelho ficou inchado?
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="interrogatorio" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Interrogatório sintomatológico
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={onAskDificuldadeCaminhar}
                className="cursor-pointer rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                Tem tido dificuldade em caminhar?
              </button>
              <button
                type="button"
                onClick={onAskJoelhoTrava}
                className="cursor-pointer rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                Você tem sentido o joelho travar?
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="antecedentes" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Antecedentes pessoais e familiares
          </AccordionTrigger>
          <AccordionContent />
        </AccordionItem>

        <AccordionItem value="habitos" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Hábitos de vida
          </AccordionTrigger>
          <AccordionContent />
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ExameFisicoPanel({
  onClose,
  jerkDone,
  onJerk,
}: {
  onClose: () => void;
  jerkDone: boolean;
  onJerk: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader
        title="Exame físico"
        subtitle="Realize os exames necessários"
        onClose={onClose}
      />
      <Accordion type="single" collapsible className="px-6">
        <AccordionItem value="especialidades" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Exame físico e especialidades
          </AccordionTrigger>
          <AccordionContent>
            <button
              type="button"
              onClick={onJerk}
              className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span>Exame de Jerk</span>
              {jerkDone && <Check className="h-4 w-4 text-[var(--brand)]" />}
            </button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function CondutaPanel({
  onClose,
  step,
  hipotese,
  onSelectHipotese,
  onSelectExame,
  condutaTab,
  onCondutaTabChange,
  onSubmitConduta,
  onVoltar,
}: {
  onClose: () => void;
  step: "hipotese" | "exames" | "conduta";
  hipotese: string | null;
  onSelectHipotese: (h: (typeof hipoteses)[number]) => void;
  onSelectExame: (exame: (typeof exames)[number]) => void;
  condutaTab: string;
  onCondutaTabChange: (id: string) => void;
  onSubmitConduta: (opcao: (typeof condutaOpcoes)[number]) => void;
  onVoltar: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {step === "hipotese" && (
        <>
          <PanelHeader
            title="Hipótese diagnóstica"
            subtitle="Selecione a hipótese diagnóstica"
            onClose={onClose}
          />
          <div className="flex flex-col gap-3 px-6">
            {hipoteses.map((h) => {
              const selected = hipotese === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => onSelectHipotese(h)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors",
                    selected
                      ? "border-[var(--brand)] ring-1 ring-[var(--brand)]"
                      : "border-slate-200 hover:border-slate-300",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                      selected
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                        : "border-slate-300",
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  {h.label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {step === "exames" && (
        <>
          <PanelHeader
            title="Exames"
            subtitle="Solicite os exames necessários"
            onClose={onClose}
            onBack={onVoltar}
          />
          <div className="flex flex-col gap-3 px-6">
            {exames.map((exame) => (
              <button
                key={exame.id}
                type="button"
                onClick={() => onSelectExame(exame)}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:border-slate-300"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-slate-300" />
                {exame.label}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "conduta" && (
        <>
          <PanelHeader
            title="Conduta"
            subtitle="Escolha a conduta que julgar ideal"
            onClose={onClose}
            onBack={onVoltar}
          />
          <div className="flex flex-1 flex-col px-6">
            <Tabs
              value={condutaTab}
              onValueChange={onCondutaTabChange}
              className="flex flex-1 flex-col"
            >
              <TabsList className="grid w-full grid-cols-3">
                {condutaOpcoes.map((opcao) => (
                  <TabsTrigger key={opcao.id} value={opcao.id}>
                    {opcao.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {condutaOpcoes.map((opcao) => (
                <TabsContent key={opcao.id} value={opcao.id}>
                  <div className="rounded-lg bg-white p-5 text-sm text-slate-800">
                    <p>Paciente: Alexandre de S.</p>
                    <p>Idade: 30 anos</p>
                    <div className="my-4 border-t border-slate-200" />
                    <p className="text-center font-semibold">Prescrição</p>
                    <div className="mt-4 space-y-3">
                      {opcao.sections.map((section, i) => (
                        <div key={i}>
                          {section.heading && <p className="font-medium">{section.heading}</p>}
                          {section.items.map((item, j) => (
                            <div key={j}>
                              <p>{item.text}</p>
                              {item.note && <p className="text-slate-600">{item.note}</p>}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          <div className="px-6 pb-6 pt-4">
            <button
              type="button"
              onClick={() => {
                const opcao = condutaOpcoes.find((o) => o.id === condutaTab);
                if (opcao) onSubmitConduta(opcao);
              }}
              className="h-11 w-full cursor-pointer rounded-lg bg-[var(--brand)] text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Prosseguir
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function RespostasRapidasPanel({
  onClose,
  onReply,
}: {
  onClose: () => void;
  onReply: (src: string) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader
        title="Respostas rápidas"
        subtitle="Selecione a resposta do paciente"
        onClose={onClose}
      />
      <div className="flex flex-wrap gap-3 px-6">
        <QuickReplyButton label="Sim" onClick={() => onReply(simVideo)} />
        <QuickReplyButton label="Não" onClick={() => onReply(naoVideo)} />
        <QuickReplyButton label="Não tenho" onClick={() => onReply(naoTenhoVideo)} />
        <QuickReplyButton label="Não tenho certeza" onClick={() => onReply(naoTenhoCertezaVideo)} />
      </div>
    </div>
  );
}

function ReviewModal({ review, onClose }: { review: ReviewState; onClose: () => void }) {
  return (
    <Dialog open={!!review} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md border-white/10 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold uppercase tracking-wide text-white">
            {review?.correct ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
            )}
            {review?.correct ? review.correctTitle : review?.incorrectTitle}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="border-t border-white/10 pt-4 text-white/80">
          {review?.description}
        </DialogDescription>
        <DialogFooter className="sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="h-10 cursor-pointer rounded-full bg-red-600 px-6 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Retornar
          </button>
          {review?.correct && (
            <button
              type="button"
              onClick={() => {
                review.onProsseguir?.();
                onClose();
              }}
              className="h-10 cursor-pointer rounded-full bg-[var(--brand)] px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Prosseguir
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
