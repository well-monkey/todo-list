"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Priority } from "@/lib/types";

interface AddTodoProps {
  onAdd: (text: string, priority: Priority) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const t = useTranslations();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority);
    setText("");
  };

  const priorityOptions = [
    { value: "low", label: t("priority.low") },
    { value: "medium", label: t("priority.medium") },
    { value: "high", label: t("priority.high") },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("input.placeholder")}
        className="flex-1"
        autoFocus
      />
      <Select
        value={priority}
        onChange={(v) => setPriority(v as Priority)}
        options={priorityOptions}
        style={{ width: 112 }}
      />
      <Button
        type="primary"
        htmlType="submit"
        disabled={!text.trim()}
        icon={<PlusOutlined />}
      >
        {t("input.add")}
      </Button>
    </form>
  );
}
