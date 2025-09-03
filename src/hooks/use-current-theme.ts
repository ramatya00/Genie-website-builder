import { useTheme } from "next-themes";

export function useCurrentTheme() {
  const { theme, systemTheme } = useTheme();

  if (theme === "light" || theme === "dark") {
    return theme;
  }

  return systemTheme;
}
