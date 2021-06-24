import React, { FC, useEffect, useState } from 'react';
import FileUpload from './FilesUpload';
import classNames from 'classnames';
import { DatePicker, Input, TreeSelect, Form, Checkbox, Button } from 'antd';
import moment from 'moment';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { FormInstance } from 'antd/lib/form';

import css from './form-calculate.module.scss';
import { loadStripe } from '@stripe/stripe-js';

const styles = StyleSheet.create({
  page: {
    flexDirection: "column"
  },
  section: {
    flexGrow: 1
  }
});

const languageData = [
  {value:'German', title:"German"},
  {value:'English', title:"English"},
  {value:'French', title:"French"},
  {
    value:'all', title:"All languages", selectable: false, disabled: true, children: [
      {value:'German ', title:"German"},
      {value:'English ', title:"English"},
      {value:'French ', title:"French"},
    ]
  }
];

const subjectAreaData = [
  {value:'Translation', title:'Translation (inkl. Revision)'},
  {value:'Proofreading', title:'Proofreading'},
];

const tProps = {
  treeDefaultExpandAll: false,
  dropdownStyle: { maxHeight: 400, overflow: 'auto' },
  style: { width: '100%' }
};

const stripePromise = loadStripe('pk_test_51J5RtSDgcFJAf3LSUWpMGGMJAX5XpjEvdqrtoDpKfiwPvDjJoY91T9Fqw99I7ZY5mWak1uRSJC84XuKn0HNUt4DA00XMtOKbaY');

const FormCalculate: FC = () => {
  const [firstStepData, seFirstStepData] = useState({
    lngFrom: 'French',
    lngTo: 'German',
    service: 'Translation',
    files: '',
    date: moment().add(1,'days').set({h: 12, m: 0})
  });
  const [isClient, setIsClient] = useState(false);
  const [hasFiles, setHasFiles] = useState(false);
  const [isFistStep, setFistStep] = useState(true);
  const [fistStepEmitted, setFistStepEmitted] = useState(false);
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {
    setIsClient(true)
  }, []);

  const getFiles = (e: any) => {
    setHasFiles(e && e.length)
  };

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if(isFistStep) {
      setFistStepEmitted(true);
      if(hasFiles) {
        setFistStep(false);
      } else {

      }
    } else {
      formRef.current!.submit();

      try {
        const values = await formRef.current!.validateFields();

        setLoading(true);
        const stripe = await stripePromise;

        // @ts-ignore
        const {error} = await stripe.redirectToCheckout({
          lineItems: [{
            price: 'price_1J5ZdIDgcFJAf3LS8pRiiBL3',
            quantity: 100
          }],
          submitType: 'pay',
          customerEmail: values.email,
          mode: 'payment',
          cancelUrl: window.location.origin,
          successUrl: window.location.origin
        });
        if(error) {
          setLoading(false);
        }

      } catch (errorInfo) {
        console.log('Failed:', errorInfo);
        return false;
      }

    }
  };

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={{ marginBottom: '30px'}}>{moment().format('MMMM Do YYYY, h:mm:ss a')}</Text>

          <Text>Service: <Text style={{ color: '#414141'}}>{firstStepData.service}</Text></Text>
          <Text>Language combination: <Text style={{ color: '#414141'}}>{firstStepData.lngFrom}  `{'>'}` {firstStepData.lngTo}</Text></Text>
          <Text>Delivery time: <Text style={{ color: '#414141'}}>{moment(firstStepData.date).format('MMMM Do YYYY, h:mm:ss a')}</Text></Text>
          <Text style={{ marginBottom: '30px' }}>Price: <Text style={{ color: '#414141'}}>197.0 CHF</Text></Text>

          <Text>Our minimum price with 3-to 5-day delivery is CHF 103.32</Text>
        </View>
      </Page>
    </Document>
  );

  const Print = () => (
    <PDFDownloadLink document={<MyDocument />} fileName="word-count-offer.pdf">
      {({ loading }) => (loading ? 'Loading document...' : 'Create offer (PDF)')}
    </PDFDownloadLink>
  );

  const stepOne = <div className={css.orange}>
    <h3>Calculate quote</h3>
    <p>Files</p>

    <FileUpload handleChange={getFiles} checkError={fistStepEmitted && !hasFiles} />

    <div className={classNames(css.group, css.groupArrow)}>
      <div>
        <p>Source language</p>
        {/*
          // @ts-ignore */}
        <TreeSelect value={firstStepData.lngFrom} treeData={languageData} {...tProps}
                    placeholder="Please select" onChange={(e:string) => {seFirstStepData({...firstStepData, lngFrom: e})}}
        />
      </div>
      <span>&#8594;</span>
      <div>
        <p>Target language</p>
        {/*
          // @ts-ignore */}
        <TreeSelect value={firstStepData.lngTo} treeData={languageData} {...tProps}
                    placeholder="Please select" onChange={(e:string) => {seFirstStepData({...firstStepData, lngTo: e})}}
        />
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>Choose service</p>
        {/*
          // @ts-ignore */}
        <TreeSelect value={firstStepData.service} treeData={subjectAreaData} {...tProps} treeNodeLabelProp={'value'}
                    placeholder="Please select" onChange={(e:string) => {seFirstStepData({...firstStepData, service: e})}}
        />
      </div>
      <span />
      <div>
        <p>Delivery time</p>
        <DatePicker showTime showNow={false} defaultValue={firstStepData.date} format="DD.MM.YY" allowClear={false}
                    onChange={(e) => {seFirstStepData({...firstStepData, date: moment(e)})}}/>
      </div>
    </div>
  </div>;

  const stepTwo = <Form className={css.orange} ref={formRef}>
    <p className={css.back} onClick={() => {setFistStep(true); setFistStepEmitted(false)}}><span>&#8592;</span> Back</p>

    <div className={css.group}>
      <div>
        <p>First name</p>
        <Form.Item name="firstname" rules={[{ required: true, message: 'this field is mandatory' }]}
        ><Input placeholder="First name" /></Form.Item>
      </div>
      <span />
      <div>
        <p>Last name</p>
        <Form.Item name="lastname" rules={[{ required: true, message: 'this field is mandatory' }]}
        ><Input placeholder="Last name" /></Form.Item>
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>Company name <span>(optional)</span></p>
        <Input placeholder="Company name" />
      </div>
      <span />
      <div>
        <p>City</p>
        <Form.Item name="City" rules={[{ required: true, message: 'this field is mandatory' }]}
        ><Input placeholder="City" /></Form.Item>
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>Street</p>
        <Form.Item name="Street" rules={[{ required: true, message: 'this field is mandatory' }]}
        ><Input placeholder="Street" /></Form.Item>
      </div>
      <span />
      <div>
        <p>Zip code</p>
        <Form.Item name="Zip" rules={[{ required: true, message: 'this field is mandatory' }]}
        ><Input placeholder="Zip code" /></Form.Item>
      </div>
    </div>

    <div className={css.group}>
      <div>
        <p>E-Mail</p>
        <Form.Item name="email" rules={[{ required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          message: 'email is invalid' }]}
        ><Input placeholder="E-Mail" /></Form.Item>
      </div>
      <span />
      <div>
        <p>Phone number</p>
        <Form.Item name="Phone" rules={[{ required: true, message: 'this field is mandatory' }]}
        ><Input placeholder="Phone" /></Form.Item>
      </div>
    </div>

    {/*<p>Credit Card</p>*/}
    {/*<CardElement className={css.card}/>*/}
    <Form.Item name="remember" valuePropName="checked" rules={[{ required: true, message: 'this field is mandatory' }]}>
      <Checkbox>
        accept  <a>Terms & Conditions</a>
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
          <h3>CHF 197.00</h3>
          <p>AI Translation™ + Refinement by <br/>language experts</p>
          <p>Price per line: CHF 1.97 (excl. 7.70% VAT)</p>
        </div>

        <div>
          <Button type="primary" disabled={loading} onClick={submit}> {isFistStep ? 'Next step' : 'Place Order'} </Button>
          {isClient && !isFistStep && Print()}
        </div>
      </div>
    </div>
  );
};

export default FormCalculate;
