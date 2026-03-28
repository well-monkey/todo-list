"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

export function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = useRef(createCache());
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache.current, true) }}
    />
  ));
  return <StyleProvider cache={cache.current}>{children}</StyleProvider>;
}
