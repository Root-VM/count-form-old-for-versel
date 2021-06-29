import React, { FC, useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from 'next/router';
import { Radio } from 'antd';
import FormCalculate from '../FormCalculate';
import css from './form-calculate-wrap.module.scss';

const stripeKey = 'pk_test_51J5s99AvELlGorryzt5EWFSzttRlABeINQqCWiNwfGqbjCOadYuLSmdSNZliwDmUoyJrHX8oP6c0Yhn8gUPMfV8T00kyyuRtOj';

const FormCalculateWrap: FC = () => {
  const [value, setValue] = useState<any>('en');
  const [show, setShow] = useState(true);
  const [colors, setColors] = useState({main: 'D31F3A', secondary: '616d74'});
  const [firstLoading, seFirstLoading] = useState(true);
  const router = useRouter();

  const getRouteProps = async () => {
    if(firstLoading && router.query?.lang) {
      setValue(router.query.lang);
      seFirstLoading(false);
    }

    if(router.query?.mainColor && router.query?.secondaryColor){
      await setColors({main: String(router.query.mainColor),secondary: String(router.query.secondaryColor)});
      reload()
    }
  };

  useEffect(() => {
    getRouteProps()
  }, [router]);

  const handleChange = (e: any) => {
    router.push(`./?lang=${e.target.value}&mainColor=${router.query?.mainColor ? router.query.mainColor : 'D31F3A'}&secondaryColor=${router.query?.secondaryColor ? router.query.secondaryColor : '616d74'}`);
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

      {show && <div className={css.wrap}>
        {/*
          // @ts-ignore */}
        <Elements options={{ locale: value }} key={value} stripe={loadStripe(stripeKey)}>
          <FormCalculate refresh={() => {reload()}} mainColor={'#'+colors.main} secondaryColor={'#'+colors.secondary}/>
        </Elements>

      </div>}
    </>
  );
};

export default FormCalculateWrap;
