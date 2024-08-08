import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initGA, logPageView } from '../lib/analytics';


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Google Analytics
    initGA("G-FLRTEXZ5XH");

    // Log page views
    logPageView();

    // Log page views on route changes
    const handleRouteChange = () => logPageView();
    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup event listener on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}
