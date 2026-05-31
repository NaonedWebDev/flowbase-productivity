"use client";

import {
  Bot,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  LayoutDashboard,
  LibraryBig,
  NotebookTabs,
  Palette,
  Plus,
  Search,
  Settings,
  Sparkles,
  Stars,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        color: "text-coral-500",
        bg: "bg-coral-100",
        active: true,
      },
      {
        label: "AI Assistant",
        icon: Bot,
        color: "text-violet-500",
        bg: "bg-violet-100",
      },
      {
        label: "Calendar",
        icon: CalendarDays,
        color: "text-sky-500",
        bg: "bg-sky-100",
      },
      {
        label: "Task / Kanban",
        icon: Columns3,
        color: "text-teal-500",
        bg: "bg-teal-100",
      },
    ],
  },
  {
    label: "Creation",
    items: [
      {
        label: "Notes",
        icon: NotebookTabs,
        color: "text-amber-500",
        bg: "bg-amber-100",
      },
      {
        label: "Whiteboard",
        icon: Palette,
        color: "text-emerald-500",
        bg: "bg-emerald-100",
      },
      {
        label: "Pages / Spaces",
        icon: LibraryBig,
        color: "text-rose-500",
        bg: "bg-rose-100",
      },
      {
        label: "AI Template Builder",
        icon: Sparkles,
        color: "text-fuchsia-500",
        bg: "bg-fuchsia-100",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        icon: Settings,
        color: "text-slate-500",
        bg: "bg-slate-100",
      },
    ],
  },
];

const focusCards = [
  { label: "Tasks moving", value: "18", helper: "5 due today", color: "bg-coral-400" },
  { label: "Notes captured", value: "42", helper: "12 linked to boards", color: "bg-amber-400" },
  { label: "Spaces active", value: "7", helper: "Product, ops, personal", color: "bg-teal-400" },
];

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,hsl(42_86%_97%),hsl(176_76%_95%)_48%,hsl(12_100%_97%))] text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "flex shrink-0 flex-col overflow-hidden border-r border-border/80 bg-sidebar/90 px-3 py-4 shadow-[12px_0_40px_rgba(69,54,38,0.06)] backdrop-blur transition-[width] duration-300 ease-out",
            isCollapsed ? "w-[68px]" : "w-[232px]"
          )}
        >
          <header className="flex items-center gap-3 px-1">
            <div className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Stars className="size-4" aria-hidden="true" />
            </div>
            <div
              className={cn(
                "min-w-0 transition-opacity duration-200",
                isCollapsed && "pointer-events-none opacity-0"
              )}
            >
              <p className="truncate text-sm font-semibold leading-5">Flowbase</p>
              <p className="truncate text-xs text-muted-foreground">Work, mapped softly</p>
            </div>
          </header>

          <button
            type="button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsCollapsed((value) => !value)}
            className={cn(
              "mt-4 flex h-7 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/30 hover:text-foreground",
              isCollapsed ? "mx-auto w-9" : "w-full gap-2 text-[0.68rem] font-medium"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" aria-hidden="true" />
            ) : (
              <>
                <ChevronLeft className="size-4" aria-hidden="true" />
                Collapse
              </>
            )}
          </button>

          <nav className="mt-4 flex flex-1 flex-col gap-3" aria-label="Dashboard navigation">
            {navGroups.map((group) => (
              <div key={group.label}>
                {!isCollapsed && (
                  <p className="mb-1 px-2 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.label}
                        title={isCollapsed ? item.label : undefined}
                        className={cn(
                          "group flex h-8 w-full items-center rounded-[0.7rem] font-medium transition",
                          item.active
                            ? "bg-primary/10 text-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-card hover:text-foreground",
                          isCollapsed ? "justify-center px-0" : "gap-2 px-1.5"
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-lg transition group-hover:scale-105",
                            item.bg
                          )}
                        >
                          <Icon className={cn("size-3.5", item.color)} aria-hidden="true" />
                        </span>
                        {!isCollapsed && <span className="truncate text-[0.72rem]">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <footer className="rounded-2xl border border-border bg-card/80 p-2 shadow-sm">
            <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-2")}>
              <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-mint-100 text-teal-600">
                <Plus className="size-3.5" aria-hidden="true" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">Personal Space</p>
                  <p className="truncate text-[0.68rem] text-muted-foreground">Synced and calm</p>
                </div>
              )}
            </div>
          </footer>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-col gap-4 border-b border-border/80 bg-background/75 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                Build your day across notes, tasks, and boards.
              </h1>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 text-sm shadow-sm md:w-72">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search everything"
                  type="search"
                />
              </label>
              <button className="h-10 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90">
                New
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-auto px-5 py-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-3">
              {focusCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className={cn("mb-5 h-1.5 w-12 rounded-full", card.color)} />
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <p className="text-3xl font-semibold tracking-tight">{card.value}</p>
                    <p className="text-right text-xs text-muted-foreground">{card.helper}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Whiteboard flow</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sketch the next product sprint beside the tasks that move it forward.
                    </p>
                  </div>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                    Live canvas
                  </span>
                </div>

                <div className="mt-5 grid min-h-[360px] gap-3 rounded-2xl bg-[radial-gradient(circle_at_1px_1px,hsl(24_22%_84%)_1px,transparent_0)] [background-size:22px_22px] p-4 sm:grid-cols-3">
                  <div className="self-start rounded-2xl border border-coral-200 bg-coral-50 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-coral-900">Launch map</p>
                    <p className="mt-2 text-xs leading-5 text-coral-800">
                      Collect research, copy, and release tasks in one visual lane.
                    </p>
                  </div>
                  <div className="self-center rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-amber-950">Idea cluster</p>
                    <p className="mt-2 text-xs leading-5 text-amber-900">
                      Turn notes into template blocks the assistant can reuse.
                    </p>
                  </div>
                  <div className="self-end rounded-2xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
                    <p className="text-sm font-semibold text-teal-950">Next actions</p>
                    <p className="mt-2 text-xs leading-5 text-teal-900">
                      Ship the layout, wire navigation, then add persistence.
                    </p>
                  </div>
                </div>
              </section>

              <aside className="grid gap-5">
                <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm font-semibold">Today&apos;s board</p>
                  <div className="mt-4 space-y-3">
                    {["Draft AI template builder", "Review calendar sync", "Clean up task labels"].map(
                      (task, index) => (
                        <div
                          key={task}
                          className="flex items-center gap-3 rounded-2xl bg-secondary px-3 py-2.5"
                        >
                          <span className="grid size-6 place-items-center rounded-full bg-card text-xs font-semibold text-muted-foreground">
                            {index + 1}
                          </span>
                          <p className="text-sm">{task}</p>
                        </div>
                      )
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-violet-500" aria-hidden="true" />
                    <p className="text-sm font-semibold">Assistant note</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Your workspace is ready for connected pages, board objects, and AI-generated
                    templates once the core routes are added.
                  </p>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
