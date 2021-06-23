import React, { FC } from 'react';
import FormCalculate from '../../components/FormCalculate';

import css from './home.module.scss';


const HomePage: FC = () => {

  return (
    <div className={css.page}>
      <FormCalculate />
    </div>
  );
};

export default HomePage;
