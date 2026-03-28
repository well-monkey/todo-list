"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, Button, Tag, Typography, Space } from "antd";
import { BulbOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Todo, Priority } from "@/lib/types";

const { Text } = Typography;

interface Suggestion {
  text: string;
  priority: Priority;
  reason: string;
}

interface AISuggestProps {
  todos: Todo[];
  onAdd: (text: string, priority: Priority) => void;
}

const priorityColor: Record<Priority, string> = {
  low: "blue",
  medium: "gold",
  high: "red",
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
    <Card
      size="small"
      styles={{ body: { padding: "12px 16px" } }}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Space size="small">
            <BulbOutlined style={{ color: "#7c3aed" }} />
            <Text strong style={{ color: "#7c3aed" }}>
              {t("ai.title")}
            </Text>
          </Space>
          <Button
            size="small"
            loading={loading}
            icon={loading ? <LoadingOutlined /> : <BulbOutlined />}
            onClick={fetchSuggestions}
          >
            {loading ? t("ai.thinking") : t("ai.suggest")}
          </Button>
        </div>

        {/* Error */}
        {error && <Text type="danger" className="text-xs">{error}</Text>}

        {/* Suggestions list */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-2">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 rounded-lg border border-solid p-3 transition-opacity ${added.has(s.text) ? "opacity-40" : ""}`}
                style={{ borderColor: "var(--ant-color-border, #d9d9d9)" }}
              >
                <div className="flex-1 min-w-0">
                  <Text className="text-sm font-medium leading-snug block">{s.text}</Text>
                  <Text type="secondary" className="text-xs block mt-0.5 leading-relaxed">
                    {s.reason}
                  </Text>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  <Tag color={priorityColor[s.priority]}>
                    {t(`priority.${s.priority}`)}
                  </Tag>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusOutlined />}
                    disabled={added.has(s.text)}
                    onClick={() => handleAdd(s)}
                    aria-label={t("ai.addSuggestion")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hint */}
        {!loading && suggestions.length === 0 && !error && (
          <Text type="secondary" className="text-xs text-center block py-1">
            {t("ai.hint")}
          </Text>
        )}
      </div>
    </Card>
  );
}
