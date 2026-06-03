"use client";

import {
  AlarmClock,
  Bot,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  GripVertical,
  LayoutDashboard,
  LibraryBig,
  NotebookTabs,
  Palette,
  Plus,
  Search,
  Settings,
  Sparkles,
  Stars,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ViewMode = "month" | "week";
type TaskType = "task" | "reminder";
type DragPayload =
  | { source: "draft"; id: string }
  | { source: "scheduled"; id: string; fromDate: string };

type CategoryKey = "focus" | "meeting" | "personal" | "admin";

type CalendarTask = {
  id: string;
  title: string;
  notes: string;
  type: TaskType;
  category: CategoryKey;
  time: string;
  dateKey?: string;
};

type TaskForm = Omit<CalendarTask, "id" | "dateKey">;

const navGroups = [
  {
    label: "Workspace",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        color: "text-coral-500",
        bg: "bg-coral-100",
      },
      {
        label: "AI Assistant",
        href: "#",
        icon: Bot,
        color: "text-violet-500",
        bg: "bg-violet-100",
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: CalendarDays,
        color: "text-sky-500",
        bg: "bg-sky-100",
        active: true,
      },
      {
        label: "Task / Kanban",
        href: "#",
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
        href: "#",
        icon: NotebookTabs,
        color: "text-amber-500",
        bg: "bg-amber-100",
      },
      {
        label: "Whiteboard",
        href: "#",
        icon: Palette,
        color: "text-emerald-500",
        bg: "bg-emerald-100",
      },
      {
        label: "Pages / Spaces",
        href: "#",
        icon: LibraryBig,
        color: "text-rose-500",
        bg: "bg-rose-100",
      },
      {
        label: "AI Template Builder",
        href: "#",
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
        href: "#",
        icon: Settings,
        color: "text-slate-500",
        bg: "bg-slate-100",
      },
    ],
  },
];

const categories: Record<
  CategoryKey,
  {
    label: string;
    dot: string;
    chip: string;
    border: string;
  }
> = {
  focus: {
    label: "Deep Work",
    dot: "bg-coral-400",
    chip: "bg-coral-50 text-coral-800",
    border: "border-l-coral-400",
  },
  meeting: {
    label: "Meeting",
    dot: "bg-sky-400",
    chip: "bg-sky-50 text-sky-800",
    border: "border-l-sky-400",
  },
  personal: {
    label: "Personal",
    dot: "bg-teal-400",
    chip: "bg-teal-50 text-teal-800",
    border: "border-l-teal-400",
  },
  admin: {
    label: "Admin",
    dot: "bg-amber-400",
    chip: "bg-amber-50 text-amber-900",
    border: "border-l-amber-400",
  },
};

const seedTasks: CalendarTask[] = [
  {
    id: "task-1",
    title: "Review calendar sync",
    notes: "Check empty, busy, and reminder states.",
    type: "task",
    category: "focus",
    time: "10:30",
    dateKey: toDateKey(new Date()),
  },
  {
    id: "task-2",
    title: "Send standup reminder",
    notes: "Nudge the product channel.",
    type: "reminder",
    category: "meeting",
    time: "09:15",
    dateKey: toDateKey(new Date()),
  },
];

const seedDrafts: CalendarTask[] = [
  {
    id: "draft-1",
    title: "Plan launch notes",
    notes: "Add once the release date is settled.",
    type: "task",
    category: "admin",
    time: "",
  },
  {
    id: "draft-2",
    title: "Pick focus block",
    notes: "Drag into a quiet morning.",
    type: "reminder",
    category: "personal",
    time: "",
  },
];

const emptyForm: TaskForm = {
  title: "",
  notes: "",
  type: "task",
  category: "focus",
  time: "",
};

const weekDayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthDays(date: Date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function getWeekDays(date: Date) {
  const start = startOfDay(date);
  start.setDate(start.getDate() - start.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

export default function CalendarPage() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [visibleDate, setVisibleDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [scheduledTasks, setScheduledTasks] = useState<CalendarTask[]>(seedTasks);
  const [draftTasks, setDraftTasks] = useState<CalendarTask[]>(seedDrafts);
  const [dialogTarget, setDialogTarget] = useState<"draft" | "date" | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm);

  const visibleDays = useMemo(
    () => (viewMode === "month" ? getMonthDays(visibleDate) : getWeekDays(selectedDate)),
    [selectedDate, viewMode, visibleDate]
  );
  const selectedDateKey = toDateKey(selectedDate);

  const tasksByDate = useMemo(() => {
    return scheduledTasks.reduce<Record<string, CalendarTask[]>>((grouped, task) => {
      if (!task.dateKey) {
        return grouped;
      }

      grouped[task.dateKey] = [...(grouped[task.dateKey] ?? []), task];
      return grouped;
    }, {});
  }, [scheduledTasks]);

  function movePeriod(direction: -1 | 1) {
    if (viewMode === "month") {
      setVisibleDate((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
      return;
    }

    setSelectedDate((current) => {
      const nextDate = new Date(current);
      nextDate.setDate(current.getDate() + direction * 7);
      setVisibleDate(nextDate);
      return nextDate;
    });
  }

  function openTaskDialog(target: "draft" | "date", date = selectedDate) {
    setSelectedDate(date);
    setForm(emptyForm);
    setEditingTaskId(null);
    setDialogTarget(target);
  }

  function openEditTaskDialog(task: CalendarTask) {
    if (task.dateKey) {
      setSelectedDate(new Date(`${task.dateKey}T00:00:00`));
    }

    setForm({
      title: task.title,
      notes: task.notes,
      type: task.type,
      category: task.category,
      time: task.time,
    });
    setEditingTaskId(task.id);
    setDialogTarget("date");
  }

  function closeTaskDialog() {
    setDialogTarget(null);
    setEditingTaskId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = form.title.trim();
    if (!trimmedTitle || !dialogTarget) {
      return;
    }

    if (editingTaskId) {
      setScheduledTasks((tasks) =>
        tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                ...form,
                title: trimmedTitle,
                notes: form.notes.trim(),
                dateKey: selectedDateKey,
              }
            : task
        )
      );
      closeTaskDialog();
      return;
    }

    const newTask: CalendarTask = {
      ...form,
      id: `${dialogTarget}-${Date.now()}`,
      title: trimmedTitle,
      notes: form.notes.trim(),
      dateKey: dialogTarget === "date" ? selectedDateKey : undefined,
    };

    if (dialogTarget === "date") {
      setScheduledTasks((tasks) => [...tasks, newTask]);
    } else {
      setDraftTasks((tasks) => [...tasks, newTask]);
    }

    closeTaskDialog();
  }

  function handleDragStart(task: CalendarTask, source: "draft" | "scheduled") {
    return (event: React.DragEvent<HTMLElement>) => {
      const payload: DragPayload =
        source === "draft"
          ? { source: "draft", id: task.id }
          : { source: "scheduled", id: task.id, fromDate: task.dateKey ?? "" };

      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(payload));
      event.dataTransfer.setData("text/plain", JSON.stringify(payload));
    };
  }

  function handleDropOnDate(date: Date) {
    return (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const rawPayload =
        event.dataTransfer.getData("application/json") || event.dataTransfer.getData("text/plain");
      if (!rawPayload) {
        return;
      }

      let payload: DragPayload;
      try {
        payload = JSON.parse(rawPayload) as DragPayload;
      } catch {
        return;
      }

      const dateKey = toDateKey(date);

      if (payload.source === "draft") {
        const draftTask = draftTasks.find((task) => task.id === payload.id);
        if (!draftTask) {
          return;
        }

        setDraftTasks((tasks) => tasks.filter((task) => task.id !== payload.id));
        setScheduledTasks((tasks) => [...tasks, { ...draftTask, dateKey }]);
        return;
      }

      setScheduledTasks((tasks) =>
        tasks.map((task) => (task.id === payload.id ? { ...task, dateKey } : task))
      );
    };
  }

  const monthTasks = scheduledTasks.filter((task) => {
    if (!task.dateKey) {
      return false;
    }

    const taskDate = new Date(`${task.dateKey}T00:00:00`);
    return (
      taskDate.getMonth() === visibleDate.getMonth() &&
      taskDate.getFullYear() === visibleDate.getFullYear()
    );
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,hsl(42_86%_97%),hsl(176_76%_95%)_48%,hsl(12_100%_97%))] text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "hidden shrink-0 flex-col overflow-hidden border-r border-border/80 bg-sidebar/90 px-3 py-4 shadow-[12px_0_40px_rgba(69,54,38,0.06)] backdrop-blur transition-[width] duration-300 ease-out sm:flex",
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

          <nav className="mt-4 flex flex-1 flex-col gap-3" aria-label="Calendar navigation">
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
                      <Link
                        key={item.label}
                        href={item.href}
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
                      </Link>
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
          <header className="flex flex-col gap-4 border-b border-border/80 bg-background/75 px-4 py-4 backdrop-blur md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Calendar
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-foreground">
                Schedule the work, keep the loose ideas nearby.
              </h1>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <label className="hidden h-10 min-w-0 flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 text-sm shadow-sm md:flex md:w-72">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Search calendar"
                  type="search"
                />
              </label>
              <button
                type="button"
                onClick={() => openTaskDialog("date")}
                className="flex h-10 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Plus className="size-4" aria-hidden="true" />
                New
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-auto px-4 py-5 lg:px-8">
            <div className="grid min-h-full gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <section className="min-w-0 rounded-3xl border border-border bg-card p-3 shadow-sm sm:p-5">
                <div className="flex flex-col gap-3 border-b border-border/70 pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {viewMode === "month"
                        ? `${monthTasks.length} scheduled this month`
                        : `${visibleDays.reduce((count, day) => count + (tasksByDate[toDateKey(day)]?.length ?? 0), 0)} scheduled this week`}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-foreground">{formatMonth(visibleDate)}</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex rounded-2xl border border-border bg-background p-1 shadow-sm">
                      {(["month", "week"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setViewMode(mode)}
                          className={cn(
                            "h-8 rounded-xl px-3 text-xs font-semibold capitalize transition",
                            viewMode === mode
                              ? "bg-card text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={viewMode === "month" ? "Previous month" : "Previous week"}
                        onClick={() => movePeriod(-1)}
                        className="grid size-9 place-items-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/30 hover:text-foreground"
                      >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={viewMode === "month" ? "Next month" : "Next week"}
                        onClick={() => movePeriod(1)}
                        className="grid size-9 place-items-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm transition hover:border-primary/30 hover:text-foreground"
                      >
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {weekDayLabels.map((label) => (
                    <div key={label} className="py-1">
                      {label}
                    </div>
                  ))}
                </div>

                <div
                  className={cn(
                    "mt-2 grid grid-cols-7 gap-2",
                    viewMode === "month" ? "auto-rows-[minmax(112px,1fr)]" : "auto-rows-[minmax(430px,1fr)]"
                  )}
                >
                  {visibleDays.map((day) => {
                    const dateKey = toDateKey(day);
                    const dayTasks = tasksByDate[dateKey] ?? [];
                    const isOutsideMonth = day.getMonth() !== visibleDate.getMonth();
                    const isSelected = dateKey === selectedDateKey;
                    const isToday = dateKey === toDateKey(today);

                    return (
                      <div
                        key={dateKey}
                        onClick={() => setSelectedDate(day)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDropOnDate(day)}
                        className={cn(
                          "group flex min-w-0 flex-col rounded-2xl border bg-background/75 p-2 transition hover:border-primary/40 hover:bg-card",
                          isOutsideMonth && viewMode === "month" && "bg-muted/30 text-muted-foreground",
                          isSelected ? "border-primary/50 shadow-sm" : "border-border",
                          viewMode === "week" && "min-h-[430px]"
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              openTaskDialog("date", day);
                            }}
                            className={cn(
                              "grid size-7 place-items-center rounded-full text-xs font-semibold transition",
                              isToday
                                ? "bg-primary text-primary-foreground"
                                : isSelected
                                  ? "bg-secondary text-secondary-foreground"
                                  : "text-foreground group-hover:bg-secondary"
                            )}
                          >
                            {day.getDate()}
                          </button>
                          <button
                            type="button"
                            aria-label={`Add task on ${formatShortDate(day)}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              openTaskDialog("date", day);
                            }}
                            className="grid size-7 place-items-center rounded-full text-muted-foreground opacity-0 transition hover:bg-secondary hover:text-foreground group-hover:opacity-100 focus:opacity-100"
                          >
                            <Plus className="size-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5 overflow-hidden">
                          {dayTasks.slice(0, viewMode === "month" ? 3 : 12).map((task) => (
                            <TaskPill
                              key={task.id}
                              task={task}
                              draggable
                              onClick={() => openEditTaskDialog(task)}
                              onDragStart={handleDragStart(task, "scheduled")}
                            />
                          ))}
                          {dayTasks.length > (viewMode === "month" ? 3 : 12) && (
                            <p className="rounded-full bg-muted px-2 py-1 text-[0.65rem] font-semibold text-muted-foreground">
                              +{dayTasks.length - (viewMode === "month" ? 3 : 12)} more
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <aside className="min-w-0 space-y-5 xl:sticky xl:top-5 xl:self-start">
                <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">Draft Task Panel</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Save unscheduled tasks here, then drag them onto the calendar.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openTaskDialog("draft")}
                      className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition hover:bg-primary/90"
                      aria-label="Add draft task"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4 min-h-36 space-y-3 rounded-2xl border border-dashed border-border bg-background/70 p-3">
                    {draftTasks.length === 0 ? (
                      <div className="grid min-h-28 place-items-center text-center text-sm text-muted-foreground">
                        Drafts you save for later will wait here.
                      </div>
                    ) : (
                      draftTasks.map((task) => (
                        <DraftCard
                          key={task.id}
                          task={task}
                          onDragStart={handleDragStart(task, "draft")}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm font-semibold">{formatShortDate(selectedDate)}</p>
                  <div className="mt-4 space-y-3">
                    {(tasksByDate[selectedDateKey] ?? []).length === 0 ? (
                      <p className="rounded-2xl bg-secondary px-3 py-3 text-sm text-muted-foreground">
                        Nothing scheduled yet.
                      </p>
                    ) : (
                      (tasksByDate[selectedDateKey] ?? []).map((task) => (
                        <TaskPill
                          key={task.id}
                          task={task}
                          draggable
                          roomy
                          onClick={() => openEditTaskDialog(task)}
                          onDragStart={handleDragStart(task, "scheduled")}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm font-semibold">Category Colors</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {Object.entries(categories).map(([key, category]) => (
                      <div key={key} className="flex items-center gap-2 rounded-2xl bg-background px-3 py-2">
                        <span className={cn("size-2.5 rounded-full", category.dot)} />
                        <span className="min-w-0 truncate text-xs font-medium text-muted-foreground">
                          {category.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {dialogTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-3xl border border-border bg-card p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">
                  {editingTaskId
                    ? "Edit Task"
                    : dialogTarget === "date"
                      ? `Add to ${formatShortDate(selectedDate)}`
                      : "Save Draft Task"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tasks and reminders keep their category color wherever they move.
                </p>
              </div>
              <button
                type="button"
                onClick={closeTaskDialog}
                className="grid size-8 shrink-0 place-items-center rounded-2xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-1.5 text-sm font-medium">
                Title
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  required
                  className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
                  placeholder="Write a quick task or reminder"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm font-medium">
                  Type
                  <select
                    value={form.type}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, type: event.target.value as TaskType }))
                    }
                    className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
                  >
                    <option value="task">Task</option>
                    <option value="reminder">Reminder</option>
                  </select>
                </label>

                <label className="grid gap-1.5 text-sm font-medium">
                  Time
                  <input
                    value={form.time}
                    onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))}
                    type="time"
                    className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
                  />
                </label>
              </div>

              <label className="grid gap-1.5 text-sm font-medium">
                Task category
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value as CategoryKey }))
                  }
                  className="h-10 rounded-2xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary"
                >
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-wrap gap-2">
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, category: key as CategoryKey }))}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold transition",
                      form.category === key ? "border-primary bg-secondary text-foreground" : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    <span className={cn("size-2.5 rounded-full", category.dot)} />
                    {category.label}
                  </button>
                ))}
              </div>

              <label className="grid gap-1.5 text-sm font-medium">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  className="min-h-24 resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
                  placeholder="Optional details"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeTaskDialog}
                className="h-10 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                {editingTaskId ? "Save changes" : dialogTarget === "date" ? "Add to date" : "Save draft"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function TaskPill({
  task,
  draggable,
  roomy,
  onClick,
  onDragStart,
}: {
  task: CalendarTask;
  draggable?: boolean;
  roomy?: boolean;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
}) {
  const category = categories[task.category];

  return (
    <button
      type="button"
      draggable={draggable}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onDragStart={onDragStart}
      className={cn(
        "w-full cursor-grab rounded-xl border border-border bg-card px-2 py-1.5 text-left shadow-sm transition hover:border-primary/40 active:cursor-grabbing",
        "border-l-4",
        category.border,
        roomy && "px-3 py-2"
      )}
      aria-label={`Edit ${task.title}`}
      title="Click to edit, drag to reschedule"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        {task.type === "reminder" ? (
          <AlarmClock className="size-3 shrink-0 text-sky-600" aria-hidden="true" />
        ) : (
          <span className={cn("size-2 shrink-0 rounded-full", category.dot)} />
        )}
        <p className="min-w-0 truncate text-[0.72rem] font-semibold text-foreground">{task.title}</p>
      </div>
      {(task.time || roomy) && (
        <p className="mt-1 truncate text-[0.65rem] font-medium text-muted-foreground">
          {task.time ? task.time : "Any time"} · {task.type === "task" ? "Task" : "Reminder"}
        </p>
      )}
    </button>
  );
}

function DraftCard({
  task,
  onDragStart,
}: {
  task: CalendarTask;
  onDragStart: (event: React.DragEvent<HTMLElement>) => void;
}) {
  const category = categories[task.category];

  return (
    <article
      draggable
      onDragStart={onDragStart}
      className={cn(
        "cursor-grab rounded-2xl border border-l-4 bg-card p-3 shadow-sm transition hover:border-primary/40 active:cursor-grabbing",
        category.border
      )}
      title="Drag onto a calendar date"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{task.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{task.notes}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={cn("rounded-full px-2 py-1 text-[0.65rem] font-bold", category.chip)}>
              {category.label}
            </span>
            <span className="rounded-full bg-muted px-2 py-1 text-[0.65rem] font-bold text-muted-foreground">
              {task.type === "task" ? "Task" : "Reminder"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
