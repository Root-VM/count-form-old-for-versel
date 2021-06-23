import { AppProps } from 'next/app';
import 'normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/common.scss';
import Head from 'next/head';
import * as React from 'react';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        {/*<link rel="shortcut icon" href="/static/img/favicon.svg" type="image/x-icon" />*/}
        <title>Word-Count</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Component {...pageProps} />
    </>
  );
};

export default App;
