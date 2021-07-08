import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';

import css from './files-upload.module.scss';
import useTranslation from '../common/translation';
import { fileUpload } from '../common/api';
import { alertError } from '../common/alert';

const toMbSize = (e: number) => {
  return (e / (1024*1024)).toFixed(2);
};

const FileUpload: FC<{handleChange: any, handleLoading: any, checkError: boolean, lngFrom: string,
  lngTo: string, color: string, service: string, apostille: boolean}> = (props) => {
  const [files, setFiles] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [showInput, setShowInput] = useState(true);
  const { handleChange, handleLoading, checkError, lngFrom, lngTo, color, service, apostille } = props;
  const { t } = useTranslation();

  const getPhoto = async (e: any) => {
    const same = files.find((v: any) => e.name == v.name);
    if(!same) {
      await setFiles([...files, e]);
    }
  };

  const inputReload = () => {
    setShowInput(false);
    setTimeout(() => {
      setShowInput(true);
    })
  };

  const apiCalculate = async () => {
    if(files.length) {
      handleLoading(true);
      const formData = new FormData();
      formData.append('file', files[files.length - 1]);
      formData.append('translateFrom', lngFrom);
      formData.append('apostille', String(apostille));
      if(service === 'translation') {
        formData.append('translateTo', lngTo);
      }
      formData.append('type', service);

      // try{
        const val = await fileUpload(formData);
        if(val?.pricePerWord){
          if(data.length < files.length) {
            setData([...data, { price: val.price, count: val.wordsQuantity,
              minPrice: val.minPrice, pricePerWord: val.pricePerWord, tax: val.tax, tolerance: val.tolerance }]);
          }
        } else{
          alertError(t('apiError'));
          if(files.length) {
            setFiles([]);
            setData([]);
            inputReload();
          }
        }
        handleLoading(false);
      // } catch{
      //   alertError(t('apiError'));
      //   if(files.length) {
      //     setFiles([]);
      //     setData([]);
      //     inputReload();
      //   }
      //   handleLoading(false);
      // }
    } else{
      if(files.length) {
        setFiles([]);
        setData([]);
        inputReload();
      }
    }
  };

  useEffect(() => {
    apiCalculate();
  }, [files]);

  const transformChf = (v: number) => {
    const el = Number((Math.floor(v * 10) / 10).toFixed(1));
    const afterDots = Number((Math.floor(v * 100) / 100).toFixed(2));
    const cond = Number((afterDots - el).toFixed(2));
    let res = el;

    switch (Number(cond)) {
      case 0:
        res += 0;
        break;
      case 0.01:
      case 0.02:
      case 0.03:
      case 0.04:
      case 0.05:
        res += 0.05;
        break;
      case 0.06:
      case 0.07:
      case 0.08:
      case 0.09:
        res += 0.1;
        break;
    }

    return Number(res.toFixed(2));
  };

  useEffect(() => {
    // let price = 0;
    if(data.length) {
      let count = 0;

      for(let item of data) {
        count += item.count;
      }

      const pricePerWords = data[0].pricePerWord * count;
      let priceBeforeTaxes = pricePerWords + pricePerWords * data[0].tolerance;
      if(priceBeforeTaxes < data[0].minPrice){
        priceBeforeTaxes = data[0].minPrice;
      }

      const priceAfterTaxes = +(
        Math.round((priceBeforeTaxes + priceBeforeTaxes * data[0].tax) * 100) / 100
      ).toFixed(2);

      handleChange({files, price: transformChf(priceAfterTaxes), count});
    } else{
      handleChange({files, price: 0, count: 0});
    }
  }, [data, files]);

  useEffect(() => {
    if(lngFrom === lngTo && service === 'translation') {
      alertError(t('sameLng'));
    }
  }, [lngFrom, lngTo]);

  useEffect(() => {
    setData([]);
    setFiles([]);
    inputReload();
  }, [service]);

  const remove = (name: string) => {
    let val = data;
    setFiles(files.filter((e: any, i :number) => {
      if(e.name == name) {
        val.splice(i, 1);
        setData(val);
      }
      return e.name !== name
    }));

    inputReload();
  };

  return (
    <div className={classNames(css.group, checkError && css.error)}>
      {showInput &&
      <input type="file" name="files" onChange={(e: any) => {e?.target?.files[0] && getPhoto(e.target.files[0])}}
             accept=".txt, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .rtf, .xml, .json, .html, .idml, .xliff"
             title=""/>
      }

      <div className={css.files}>
        {showInput &&
        <input type="file" name="files" onChange={(e: any) => {e?.target?.files[0] && getPhoto(e.target.files[0])}}
               title=""
               accept=".txt, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .rtf, .xml, .json, .html, .idml, .xliff"/>
        }
        {
          files.length ?
          <div className={css.elements}>
            {files.map((data: File, i: number) => (
              <p key={i}>
                <img src="/static/img/close-black.svg" alt="close" onClick={() => {remove(data.name)}}/>
                <span>{data.name}  ({toMbSize(data.size)} MB)</span>
              </p>
            ))}
          </div> : <p>{checkError ? t('selectFilesError') : t('notSelected')}</p>
        }
      </div>

      <Button type="primary" className={css.grey} style={{backgroundColor: color}}>{t('selectFiles')}</Button>

      {checkError &&
        <>
          <div />
          <p className={css.errorT}>{t('mandatory')}</p>
        </>
      }


    </div>

  );
};

export default FileUpload;
