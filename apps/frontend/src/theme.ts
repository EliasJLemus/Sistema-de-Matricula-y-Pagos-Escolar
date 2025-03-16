import { createTheme } from "@mui/material";
import { createContext, useMemo, useState } from "react";

// Definir tokens de colores para los modos claro y oscuro
export const tokens = (mode: "light" | "dark") => ({
  grey: {
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
  },
  primary: mode === "dark"
    ? {
        100: "#d0d1d5",
        200: "#a1a4ab",
        300: "#727681",
        400: "#434957",
        500: "#141b2d",
        600: "#101624",
        700: "#0c101b",
        800: "#080b12",
        900: "#040509",
      }
    : {
        100: "#ffffff",
        200: "#f5f5f5",
        300: "#e0e0e0",
        400: "#d6d6d6",
        500: "#cccccc",
        600: "#b3b3b3",
        700: "#999999",
        800: "#808080",
        900: "#666666",
      },
  redAccent: {
    100: "#f8dcdb",
    200: "#f1b9b7",
    300: "#e99592",
    400: "#e2726e",
    500: "#db4f4a",
    600: "#af3f3b",
    700: "#832f2c",
    800: "#58201e",
    900: "#2c100f",
  },
  blueAccent: {
    100: "#e1e2fe",
    200: "#c3c6fd",
    300: "#a4a9fc",
    400: "#868dfb",
    500: "#6870fa",
    600: "#535ac8",
    700: "#3e4396",
    800: "#2a2d64",
    900: "#151632",
  },
});

// Crear tema de Material UI basado en el modo
export const themeSettings = (mode: "light" | "dark") => {
  const colors = tokens(mode); // Obtiene los colores según el modo

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.blueAccent[500],
      },
      common: {
        black: colors.grey[700],
        white: colors.grey[500],
      },
      background: {
        default: mode === "dark" ? colors.primary[900] : colors.primary[100], // Ajusta según modo
        paper: mode === "dark" ? colors.primary[800] : colors.primary[200],
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      fontSize: 12,
      h1: {
        fontFamily: "Roboto, sans-serif",
        fontSize: 40,
      },
    },
  });
};

// Contexto para el modo de color
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// Hook para manejar el tema
export const useMode = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [setMode]
  );

  const theme = useMemo(() => themeSettings(mode), [mode]);

  return [theme, colorMode] as const;
};
