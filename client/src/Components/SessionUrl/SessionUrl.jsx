import styles from './SessionUrl.module.css';
import CopyIcon from './icon/CopyIcon';
import { useRef, useState } from 'react';

export default function SessionUrl({ roomId, closeThis }) {
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef();
  const joinUrl = `https://belferink1996.github.io/MERN-Queue/join/${roomId}`;

  const copyOutput = () => {
    if (!isCopied) {
      copyRef.current.select();
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        closeThis();
      }, 1000);
    }
  };

  return (
    <div className={styles.sessionUrl}>
      <CopyIcon onClick={copyOutput} />
      <input ref={copyRef} value={isCopied ? 'copied 👍' : joinUrl} readOnly />
    </div>
  );
}
