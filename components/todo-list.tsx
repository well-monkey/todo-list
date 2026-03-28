"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AddTodo } from "@/components/add-todo";
import { TodoItem } from "@/components/todo-item";
import { AISuggest } from "@/components/ai-suggest";
import { Todo, FilterType, Priority } from "@/lib/types";
import { CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "todo-list-items";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TodoList() {
  const t = useTranslations();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTodos(JSON.parse(stored));
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, mounted]);

  const addTodo = useCallback((text: string, priority: Priority) => {
    setTodos((prev) => [
      { id: generateId(), text, completed: false, priority, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((t) => !t.completed);
      case "completed":
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos]);

  const filters: FilterType[] = ["all", "active", "completed"];

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AddTodo onAdd={addTodo} />

      {/* AI Suggestions */}
      <AISuggest todos={todos} onAdd={addTodo} />

      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 rounded-lg border bg-muted p-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(`filter.${f}`)}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
            className="text-xs text-muted-foreground h-7"
          >
            {t("todo.clearCompleted")}
          </Button>
        )}
      </div>

      {/* Todo list */}
      {filteredTodos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
          <CheckSquare className="h-12 w-12 opacity-20" />
          <p className="text-sm">
            {todos.length === 0 ? t("todo.empty") : t("todo.emptyFiltered")}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}

      {/* Footer count */}
      {todos.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {activeCount === 1
            ? t("todo.itemsLeft", { count: activeCount })
            : t("todo.itemsLeftPlural", { count: activeCount })}
        </p>
      )}
    </div>
  );
}
