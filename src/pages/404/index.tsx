import React, { FC } from 'react';
import classNames from 'classnames';

import css from './404.module.scss';

const NotFoundPage: FC = () => {
  return (
    <section className={classNames('block-wrap', css.box)}>
      <img src="/static/img/icons/sad-smile.png" alt="sad" />
      <p>this page do not exist</p>
    </section>
  );
};

export default NotFoundPage;
