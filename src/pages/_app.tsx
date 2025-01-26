import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Lato } from 'next/font/google';

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={lato.className}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
