"use client";

import { ConfigProvider, ThemeConfig } from "antd";

export function ThemeConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeConfig: ThemeConfig = {
    components: {
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
      },
    },
  };

  return (
    <ConfigProvider
      theme={{
        ...themeConfig,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
