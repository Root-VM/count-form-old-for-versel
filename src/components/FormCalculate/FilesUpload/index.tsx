import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';

import css from './files-upload.module.scss';
import useTranslation from '../../../pages/translation';
import { filesUpload } from '../../../api/general';
import { alertError } from '../../../common/alert';

const toMbSize = (e: number) => {
  return (e / (1024*1024)).toFixed(2);
};

const FileUpload: FC<{handleChange: any, handleLoading: any, checkError: boolean, lngFrom: string, lngTo: string}> = (props) => {
  const [files, setFiles] = useState<any>([]);
  const { handleChange, handleLoading, checkError, lngFrom, lngTo } = props;
  const { t } = useTranslation();

  const getPhoto = async (e: any) => {
    if(!!e && !!e.target.files[0]) {
      await setFiles([...files, e.target.files[0]]);
    }
  };

  const apiCalculate = () => {
    if(files.length) {
      handleLoading(true);
      const formData = new FormData();
      for(const file of files) {
        formData.append('file', file);
      }
      formData.append('translateTo', lngTo);
      formData.append('translateFrom', lngFrom);

      filesUpload(formData).then(data => {
        if(data?.paymentIntent){
          handleChange({files, price: data.price, count: data.wordsQuantity, key: data.paymentIntent});
        } else{
          alertError(t('apiError'));
          handleChange({files, price: 0, count: 0, key: ''});
          if(files.length) {
            setFiles([]);
          }
        }
        handleLoading(false);
      }).catch(() => {
        alertError(t('apiError'));
        handleChange({files, price: 0, count: 0, key: ''});
        if(files.length) {
          setFiles([]);
        }
        handleLoading(true);
      });
    } else{
      handleChange({files, price: 0, count: 0, key: ''});
      if(files.length) {
        setFiles([]);
      }
    }
  };

  useEffect(() => {
    apiCalculate();
  }, [files]);

  useEffect(() => {
    if(lngFrom === lngTo) {
      handleChange({files: [], price: 0, count: 0, key: ''});
      setFiles([]);
    } else{
      apiCalculate();
    }
  }, [lngFrom, lngTo]);

  const remove = (name: string) => {
    setFiles(files.filter((e: any) => e.name !== name));
  };

  return (
    <div className={classNames(css.group, checkError && css.error)}>
      <input type="file" name="files" onChange={getPhoto}
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

      <Button type="primary" className={css.grey}>{t('selectFiles')}</Button>

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
