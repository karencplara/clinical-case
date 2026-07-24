import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/logo-degrade-azul-medio.png.asset.json";
import { useState } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Stethoscope,
  GraduationCap,
  Settings,
  Users,
  FileText,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Paciente 360" },
      {
        name: "description",
        content:
          "Painel administrativo do Paciente 360 com usuários ativos, casos clínicos e cursos.",
      },
      { property: "og:title", content: "Dashboard — Paciente 360" },
      {
        property: "og:description",
        content: "Painel administrativo do Paciente 360.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const chartData = [
  { date: "16/07/2026", v: 202 },
  { date: "17/07/2026", v: 205 },
  { date: "18/07/2026", v: 80 },
  { date: "19/07/2026", v: 58 },
  { date: "20/07/2026", v: 150 },
  { date: "21/07/2026", v: 183 },
  { date: "22/07/2026", v: 271 },
  { date: "23/07/2026", v: 125 },
];

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <TopBar />
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<UsersIcon />}
              value="97353"
              label="Usuários Ativos"
            />
            <StatCard
              icon={<StethoscopeIcon />}
              value="2450"
              label="Casos Clinicos"
            />
            <StatCard
              icon={<DocIcon />}
              value="2446"
              label="Cursos"
            />
          </div>

          <div className="bg-white rounded shadow-sm">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-[var(--brand)] rounded-sm" />
                <h2 className="text-xl text-slate-700">Gráfico de Acessos</h2>
              </div>
              <select className="h-9 px-3 pr-8 rounded border border-slate-300 bg-white text-sm text-slate-600 focus:outline-none">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 90 dias</option>
              </select>
            </div>
            <div className="p-4 h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid stroke="#eef2f7" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 300]}
                    ticks={[0, 50, 100, 150, 200, 250, 300]}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Line
                    type="linear"
                    dataKey="v"
                    stroke="#4bb3d4"
                    strokeWidth={2}
                    dot={{ r: 5, fill: "#4bb3d4", stroke: "#4bb3d4" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white rounded shadow-sm px-8 py-6 flex items-center gap-6">
      <div className="text-[#4bb3d4] shrink-0">{icon}</div>
      <div className="flex-1 text-right">
        <div className="text-5xl font-bold text-[var(--brand)] leading-none">{value}</div>
        <div className="text-slate-500 text-sm mt-2">{label}</div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return <Users className="h-16 w-16" strokeWidth={1.5} />;
}
function StethoscopeIcon() {
  return <Stethoscope className="h-16 w-16" strokeWidth={1.5} />;
}
function DocIcon() {
  return <FileText className="h-16 w-16" strokeWidth={1.5} />;
}

function Sidebar() {
  const [casosOpen, setCasosOpen] = useState(true);
  const [cursosOpen, setCursosOpen] = useState(false);
  const [confOpen, setConfOpen] = useState(false);

  return (
    <aside className="w-64 shrink-0 bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] min-h-screen flex flex-col">
      <div className="h-24 flex items-center justify-center px-5">
        <img
          src={logoAsset.url}
          alt="Paciente 360"
          className="h-12 w-auto object-contain"
        />
      </div>

      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full h-10 pl-9 pr-3 rounded bg-white text-slate-700 text-sm placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <nav className="flex-1 text-sm">
        <TopItem icon={LayoutDashboard} label="Dashboard" active />

        <Collapsible
          icon={Stethoscope}
          label="Casos"
          open={casosOpen}
          onToggle={() => setCasosOpen(!casosOpen)}
        >
          <SubItem label="Casos" />
          <SubItemLink to="/criar-caso" label="Criar caso clínico" />
          <SubItem label="Enquetes" />
          <SubItem label="Bloco de notas" />
          <SubItem label="Diagnósticos" />
          <SubItem label="Especialidades" />
          <SubItem label="Exames" />
          <SubItem label="Hipótese diagnóstica" />
          <SubItem label="Personas" />
          <SubItem label="Upload de vídeos" />
          <SubItem label="Tipos de exames" />
        </Collapsible>

        <Collapsible
          icon={GraduationCap}
          label="Cursos"
          open={cursosOpen}
          onToggle={() => setCursosOpen(!cursosOpen)}
        />

        <Collapsible
          icon={Settings}
          label="Configurações"
          open={confOpen}
          onToggle={() => setConfOpen(!confOpen)}
        />
      </nav>
    </aside>
  );
}

function TopItem({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-6 py-3 text-[var(--sidebar-muted)] hover:text-white hover:bg-white/5 ${
        active ? "text-white bg-white/5" : ""
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className={active ? "font-medium text-white" : ""}>{label}</span>
    </a>
  );
}

function Collapsible({
  icon: Icon,
  label,
  open,
  onToggle,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  open: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-6 py-3 text-[var(--sidebar-muted)] hover:text-white hover:bg-white/5"
      >
        <Icon className="h-5 w-5" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && children && (
        <div className="bg-black/20 py-2">{children}</div>
      )}
    </div>
  );
}

function SubItem({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2 pl-8 pr-4 py-2 text-[var(--sidebar-muted)] hover:text-white text-sm"
    >
      <ChevronRight className="h-3 w-3" />
      <span>{label}</span>
    </a>
  );
}

function SubItemLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 pl-8 pr-4 py-2 text-[var(--brand)] hover:text-white text-sm font-medium"
    >
      <Plus className="h-3.5 w-3.5" />
      <span>{label}</span>
    </Link>
  );
}

function TopBar() {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-6 border-b border-slate-200">
      <button className="text-slate-600" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Usuário:</span>
        <span className="font-semibold text-slate-800">Luna Silva</span>
        <ChevronDown className="h-4 w-4 text-[var(--brand)]" />
      </div>
    </header>
  );
}
