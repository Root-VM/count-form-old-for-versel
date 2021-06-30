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

const FileUpload: FC<{handleChange: any, handleLoading: any, checkError: boolean, lngFrom: string, lngTo: string, color: string}> = (props) => {
  const [files, setFiles] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const { handleChange, handleLoading, checkError, lngFrom, lngTo, color } = props;
  const { t } = useTranslation();

  const getPhoto = async (e: any) => {
    const same = files.find((v: any) => e.name == v.name);
    if(!same) {
      await setFiles([...files, e]);
    }
  };

  const apiCalculate = async () => {
    if(files.length) {
      handleLoading(true);
      const formData = new FormData();
      formData.append('file', files[files.length - 1]);
      formData.append('translateTo', lngTo);
      formData.append('translateFrom', lngFrom);

      try{
        const val = await fileUpload(formData);
        if(val?.price){
          if(data.length < files.length) {
            setData([...data, { price: val.price, count: val.wordsQuantity }]);
          }
        } else{
          alertError(t('apiError'));
          if(files.length) {
            setFiles([]);
            setData([]);
          }
        }
        handleLoading(false);
      } catch{
        alertError(t('apiError'));
        if(files.length) {
          setFiles([]);
          setData([]);
        }
        handleLoading(false);
      }
    } else{
      if(files.length) {
        setFiles([]);
        setData([]);
      }
    }
  };

  useEffect(() => {
    apiCalculate();
  }, [files]);

  useEffect(() => {
    let price = 0;
    let count = 0;

    for(let item of data) {
      price += item.price;
      count += item.count;
    }
    handleChange({files, price: price.toFixed(2), count});
  }, [data, files]);

  useEffect(() => {
    if(lngFrom === lngTo) {
      alertError(t('sameLng'));
    } else{
      setData([]);
      setFiles([]);
    }
  }, [lngFrom, lngTo]);

  const remove = (name: string) => {
    let val = data;
    setFiles(files.filter((e: any, i :number) => {
      if(e.name == name) {
        val.splice(i, 1);
        setData(val);
      }
      return e.name !== name
    }));
  };

  return (
    <div className={classNames(css.group, checkError && css.error)}>
      <input type="file" name="files" onChange={(e: any) => {e?.target?.files[0] && getPhoto(e.target.files[0])}}
             accept=".txt, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .rtf, .xml, .json, .html, .idml, .xliff"/>

      <div className={css.files}>
        {
          files.length ?
          <div className={css.elements}>
            {files.map((data: File, i: number) => (
              <p key={i}>
                <img src="/static/img/close-black.svg" alt="close" onClick={() => {remove(data.name)}}/>
                {data.name}  ({toMbSize(data.size)} MB)
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
