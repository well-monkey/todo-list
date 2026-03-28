"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Segmented, Tooltip } from "antd";
import { SunOutlined, MoonOutlined, DesktopOutlined } from "@ant-design/icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme = mounted ? theme : "system";

  const options = [
    { value: "light", icon: <SunOutlined />, label: t("light") },
    { value: "dark", icon: <MoonOutlined />, label: t("dark") },
    { value: "system", icon: <DesktopOutlined />, label: t("system") },
  ];

  return (
    <Segmented
      value={activeTheme}
      onChange={(v) => setTheme(v as string)}
      options={options.map(({ value, icon, label }) => ({
        value,
        label: (
          <Tooltip title={label}>
            {icon}
          </Tooltip>
        ),
      }))}
    />
  );
}
