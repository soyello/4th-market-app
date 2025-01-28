import Navbar from '@/components/Navbar';
import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Lato } from 'next/font/google';
import Script from 'next/script';
import { useState } from 'react';

const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700'] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  return (
    <SessionProvider session={session}>
      <div className={lato.className}>
        <Navbar />
        <Component {...pageProps} isKakaoLoaded={isKakaoLoaded} />
        <Script
          src='//dapi.kakao.com/v2/maps/sdk.js?appkey=9268d3bcf6b80dc4ae2dd0de7e26caab&libraries=services,clusterer&autoload=false'
          strategy='lazyOnload'
          onLoad={() => setIsKakaoLoaded(true)}
        />
      </div>
    </SessionProvider>
  );
}
