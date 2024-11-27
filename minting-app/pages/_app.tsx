import "@/styles/globals.css";
import { MeshProvider } from "@meshsdk/react";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
	  <MeshProvider>{/* 
      <OracleProvider>
      <ReferenceProvider>
      <PageProvider> */}
        <Head>
          <title>Minting app</title>
        </Head>
		  <Component {...pageProps} />{/* 
        </PageProvider>
      </ReferenceProvider>
      </OracleProvider> */}
    </MeshProvider>
  );
}
