"use client";

import { useTranslations } from "next-intl";
import { Checkbox, Tag, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Todo, Priority } from "@/lib/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityColor: Record<Priority, string> = {
  low: "blue",
  medium: "gold",
  high: "red",
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const t = useTranslations("priority");

  return (
    <li className="flex items-center gap-3 px-4 py-3 rounded-lg border border-solid group transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{ borderColor: "var(--ant-color-border, #d9d9d9)" }}>
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="shrink-0"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 cursor-pointer text-sm leading-relaxed ${todo.completed ? "line-through opacity-40" : ""}`}
      >
        {todo.text}
      </label>
      <Tag color={priorityColor[todo.priority]} className="shrink-0 capitalize">
        {t(todo.priority)}
      </Tag>
      <Button
        type="text"
        danger
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => onDelete(todo.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete"
      />
    </li>
  );
}
