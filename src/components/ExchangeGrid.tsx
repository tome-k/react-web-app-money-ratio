import React from 'react';
import type {Cashify} from 'cashify';
import {maxPrecision} from '../util';
import type {Symbols} from '../api';
import styles from './ExchangeGrid.module.css';
import CurrencyTile from './CurrencyTile';

type Props = {
  amount: number;
  base: string;
  convert: Cashify['convert'];
  symbols: Symbols;
};

function ExchangeGrid (props: Props): React.ReactElement {
  const {amount, base, convert, symbols} = props;

  return (
    <div className={styles.component}>
      {Object.entries(symbols).map(([symbol, name]) => {
        const value = maxPrecision(convert(
          amount,
          {from: base, to: symbol},
        ), 6);
        return <CurrencyTile
          key={symbol}
          selected={symbol === base}
          {...{name, symbol, value}}
        />
      })}
    </div>
  );
}

export default ExchangeGrid;
