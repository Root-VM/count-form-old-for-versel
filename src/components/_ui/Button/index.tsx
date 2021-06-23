import * as React from 'react';
import { FC } from 'react'

import css from './button.module.scss';

const Button: FC<{styleType: string, submit?: boolean, onClick?: any}> = (props: any) => {
  const { ...btn } = props;

  return (
    <button
      className={css[btn.styleType]}
      aria-label="btn"
      type={btn.submit ? 'submit' : 'button'}
      onClick={btn.onClick}
    >
      {' '}
      {btn.children}{' '}
    </button>
  );
};

export default Button;
