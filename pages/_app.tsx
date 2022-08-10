import "../styles/globals.css";
import type { AppProps } from "next/app";
import NoSSRWrapper from "utils/ssr";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NoSSRWrapper>
      <Component {...pageProps} />
    </NoSSRWrapper>
  );
}

export default MyApp;
