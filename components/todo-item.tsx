"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Todo, Priority } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const t = useTranslations("priority");

  return (
    <li className="group flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-xs transition-colors hover:bg-accent/30">
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="shrink-0"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          "flex-1 cursor-pointer text-sm leading-relaxed",
          todo.completed && "line-through text-muted-foreground"
        )}
      >
        {todo.text}
      </label>
      <Badge
        variant="secondary"
        className={cn("shrink-0 text-xs capitalize", priorityColors[todo.priority])}
      >
        {t(todo.priority)}
      </Badge>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
        aria-label="Delete"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </li>
  );
}
