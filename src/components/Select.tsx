import React from 'react';
import styles from './Select.module.css';

type Props = {
  label: string;
  options: ([text: string, value: string] | string)[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
};

function Select (props: Props): React.ReactElement {
  const {label, options, setValue, value} = props;
  return (
    <label className={styles.container}>
      <span className={styles.label}>{label}</span>
      <select
        className={styles.select}
        onChange={({target: {value}}) => setValue(value)}
        {...{value}}
      >
        {[...options.entries()].map(([i, opt]) => {
          const [text, value] = typeof opt === 'string'
            ? [opt, opt]
            : opt;
          const key = `${i}${value}`;
          return <option {...{key, value}}>{text}</option>;
        })}
      </select>
    </label>
  );
}

export default Select;
