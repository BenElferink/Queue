import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './styles/InviteUrl.module.css';
import CopyIcon from './icons/CopyIcon';

export default function InviteUrl({ closeThis }) {
  const { roomId } = useSelector((state) => state.roomReducer);
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef();
  const joinUrl = `https://queue-client.herokuapp.com/join/${roomId}`;

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
    <div className={styles.component}>
      <input ref={copyRef} value={isCopied ? 'copied 👍' : joinUrl} readOnly />
      <CopyIcon onClick={copyOutput} />
    </div>
  );
}
