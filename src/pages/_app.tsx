import { AppProps } from 'next/app';
import 'normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/common.scss';
import Head from 'next/head';
import * as React from 'react';
import { LanguageProvider } from '../widgets/FormCalculateWrap/common/language-provider';
import { ToastContainer } from 'react-toastify';

const App = ({ Component, pageProps }: AppProps) => {

  return (
    <>
      <Head>
        <title>Word-Count</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <LanguageProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </LanguageProvider>
    </>
  );
};

export default App;
