import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CircleDot,
  FolderKanban,
  GitFork,
  Layers3,
  Network,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "TalentGraph | Turn Your Skills Into a Career Plan",
  description:
    "Explore realistic career paths, identify your most important skill gaps, and discover the resources and projects that move you forward.",
};

const tools = [
  {
    href: "/career-path",
    eyebrow: "Plan the route",
    title: "Career Paths",
    description:
      "Compare realistic role transitions and see what carries forward at every step.",
    detail: "Up to 5 ranked paths",
    icon: Route,
    accent: "emerald",
  },
  {
    href: "/skill-gap",
    eyebrow: "Focus your effort",
    title: "Skill Gap",
    description:
      "Measure your readiness for a target role and rank the next skills worth learning.",
    detail: "Top 5 next skills",
    icon: Layers3,
    accent: "indigo",
  },
  {
    href: "/explorer",
    eyebrow: "See the system",
    title: "Graph Explorer",
    description:
      "Explore how roles, skills, resources, projects, and transitions connect.",
    detail: "Interactive 1–2 hop graph",
    icon: Network,
    accent: "cyan",
  },
] as const;

const accentClasses = {
  emerald: {
    shell: "border-emerald-200/80 bg-white hover:border-emerald-300",
    icon: "bg-emerald-100 text-emerald-800",
    eyebrow: "text-emerald-800",
    link: "text-emerald-800",
  },
  indigo: {
    shell: "border-indigo-200/80 bg-white hover:border-indigo-300",
    icon: "bg-indigo-100 text-indigo-800",
    eyebrow: "text-indigo-800",
    link: "text-indigo-800",
  },
  cyan: {
    shell: "border-cyan-200/80 bg-white hover:border-cyan-300",
    icon: "bg-cyan-100 text-cyan-900",
    eyebrow: "text-cyan-900",
    link: "text-cyan-900",
  },
} as const;

function GraphPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[610px]">
      <div
        className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/40 via-cyan-100/30 to-indigo-200/40 blur-2xl"
        aria-hidden="true"
      />
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Network className="size-4 text-cyan-700" aria-hidden="true" />
            Your opportunity graph
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Connected
          </div>
        </div>

        <div className="relative aspect-[1.25/1] bg-[#f8fafc] sm:aspect-[1.35/1]">
          <div
            className="absolute inset-0 opacity-60"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(148,163,184,.45) 1px, transparent 1px)",
              backgroundSize: "21px 21px",
            }}
          />
          <svg
            viewBox="0 0 620 450"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            <defs>
              <marker
                id="landing-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
            </defs>
            <g
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              markerEnd="url(#landing-arrow)"
            >
              <path d="M140 226 C205 190 240 147 300 124" />
              <path d="M142 234 C220 253 270 266 326 266" />
              <path d="M338 124 C395 130 425 160 474 190" />
              <path d="M370 266 C430 255 458 229 498 210" />
              <path d="M350 286 C390 330 414 345 467 354" />
              <path d="M300 144 C302 186 314 220 337 246" />
            </g>
            <path
              d="M170 216 C250 98 358 68 462 176"
              fill="none"
              stroke="#0f766e"
              strokeWidth="3"
              strokeDasharray="8 7"
              markerEnd="url(#landing-arrow)"
            />
          </svg>

          <div className="absolute top-[43%] left-[10%] -translate-y-1/2">
            <div className="rounded-2xl border-4 border-cyan-200 bg-slate-950 px-4 py-3 text-white shadow-xl">
              <div className="text-[10px] font-semibold tracking-[0.18em] text-cyan-300 uppercase">
                Current role
              </div>
              <div className="mt-1 text-sm font-semibold">Frontend Developer</div>
            </div>
          </div>

          <div className="absolute top-[18%] left-[45%] -translate-x-1/2">
            <div className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-cyan-600 text-white shadow-lg">
              <CircleDot className="size-6" aria-hidden="true" />
            </div>
            <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-center text-[11px] font-semibold text-slate-700 shadow-sm">
              TypeScript
            </div>
          </div>

          <div className="absolute top-[50%] left-[55%] -translate-x-1/2">
            <div className="mx-auto flex size-16 rotate-45 items-center justify-center rounded-xl border-4 border-white bg-indigo-600 text-white shadow-lg">
              <BookOpen className="size-5 -rotate-45" aria-hidden="true" />
            </div>
            <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-center text-[11px] font-semibold text-slate-700 shadow-sm">
              Learning resource
            </div>
          </div>

          <div className="absolute top-[39%] right-[8%] -translate-y-1/2">
            <div className="rounded-2xl border-4 border-emerald-100 bg-emerald-700 px-4 py-3 text-white shadow-xl">
              <div className="text-[10px] font-semibold tracking-[0.16em] text-emerald-200 uppercase">
                Next role
              </div>
              <div className="mt-1 text-sm font-semibold">Full Stack Developer</div>
            </div>
          </div>

          <div className="absolute right-[13%] bottom-[9%]">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-4 border-white bg-amber-500 text-white shadow-lg">
              <FolderKanban className="size-6" aria-hidden="true" />
            </div>
            <div className="mt-2 rounded-lg bg-white/95 px-2 py-1 text-center text-[11px] font-semibold text-slate-700 shadow-sm">
              Portfolio project
            </div>
          </div>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 rounded-xl border border-white/80 bg-white/85 p-2.5 text-[10px] font-medium text-slate-600 shadow-sm backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-950" /> Role
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-cyan-600" /> Skill
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-indigo-600" /> Resource
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-sm bg-amber-500" /> Project
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f5] text-slate-950">
      <header className="relative z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <GitFork className="size-4" aria-hidden="true" />
            </span>
            <span>TalentGraph</span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Landing page navigation"
          >
            <a
              href="#tools"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              Tools
            </a>
            <a
              href="#how-it-works"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              How it works
            </a>
            <a
              href="#knowledge-graph"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              The graph
            </a>
          </nav>

          <Link
            href="/career-path"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            Start planning
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section className="relative border-b border-slate-200/80 bg-white">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 8% 12%, rgba(16,185,129,.13), transparent 28%), radial-gradient(circle at 88% 18%, rgba(8,145,178,.12), transparent 27%), radial-gradient(circle at 65% 88%, rgba(99,102,241,.09), transparent 25%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Graph-powered career intelligence
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl leading-[0.98] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-[4.4rem]">
              Turn your skills into a route forward.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              TalentGraph connects roles, skills, resources, and projects so you
              can see where you fit today—and what to do next.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/career-path"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                Explore career paths
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/explorer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2"
              >
                <Network className="size-4 text-cyan-700" aria-hidden="true" />
                Open graph explorer
              </Link>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-3 gap-3 border-t border-slate-200 pt-6">
              <div>
                <div className="text-2xl font-semibold tracking-tight">30</div>
                <div className="mt-1 text-xs font-medium text-slate-500">Career roles</div>
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight">70</div>
                <div className="mt-1 text-xs font-medium text-slate-500">Practical skills</div>
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight">660</div>
                <div className="mt-1 text-xs font-medium text-slate-500">Connections</div>
              </div>
            </div>
          </div>

          <GraphPreview />
        </div>
      </section>

      <section id="tools" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
              One graph, three questions
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">
              Go from curiosity to a concrete next step.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Choose the view that matches the decision you need to make.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const colors = accentClasses[tool.accent];
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`group flex min-h-80 flex-col rounded-[1.5rem] border p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4 ${colors.shell}`}
                >
                  <div className={`flex size-12 items-center justify-center rounded-2xl ${colors.icon}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className={`mt-8 text-xs font-semibold tracking-[0.16em] uppercase ${colors.eyebrow}`}>
                    {tool.eyebrow}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    {tool.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">{tool.description}</p>
                  <div className="mt-auto pt-8">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Check className="size-3.5" aria-hidden="true" />
                      {tool.detail}
                    </div>
                    <div className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${colors.link}`}>
                      Open {tool.title.toLowerCase()}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 border-y border-slate-200/80 bg-white py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-emerald-800 uppercase">
                <Target className="size-4" aria-hidden="true" />
                How it works
              </div>
              <h2 className="mt-4 max-w-md text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">
                A career plan grounded in relationships, not guesswork.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-slate-600">
                TalentGraph turns career exploration into a bounded graph query,
                then translates the result into decisions you can act on.
              </p>
            </div>

            <ol className="space-y-4">
              {[
                {
                  number: "01",
                  title: "Start with your context",
                  description:
                    "Choose your current role, target role, and the skills you already use.",
                  icon: BriefcaseBusiness,
                },
                {
                  number: "02",
                  title: "Traverse the opportunity graph",
                  description:
                    "TalentGraph follows curated requirements and role transitions—never an unbounded search.",
                  icon: GitFork,
                },
                {
                  number: "03",
                  title: "Turn gaps into evidence",
                  description:
                    "Prioritize the skills that matter, then learn through official resources and portfolio projects.",
                  icon: FolderKanban,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.number}
                    className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-[48px_1fr_auto] sm:items-center sm:p-6"
                  >
                    <div className="text-sm font-semibold text-slate-400">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                    <div className="hidden size-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 sm:flex">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section id="knowledge-graph" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
            <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-14">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">
                  <Network className="size-4" aria-hidden="true" />
                  A connected data model
                </div>
                <h2 className="mt-5 max-w-lg text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">
                  Career planning is a graph problem.
                </h2>
                <p className="mt-5 max-w-xl leading-7 text-slate-300">
                  A role is useful only when you can see its required skills,
                  adjacent opportunities, learning resources, and proof-of-work
                  projects together.
                </p>
                <Link
                  href="/explorer"
                  className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  Explore the knowledge graph
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: BriefcaseBusiness,
                    title: "Role",
                    relation: "CAN TRANSITION TO",
                    color: "text-emerald-300",
                  },
                  {
                    icon: CircleDot,
                    title: "Skill",
                    relation: "REQUIRED BY",
                    color: "text-cyan-300",
                  },
                  {
                    icon: BookOpen,
                    title: "Resource",
                    relation: "TEACHES",
                    color: "text-indigo-300",
                  },
                  {
                    icon: FolderKanban,
                    title: "Project",
                    relation: "DEMONSTRATES",
                    color: "text-amber-300",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
                    >
                      <Icon className={`size-5 ${item.color}`} aria-hidden="true" />
                      <div className="mt-5 text-lg font-semibold">{item.title}</div>
                      <div className="mt-1 text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">
                        {item.relation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl">
            Your next move should feel specific.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Start with a role you know, then let the graph show you the shortest
            useful path forward.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/career-path"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              Build a career path
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/skill-gap"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              Analyze a skill gap
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-[#f7f8f5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 font-semibold text-slate-800">
            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-950 text-white">
              <GitFork className="size-3.5" aria-hidden="true" />
            </span>
            TalentGraph
          </div>
          <div>Career mobility, modeled as a connected graph.</div>
        </div>
      </footer>
    </main>
  );
}
