import React from 'react';
import styles from './CurrencyTile.module.css';

type Props = {
  name: string;
  selected: boolean;
  symbol: string;
  value: number;
};

function CurrencyTile (props: Props): React.ReactElement {
  return (
    <div className={styles.component}>
      <span
        className={[styles.symbol, props.selected ? styles.selected : ''].join(' ')}
        title={props.name}
      >{props.symbol}</span>
      <div className={styles.value}>{props.value}</div>
    </div>
  );
}

export default CurrencyTile;
