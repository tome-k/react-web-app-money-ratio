import React, {useEffect, useState} from 'react';
import * as mocked from '../api/mock';
import {fetchRates, fetchSymbols, Rates, Symbols, UnauthorizedError} from '../api';
import {DebugApiKey, DefaultSymbol} from '../constants';
import {Cashify} from 'cashify';
import {maxPrecision} from '../util';

import styles from './App.module.css';

import Button from './Button';
import ExchangeGrid from './ExchangeGrid';
import Input from './Input';
import KeyPrompt from './KeyPrompt';
import Select from './Select';

function Template ({children}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div>
      <header className={styles.header}>
        <h1>Currency Converter</h1>
      </header>
      {children}
    </div>
  );
}

function App (): React.ReactElement {
  const [apiKey, setApiKey] = useState('');
  const [amount, setAmount] = useState(1);
  const [symbolBase, setSymbolBase] = useState<string>(DefaultSymbol.Base);
  const [symbolTarget, setSymbolTarget] = useState<string>(DefaultSymbol.Target);
  const [rates, setRates] = useState<Rates>();
  const [symbols, setSymbols] = useState<Symbols>();
  const [convert, setConvert] = useState<Cashify['convert']>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (apiKey.length === 0) return;
    (async () => {
      try {
        const isDebugKey = ([DebugApiKey.Valid, DebugApiKey.Invalid] as string[]).includes(apiKey);
        if (!symbols) {
          const symbolFetcher = isDebugKey ? mocked.fetchSymbols : fetchSymbols;
          const symbols = await symbolFetcher(apiKey);
          setSymbols(symbols);
          return;
        }
        const ratesFetcher = isDebugKey ? mocked.fetchRates : fetchRates;
        const rates = await ratesFetcher(apiKey);
        setRates(rates);
      }
      catch (ex) {
        console.error(ex);

        if (ex instanceof UnauthorizedError) {
          setApiKey('');
          return;
        }

        if (
          ex instanceof TypeError
          && ex.message === 'Failed to fetch'
          && window.location.protocol === 'https:'
        ) {
          const err = Object.assign(new Error(), {
            name: 'MixedContentError',
            message: 'App must be served at a URL beginning with "http:"',
          });
          setError(err);
          return;
        }

        setError(ex);
      }
    })();
  }, [apiKey, symbolBase, symbols]);

  useEffect(() => {
    if (!rates) return;
    const c = new Cashify({base: DefaultSymbol.Base, rates});
    setConvert(() => c.convert.bind(c));
  }, [rates]);

  const switchSymbols = (): void => {
    const base = symbolBase;
    const target = symbolTarget;
    setSymbolBase(target);
    setSymbolTarget(base);
  };

  if (error) {
    return (
      <Template>
        <div className={styles.message}>
          <p>An error was encountered:</p>
          <p>{error.name}: {error.message}</p>
          <p>You can try reloading the app.</p>
        </div>
      </Template>
    );
  }

  if (apiKey.length === 0) {
    return (
      <Template>
        <KeyPrompt {...{setApiKey}} />
      </Template>
    );
  }

  if (!(rates && symbols && convert)) {
    return (
      <Template>
        <div className={styles.message}>Getting latest rates…</div>
      </Template>
    );
  }

  const convertedValue = maxPrecision(convert(
    amount,
    {from: symbolBase, to: symbolTarget},
  ));

  return (
    <Template>
      <div className={styles.container}>
        <div className={styles.controls}>
          <div className={styles.block}>
            <Select
              label="Base"
              options={Object.keys(symbols)}
              setValue={setSymbolBase}
              value={symbolBase}
            />
          </div>
          <div className={styles.block}>
            <Button onClick={switchSymbols} text="Switch" />
          </div>
          <div className={styles.block}>
            <Select
              label="Target"
              options={Object.keys(symbols)}
              setValue={setSymbolTarget}
              value={symbolTarget}
            />
          </div>
          <div className={styles.input}>
            <Input
              label="Amount"
              setValue={setAmount}
              type="number"
              value={amount}
            />
          </div>
          <div className={styles.output}>
            <div className={styles.base}>
              <span className={styles.amount}>
                {amount}
              </span> <span className={styles.symbol}>
                {symbolBase}
              </span> =
            </div>
            <div className={styles.target}>
              <span className={styles.amount}>
                {convertedValue}
              </span> <span className={styles.symbol}>
                {symbolTarget}
              </span>
            </div>
          </div>
        </div>
        <ExchangeGrid
          base={symbolBase}
          {...{amount, convert, symbols}}
        />
      </div>
    </Template>
  );
}

export default App;
