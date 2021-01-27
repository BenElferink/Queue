import styles from './SessionUrl.module.css';
import CopyIcon from './CopyIcon';
import { useRef, useState } from 'react';

export default function SessionUrl({ id, toggleState }) {
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef();

  const copyOutput = () => {
    if (!isCopied) {
      copyRef.current.select();
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        toggleState();
      }, 1000);
    }
  };

  return (
    <div className={styles.sessionUrl}>
      <CopyIcon onClick={copyOutput} />
      <input
        ref={copyRef}
        value={isCopied ? 'copied 👍' : `https://belferink1996.github.io/MERN-Queue/#/join/${id}`}
        readOnly
      />
    </div>
  );
}
