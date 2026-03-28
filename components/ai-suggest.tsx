"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { Todo, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Suggestion {
  text: string;
  priority: Priority;
  reason: string;
}

interface AISuggestProps {
  todos: Todo[];
  onAdd: (text: string, priority: Priority) => void;
}

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export function AISuggest({ todos, onAdd }: AISuggestProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setAdded(new Set());
    try {
      const res = await fetch(`/${locale}/api/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingTodos: todos.map((t) => ({ text: t.text })),
          locale,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
    } catch {
      setError(t("ai.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (suggestion: Suggestion) => {
    onAdd(suggestion.text, suggestion.priority);
    setAdded((prev) => new Set(prev).add(suggestion.text));
  };

  return (
    <div className="rounded-xl border bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {t("ai.title")}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSuggestions}
          disabled={loading}
          className="h-7 text-xs border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/30"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Sparkles className="h-3 w-3 mr-1" />
          )}
          {loading ? t("ai.thinking") : t("ai.suggest")}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {suggestions.length > 0 && (
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className={cn(
                "flex items-start gap-2 rounded-lg border bg-background/80 px-3 py-2 text-sm transition-opacity",
                added.has(s.text) && "opacity-40"
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium leading-snug">{s.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {s.reason}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <Badge
                  variant="secondary"
                  className={cn("text-xs", priorityColors[s.priority])}
                >
                  {t(`priority.${s.priority}`)}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={added.has(s.text)}
                  onClick={() => handleAdd(s)}
                  aria-label={t("ai.addSuggestion")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && suggestions.length === 0 && !error && (
        <p className="text-xs text-muted-foreground text-center py-1">
          {t("ai.hint")}
        </p>
      )}
    </div>
  );
}
