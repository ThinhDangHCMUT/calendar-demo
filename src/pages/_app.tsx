import type { AppProps } from "next/app";
import { ThemeConfigProvider } from "@/themes";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeConfigProvider>
      <Component {...pageProps} />
    </ThemeConfigProvider>
  );
}
