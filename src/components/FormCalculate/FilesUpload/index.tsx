import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';

import css from './files-upload.module.scss';

const toMbSize = (e: number) => {
  return (e / (1024*1024)).toFixed(2);
};

const FileUpload: FC<{handleChange: any, checkError: boolean}> = (props) => {
  const [files, setFiles] = useState<any>([]);
  const { handleChange, checkError } = props;

  const getPhoto = async (e: any) => {
    if(!!e && !!e.target.files[0]) {
      await setFiles([...files, e.target.files[0]]);
    }
  };

  useEffect(() => {
    const formData = new FormData();
    for(const file of files) {
      formData.append('files', file);
    }
    // upload(formData).then(() => {
    //   handleChange(files);
    // });
    handleChange(files);
  }, [files]);

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
          </div> : <p>{checkError ? 'please select file(s) to translate' : 'file(s) not selected'}</p>
        }
      </div>

      <Button type="primary" className={css.grey}>Select file(s)</Button>

      {checkError &&
        <>
          <div />
          <p className={css.errorT}>this field is mandatory</p>
        </>
      }
    </div>

  );
};

export default FileUpload;
