"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid hydration mismatch — don't render active state until mounted
  const activeTheme = mounted ? theme : undefined;

  const themes = [
    { value: "light", icon: Sun, label: t("light") },
    { value: "dark", icon: Moon, label: t("dark") },
    { value: "system", icon: Monitor, label: t("system") },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={activeTheme === value ? "default" : "ghost"}
          size="sm"
          onClick={() => setTheme(value)}
          className="h-7 px-2 text-xs gap-1"
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </Button>
      ))}
    </div>
  );
}
