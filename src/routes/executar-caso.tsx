import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  ClipboardList,
  LogOut,
  MessageCircleQuestion,
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

import loopVideo from "@/assets/videos/videos-caso-clinico/00-loop.mp4";
import olaDoutorVideo from "@/assets/videos/videos-caso-clinico/01-ola_doutor.mp4";
import foiJogandoFutebolVideo from "@/assets/videos/videos-caso-clinico/02-foi_jogando_futebol.mp4";
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

type PanelKey = "anamnese" | "exame" | "conduta";

const hipoteses = [
  { id: "lca", label: "Lesão do ligamento cruzado anterior (LCA)" },
  { id: "colateral-medial", label: "Lesão do ligamento colateral medial" },
  { id: "meniscal-medial", label: "Lesão meniscal medial" },
];

const exames = [
  { id: "tomografia", label: "Tomografia de joelho", correct: false },
  { id: "radiografia", label: "Radiografia de joelho", correct: false },
  { id: "ressonancia", label: "Ressonância magnética de joelho", correct: true },
];

function ExecutarCaso() {
  const [player, setPlayer] = useState({ src: loopVideo, nonce: 0 });
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null);
  const [jerkDone, setJerkDone] = useState(false);
  const [condutaStep, setCondutaStep] = useState<"hipotese" | "exames" | "conduta">(
    "hipotese",
  );
  const [hipotese, setHipotese] = useState<string | null>(null);
  const [examModal, setExamModal] = useState<{ label: string; correct: boolean } | null>(
    null,
  );

  const isIdle = player.src === loopVideo;
  const playClip = (src: string) => setPlayer((p) => ({ src, nonce: p.nonce + 1 }));
  const handleEnded = () => {
    if (!isIdle) playClip(loopVideo);
  };

  const togglePanel = (panel: PanelKey) =>
    setActivePanel((current) => (current === panel ? null : panel));

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

      <div className="absolute right-6 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-4">
        <PanelIconButton
          icon={MessageCircleQuestion}
          label="Anamnese"
          active={activePanel === "anamnese"}
          onClick={() => togglePanel("anamnese")}
        />
        <PanelIconButton
          icon={Stethoscope}
          label="Exame físico"
          active={activePanel === "exame"}
          onClick={() => togglePanel("exame")}
        />
        <PanelIconButton
          icon={ClipboardList}
          label="Conduta"
          active={activePanel === "conduta"}
          onClick={() => togglePanel("conduta")}
        />
      </div>

      <div
        className={cn(
          "fixed left-0 top-0 bottom-24 z-20 w-full max-w-md bg-slate-900/90 shadow-2xl backdrop-blur-sm transition-transform duration-300",
          activePanel ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {activePanel === "anamnese" && (
          <AnamnesePanel
            onClose={() => setActivePanel(null)}
            onAskOQueSente={() => playClip(olaDoutorVideo)}
            onAskComoLesionou={() => playClip(foiJogandoFutebolVideo)}
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
            onSelectHipotese={setHipotese}
            onProsseguirHipotese={() => setCondutaStep("exames")}
            onSelectExame={(exame) =>
              setExamModal({ label: exame.label, correct: exame.correct })
            }
          />
        )}
      </div>

      <ExameModal
        exam={examModal}
        onClose={() => setExamModal(null)}
        onProsseguir={() => {
          setCondutaStep("conduta");
          setExamModal(null);
        }}
      />

      <footer className="fixed inset-x-0 bottom-0 z-30 flex h-24 items-center justify-between gap-4 border-t border-white/10 bg-slate-950/95 px-6">
        <Link
          to="/criar-caso"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Link>

        <div className="flex items-center gap-2">
          <span className="mr-1 text-xs text-white/40">Respostas rápidas:</span>
          <QuickReplyButton label="Sim" onClick={() => playClip(simVideo)} />
          <QuickReplyButton label="Não" onClick={() => playClip(naoVideo)} />
          <QuickReplyButton label="Não tenho" onClick={() => playClip(naoTenhoVideo)} />
          <QuickReplyButton
            label="Não tenho certeza"
            onClick={() => playClip(naoTenhoCertezaVideo)}
          />
        </div>
      </footer>
    </div>
  );
}

function PanelIconButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors",
        active
          ? "bg-[var(--brand)] text-white"
          : "bg-[var(--sidebar-bg)] text-[var(--sidebar-muted)] hover:text-white",
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

function QuickReplyButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 rounded-full bg-[var(--brand)] px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {label}
    </button>
  );
}

function PanelHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between px-6 pt-6 pb-4">
      <div>
        <h2 className="text-lg font-semibold uppercase tracking-wide text-[var(--brand)]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-white/60">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="text-white/60 hover:text-white"
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
}: {
  onClose: () => void;
  onAskOQueSente: () => void;
  onAskComoLesionou: () => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PanelHeader
        title="Anamnese"
        subtitle="Realize as perguntas necessárias"
        onClose={onClose}
      />
      <Accordion
        type="single"
        collapsible
        defaultValue="queixa-principal"
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
                className="rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                O que você está sentindo?
              </button>
              <button
                type="button"
                onClick={onAskComoLesionou}
                className="rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
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
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="interrogatorio" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Interrogatório sintomatológico
          </AccordionTrigger>
          <AccordionContent />
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
      <Accordion
        type="single"
        collapsible
        defaultValue="especialidades"
        className="px-6"
      >
        <AccordionItem value="especialidades" className="border-white/10">
          <AccordionTrigger className="text-sm font-semibold uppercase tracking-wide text-white">
            Exame físico e especialidades
          </AccordionTrigger>
          <AccordionContent>
            <button
              type="button"
              onClick={onJerk}
              className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
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
  onProsseguirHipotese,
  onSelectExame,
}: {
  onClose: () => void;
  step: "hipotese" | "exames" | "conduta";
  hipotese: string | null;
  onSelectHipotese: (id: string) => void;
  onProsseguirHipotese: () => void;
  onSelectExame: (exame: (typeof exames)[number]) => void;
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
                  onClick={() => onSelectHipotese(h.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors",
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
          <div className="mt-auto px-6 pb-6 pt-4">
            <button
              type="button"
              disabled={!hipotese}
              onClick={onProsseguirHipotese}
              className="h-11 w-full rounded-lg bg-[var(--brand)] text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prosseguir
            </button>
          </div>
        </>
      )}

      {step === "exames" && (
        <>
          <PanelHeader
            title="Exames"
            subtitle="Solicite os exames necessários"
            onClose={onClose}
          />
          <div className="flex flex-col gap-3 px-6">
            {exames.map((exame) => (
              <button
                key={exame.id}
                type="button"
                onClick={() => onSelectExame(exame)}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:border-slate-300"
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
          />
          <div className="mx-6 rounded-lg bg-white p-5 text-sm text-slate-800">
            <p>Paciente: Alexandre de S.</p>
            <p>Idade: 30 anos</p>
            <div className="my-4 border-t border-slate-200" />
            <p className="text-center font-semibold">Prescrição</p>
            <div className="mt-4 space-y-3">
              <p className="font-medium">Via oral:</p>
              <div>
                <p>1. Dipirona 1 g</p>
                <p className="text-slate-600">Tomar um comprimido, a cada 6 horas.</p>
              </div>
              <div>
                <p>2. Cetoprofeno 100 mg</p>
                <p className="text-slate-600">
                  Tomar um comprimido, a cada 12 horas, durante 7 dias.
                </p>
              </div>
              <div>
                <p className="font-medium">Procedimentos:</p>
                <p>3. Videoartroscopia diagnóstica e terapêutica.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ExameModal({
  exam,
  onClose,
  onProsseguir,
}: {
  exam: { label: string; correct: boolean } | null;
  onClose: () => void;
  onProsseguir: () => void;
}) {
  return (
    <Dialog open={!!exam} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        {exam?.correct ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600">
                <Check className="h-5 w-5" />
                Solicitação adequada
              </DialogTitle>
              <DialogDescription>
                A ressonância magnética é o exame padrão ouro para avaliar lesões
                ligamentares e de menisco. Também pode detectar fraturas ocultas, corpos
                livres intra-articulares e derrame articular.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Retornar
              </button>
              <button
                type="button"
                onClick={onProsseguir}
                className="h-10 rounded-lg bg-[var(--brand)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Prosseguir
              </button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <X className="h-5 w-5" />
                Solicitação incorreta
              </DialogTitle>
              <DialogDescription>
                Este não é o exame mais indicado para investigar a hipótese diagnóstica
                deste caso. Reavalie e solicite o exame mais adequado.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg bg-[var(--brand)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Retornar
              </button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
