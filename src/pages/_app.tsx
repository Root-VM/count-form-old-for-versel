import { AppProps } from 'next/app';
import 'normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/common.scss';
import Head from 'next/head';
import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        {/*<link rel="shortcut icon" href="/static/img/favicon.svg" type="image/x-icon" />*/}
        <title>Word-Count</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Elements stripe={loadStripe('pk_test_51J5RtSDgcFJAf3LSUWpMGGMJAX5XpjEvdqrtoDpKfiwPvDjJoY91T9Fqw99I7ZY5mWak1uRSJC84XuKn0HNUt4DA00XMtOKbaY')}>
        <Component {...pageProps} />
      </Elements>
    </>
  );
};

export default App;
