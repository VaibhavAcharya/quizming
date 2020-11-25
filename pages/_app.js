import Head from "next/head";
import { CssBaseline, GeistProvider } from "@geist-ui/react";
import { UserProvider } from "../components/firebase/UserContext";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GeistProvider theme={{ type: "dark" }}>
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
          <title>Quiz Ming</title>
        </Head>

        <CssBaseline />

        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </GeistProvider>
    </>
  );
}

export default MyApp;
