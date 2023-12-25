import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import App from "./components/App/App";
import { ResultsContextProvider } from "./contexts/results/results";
import { CurrentUserContextProvider } from "./contexts/currentUser/currentUser";
import { AnalyticsContextProvider } from "./contexts/analytics/analytics";

export const BG_COLOR = {
  dark: "#2D3C4C",
  light: "white",
};

export const PIXELS_PER_INCREMENT = 4;

const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors: {
    "chakra-body-text": { _light: "gray.900", _dark: "whiteAlpha.900" },
    "chakra-body-bg": { _light: BG_COLOR.light, _dark: BG_COLOR.dark },
    "chakra-border-color": { _light: "gray.200", _dark: "whiteAlpha.300" },
    "chakra-subtle-bg": { _light: "gray.100", _dark: "gray.700" },
    "chakra-placeholder-color": { _light: "gray.500", _dark: "whiteAlpha.400" },
    error: "red.500",
    success: "green.500",
    secondary: {
      default: "purple.800",
      _dark: "purple.600",
    },
    blue: {
      900: "#092F9F",
      800: "#2246AA",
      700: "#3A5CB4",
      600: "#5373BF",
      500: "#6B89C9",
      400: "#84A0D4",
      300: "#9CB6DE",
      200: "#B5CDE9",
      100: "#CDE3F3",
      50: "#E6FAFE",
    },
    gray: {
      900: "#152536",
      800: BG_COLOR.dark,
      700: "#455362",
      600: "#5E6978",
      500: "#76808E",
      400: "#8E97A5",
      300: "#A6AEBB",
      200: "#BFC4D1",
      100: "#D7DBE7",
      50: "#EFF2FD",
    },
    purple: {
      900: "#4D00CC",
      800: "#5812D7",
      700: "#6225E2",
      600: "#6D37ED",
      500: "#7749F8",
      400: "#8F6AF9",
      300: "#A78BFB",
      200: "#BFABFC",
      100: "#D7CCFE",
      50: "#EFEDFF",
    },
    red: {
      900: "#F0470A",
      800: "#F25823",
      700: "#F36A3C",
      600: "#F57B55",
      500: "#F78D6E",
      400: "#F89E86",
      300: "#FAB09F",
      200: "#FCC1B8",
      100: "#FDD3D1",
      50: "#FFE4EA",
    },
    green: {
      900: "#08C73B",
      800: "#1ACD4D",
      700: "#2CD35F",
      600: "#3DDA70",
      500: "#4FE082",
      400: "#61E694",
      300: "#73ECA6",
      200: "#84F3B7",
      100: "#96F9C9",
      50: "#A8FFDB",
    },
  },
  fonts: {
    heading: `Schibsted Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    body: `Schibsted Grotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    mono: `SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
  },
});

const Popup = () => {
  return (
    <React.StrictMode>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <CurrentUserContextProvider>
          <AnalyticsContextProvider>
            <ResultsContextProvider>
              <App />
            </ResultsContextProvider>
          </AnalyticsContextProvider>
        </CurrentUserContextProvider>
      </ChakraProvider>
    </React.StrictMode>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
