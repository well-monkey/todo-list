"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
