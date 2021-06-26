import React, { FC, useEffect, useState } from 'react';
import FormCalculate from '../../components/FormCalculate';
import { Radio } from 'antd';
import { useRouter } from 'next/router';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';

import css from './home.module.scss';

const stripeKey = 'pk_test_51J5s99AvELlGorryzt5EWFSzttRlABeINQqCWiNwfGqbjCOadYuLSmdSNZliwDmUoyJrHX8oP6c0Yhn8gUPMfV8T00kyyuRtOj';

const HomePage: FC = () => {
  const [value, setValue] = useState('en');
  const [show, setShow] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.push(`./?lang=${value}`);
  }, [value]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };
  const reload = () => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    })
  };

  return (
    <>
      <Radio.Group value={value} onChange={handleChange}>
        <Radio.Button value="en">en</Radio.Button>
        <Radio.Button value="de">de</Radio.Button>
      </Radio.Group>
      <div className={css.page}>
        {show && <>
          {/*
          // @ts-ignore */}
          <Elements options={{ locale: value }} key={value} stripe={loadStripe(stripeKey)}>
            <FormCalculate refresh={reload} />
          </Elements>
        </>}
      </div>
    </>
  );
};

export default HomePage;
