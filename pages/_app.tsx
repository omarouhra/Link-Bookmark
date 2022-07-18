import "../styles/globals.css";
import Layout from "../components/Layout";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps, session }) {
 
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
