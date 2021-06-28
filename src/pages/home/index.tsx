import React, { FC } from 'react';

import css from './home.module.scss';
import FormCalculateWrap from '../../components/FormCalculateWrap';


const HomePage: FC = () => {

  return (
    <>
      <div className={css.page}>
        <FormCalculateWrap/>
      </div>
    </>
  );
};

export default HomePage;
