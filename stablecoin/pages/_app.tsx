import { OracleProvider } from "@/context/OracleContext";
import { PageProvider } from "@/context/PageContext";
import { ReferenceProvider } from "@/context/ReferenceContext";
import "@/styles/globals.css";
import { MeshProvider } from "@meshsdk/react";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <OracleProvider>
      <ReferenceProvider>
      <PageProvider>
        <Head>
          <link rel="icon" href="/Euro.png" />
          <title>IOG Euro Stablecoin</title>
        </Head>
        <Component {...pageProps} />
        </PageProvider>
      </ReferenceProvider>
      </OracleProvider>
    </MeshProvider>
  );
}
