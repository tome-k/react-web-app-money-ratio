import React, {useState} from 'react';
import styles from './Input.module.css';

type Props = (
  | {
    label: string;
    max?: number;
    min?: number;
    onEnter?: (ev: React.KeyboardEvent<HTMLInputElement>) => unknown;
    size?: number;
    step?: number;
    type: 'number';
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
  }
  | {
    label: string;
    onEnter?: (ev: React.KeyboardEvent<HTMLInputElement>) => unknown;
    size?: number;
    type: 'text';
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }
);

function Input (props: Props): React.ReactElement {
  const [inputValue, setInputValue] = useState(String(props.value));

  if (props.type === 'number') {
    const {label, onEnter, setValue, type} = props;
    const min = props.min ?? -Infinity;
    const max = props.min ?? Infinity;
    const size = props.size ?? 1;
    const step = props.step ?? 1;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
      const {value} = ev.target;
      setInputValue(value);
      if (!value.trim()) {
        setValue(0);
        return;
      }
      const n = parseFloat(value);
      if (!isNaN(n)) setValue(n);
    };

    return (
      <label className={styles.container}>
        <span className={styles.label}>{label}</span>
        <input
          className={styles.input}
          onChange={handleChange}
          onKeyUp={typeof onEnter === 'function'
            ? ev => {
              ev.key === 'Enter' && onEnter(ev);
            }
            : undefined
          }
          {...{max, min, size, step, type, value: inputValue}}
        ></input>
      </label>
    );
  }
  else {
    const {label, onEnter, setValue, type, value} = props;
    const size = props.size ?? 1;

    return (
      <label className={styles.container}>
        <span className={styles.label}>{label}</span>
        <input
          className={styles.input}
          onChange={({target: {value}}) => setValue(value)}
          onKeyUp={typeof onEnter === 'function'
            ? ev => {
              ev.key === 'Enter' && onEnter(ev);
            }
            : undefined
          }
          {...{size, type, value}}
        ></input>
      </label>
    );
  }
}

export default Input;
