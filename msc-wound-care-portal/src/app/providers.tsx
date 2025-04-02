"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="system"
        enableSystem={true}
        storageKey="msc-wound-care-theme"
      >
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
