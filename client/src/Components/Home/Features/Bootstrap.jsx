import 'bootstrap/dist/css/bootstrap.css';

export function Container({ children }) {
  return <div className='container'>{children}</div>;
}

export function Row({ children }) {
  return <div className='row'>{children}</div>;
}

export function Column({ size, children }) {
  return <div className={`col-${size}`}>{children}</div>;
}
