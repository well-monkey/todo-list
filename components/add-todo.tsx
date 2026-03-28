"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Priority } from "@/lib/types";

interface AddTodoProps {
  onAdd: (text: string, priority: Priority) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const t = useTranslations();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("input.placeholder")}
        className="flex-1"
        autoFocus
      />
      <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
        <SelectTrigger className="w-28 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">{t("priority.low")}</SelectItem>
          <SelectItem value="medium">{t("priority.medium")}</SelectItem>
          <SelectItem value="high">{t("priority.high")}</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit" disabled={!text.trim()} className="shrink-0 gap-1">
        <Plus className="h-4 w-4" />
        {t("input.add")}
      </Button>
    </form>
  );
}
