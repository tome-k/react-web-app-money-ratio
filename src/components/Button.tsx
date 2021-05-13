import React from 'react';
import styles from './Button.module.css';

type Props = {
  onClick: () => unknown;
  text: string;
};

function Button (props: Props): React.ReactElement {
  return (
    <button
      className={styles.component}
      onClick={props.onClick}
    >{props.text}</button>
  );
}

export default Button;
