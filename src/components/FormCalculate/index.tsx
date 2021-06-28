import React, { FC, useEffect, useState } from 'react';
import FileUpload from './FilesUpload';
import classNames from 'classnames';
import { DatePicker, Input, TreeSelect, Form, Checkbox, Button, Spin } from 'antd';
import moment from 'moment';
import { FormInstance } from 'antd/lib/form';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import css from './form-calculate.module.scss';
import useTranslation from '../../common/translation';
import { useRouter } from 'next/router';
import { getLanguages } from '../../api/general';
import { alertSuccess } from '../../common/alert';

const tProps = {
  treeDefaultExpandAll: false,
  dropdownStyle: { maxHeight: 400, overflow: 'auto' },
  style: { width: '100%' }
};

const cardOptions = {
  style: {
    base: {
      color: 'rgba(0, 0, 0, 0.7)',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      '::placeholder': {
        fontSize: '14px',
        color: 'rgba(0, 0, 0, 0.4)',
      },
    }
  }
};

const FormCalculate: FC<{refresh: any, mainColor: string, secondaryColor: string}> = (props) => {
  const {refresh, mainColor, secondaryColor} = props;
  const [firstStepData, seFirstStepData] = useState({
    lngFrom: 'en',
    lngTo: 'de',
    service: 'Translation',
    files: '',
    date: moment().add(1,'days').set({h: 12, m: 0})
  });
  const [filesData, setFilesData] = useState<{files: boolean, price: number, count: number, strKey: string}>
  ({files: false, price: 0, count: 0, strKey: ''});
  const [languageData, setLanguageData] = useState<any>([]);
  const [languageDataServer, setLanguageDataServer] = useState<any>([]);
  const [isFistStep, setFistStep] = useState(true);
  const [fistStepEmitted, setFistStepEmitted] = useState(false);
  const [showService, setShowService] = useState(false);
  const formRef = React.createRef<FormInstance>();
  const [checked, setChecked] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pricePerWord, setPricePerWord] = useState(0);
  const { t } = useTranslation();
  const router = useRouter();

  const subjectAreaData = [
    {value:'Translation', title: router.query?.lang !== 'de' ? 'Translation (inkl. Revision)' : 'Übersetzung (inkl. Revision)'},
    {value:'Proofreading', title: router.query?.lang !== 'de' ? 'Proofreading' : 'Korrektur'},
  ];

  const onCheckboxChange = async (e: any) => {
    await setChecked(e.target.checked);
  };

  // @ts-ignore
  const validation = (rule: any, value: any, callback: (error?: string) => void) => {
    if(checked) {
      return callback()
    }
    return callback(t('mandatory'))
  };

  const wordPriceInit = () => {
    setTimeout(() => {
      const priceList = languageDataServer.find((val:any) => val.code === firstStepData.lngFrom);
      if(priceList) {
        const val = priceList.translates_to[firstStepData.lngTo];
        setPricePerWord(!!val ? val : 0);
      }
    });
  };

  const languagesInit = () => {
    const lng = router.query?.lang === 'de' ? 'de' : 'en';
    setLanguageData([]);
    if(languageDataServer.length){
      const data = languageDataServer.map((val: any) => {
        return {value: val.code, title: lng === 'de' ? val.title_de : val.title_en}
      });
      setLanguageData(data);

      wordPriceInit();
    }
  };

  const loadLanguages = async () => {
    const list = await getLanguages();
    setLanguageDataServer(list?.languages?.length ? list.languages : []);
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  useEffect(() => {
    languagesInit();
  }, [languageDataServer]);

  useEffect(() => {
    languagesInit();

    // reload servise dropdown
    setShowService(false);
    setTimeout(() => {
      setShowService(true);
    });
  }, [router]);

  const getFiles = (e: {files: any, price: number, count: number, key: string}) => {
    setFilesData({files: e.files && e.files.length, price: e.price, count: e.count, strKey: e.key});
  };

  const stripe = useStripe();
  const elements = useElements();

  const cardCheck = () => {
    const cardContainer = document.getElementsByClassName('StripeElement')[0];
    const cardComplete = cardContainer.classList.contains('StripeElement--complete');
    setCardError(!cardComplete);
  };

  const submit = async () => {
    if(isFistStep) {
      setFistStepEmitted(true);
      if(filesData.files) {
        setFistStep(false);
      }
    } else {

      const cardContainer = document.getElementsByClassName('StripeElement')[0];
      const cardComplete = cardContainer.classList.contains('StripeElement--complete');
      setCardError(!cardComplete);

      if(cardComplete) {
        try {
          formRef.current!.submit();

          setLoading(true);

          const values = await formRef.current!.validateFields();

          const paymentIntent = filesData.strKey;

          // @ts-ignore
          const cardElement = elements.getElement(CardElement);

          // @ts-ignore
          const paymentMethod = await stripe.createPaymentMethod({
            type: 'card',
            // @ts-ignore
            card: cardElement,
            billing_details: {
              name: `${values.firstname} ${values.lastname}`,
              email: values.email,
            }
          });

          // @ts-ignore
          await stripe.confirmCardPayment(paymentIntent,{
            // @ts-ignore
            payment_method: paymentMethod.paymentMethod.id
          });

          alertSuccess(t('paid'));
          refresh();
          setLoading(false);

        } catch (e) {
          console.log('Error----', e);
          setLoading(false);
        }
      } else {
        formRef.current!.submit();
        setLoading(false);
      }
    }
  };


  const stepOne = <div className={css.orange} style={{backgroundColor: mainColor}}>
    <h3>{t("quote")}</h3>
    <p>{t("files")}</p>

    <FileUpload handleChange={getFiles} lngFrom={firstStepData.lngFrom} lngTo={firstStepData.lngTo}
                checkError={fistStepEmitted && !filesData.files} handleLoading={(e:any) => {setLoading(e)}}
                color={secondaryColor}
    />

    {languageData.length ?
      <div className={classNames(css.group, css.groupArrow)}>
        <div>
          <p>{t("source")}</p>
          {/*
            // @ts-ignore */}
          <TreeSelect value={firstStepData.lngFrom} treeData={languageData} {...tProps}
                      onChange={(e:string) => {seFirstStepData({...firstStepData, lngFrom: e})}}/>
        </div>
        <span>&#8594;</span>
        <div>
          <p>{t("target")}</p>
          {/*
            // @ts-ignore */}
          <TreeSelect value={firstStepData.lngTo} treeData={languageData} {...tProps}
                      onChange={(e:string) => {seFirstStepData({...firstStepData, lngTo: e})}}/>
        </div>
      </div> : ''
    }

    <div className={css.group}>
      <div>
        <p>{t("service")}</p>
        {/*
          // @ts-ignore */}
        { showService &&
          <TreeSelect value={firstStepData.service} treeData={subjectAreaData} {...tProps}
                      placeholder="Please select" onChange={(e:string) => {seFirstStepData({...firstStepData, service: e})}}
        />}
      </div>
      <span />
      <div>
        <p>{t("delivery")}</p>
        <DatePicker showTime showNow={false} defaultValue={firstStepData.date} format="DD.MM.YY" allowClear={false}
                    onChange={(e) => {seFirstStepData({...firstStepData, date: moment(e)})}}/>
      </div>
    </div>
  </div>;

  const stepTwo = <Form className={css.orange} ref={formRef} style={{backgroundColor: mainColor}}>
    <p className={css.back} onClick={() => {setFistStep(true); setFistStepEmitted(false)}}><span>&#8592; </span>
      {t('back')}</p>

    <div className={css.group}>
      <div>
        <p>{t("first")}</p>
        <Form.Item name="firstname" rules={[{ required: true, message: t('mandatory') }]}
        ><Input placeholder={t("first")} /></Form.Item>
      </div>
      <span />
      <div>
        <p>{t("last")}</p>
        <Form.Item name="lastname" rules={[{ required: true, message: t('mandatory') }]}
        ><Input placeholder={t("last")} /></Form.Item>
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>{t("company")} <span>{t("optional")}</span></p>
        <Input placeholder={t("company")}  />
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>{t("street")}</p>
        <Form.Item name="Street" rules={[{ required: true, message: t('mandatory') }]}
        ><Input placeholder={t("street")} /></Form.Item>
      </div>
      <span />
      <div>
        <p>{t("city")}</p>
        <Form.Item name="City" rules={[{ required: true, message: t('mandatory') }]}
        ><Input placeholder={t("city")} /></Form.Item>
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>{t("email")}</p>
        <Form.Item name="email" rules={[{ required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: t('emailError') }]}
        ><Input placeholder={t("email")} /></Form.Item>
      </div>
      <span />
      <div>
        <p>{t("phone")}</p>
        <Form.Item name="Phone" rules={[{ required: true, message: t('mandatory') }]}
        ><Input placeholder={t("phone")} /></Form.Item>
      </div>
    </div>

    <p>{t("credit")}</p>
    <CardElement className={css.card} onBlur={cardCheck} onFocus={() => setCardError(false)}
                 options={cardOptions}/>
    {cardError && <span className={css.cardError}>{t('creditError')}</span>}

    <Form.Item name="checkbox"
               rules={[{validator: validation}]}>
      <Checkbox checked={checked} onChange={onCheckboxChange}>
        {t("accept")} <a> {t("term")}</a>
      </Checkbox>
    </Form.Item>
  </Form>;

  return (
    <div className={css.form}>

      <div className={classNames(css.orangeGroup, isFistStep ? '' : css.showNextStep)}>
        {stepOne}
        {stepTwo}
      </div>

      <div className={css.white}>
        <div>
          <h3>CHF {filesData.price}</h3>
          <p>{t('wordPrice')}: {firstStepData.lngFrom} {`->`} {firstStepData.lngTo}:
            CHF {pricePerWord} </p>
          <p>{t('count')}: {filesData.count}</p>
        </div>

        <div>
          <Button type="primary" disabled={loading} onClick={submit} style={{backgroundColor: secondaryColor}}>
            {isFistStep ? t('next') : t('order')}
          </Button>
        </div>

        {
          loading &&
          <div className={css.loading}>
            <Spin size="large" />
          </div>
        }
      </div>
    </div>
  );
};

export default FormCalculate;
