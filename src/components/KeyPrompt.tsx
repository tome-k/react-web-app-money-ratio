import React, {useState} from 'react';
import {DebugApiKey} from '../constants';

import styles from './KeyPrompt.module.css';

import Button from './Button';
import Input from './Input';

type Props = {
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
};

function KeyPrompt (props: Props): React.ReactElement {
  const [value, setValue] = useState('');

  const setApiKey = (): void => props.setApiKey(value.trim());

  return (
    <div className={styles.component}>
      <blockquote className={styles.notice}>
        <p>
          This app
          uses <a href="https://exchangeratesapi.io/">exchangeratesapi.io</a> as
          its source of exchange rate data, and—in order to fetch that data—a
          valid API key is required. Please provide one in order to continue.
        </p>
        <p>
          Alternatively, you can explore this app using cached, stale data
          (and avoid making any network API requests) by using the
          value <code>{DebugApiKey.Valid}</code>. To simulate an invalid API key
          in this mode, use <code>{DebugApiKey.Invalid}</code>.
        </p>
      </blockquote>
      <Input type="text" label="API key" onEnter={setApiKey} {...{value, setValue}} />
      <div className={styles.block}>
        <Button text="Update" onClick={setApiKey} />
      </div>
    </div>
  );
}

export default KeyPrompt;
