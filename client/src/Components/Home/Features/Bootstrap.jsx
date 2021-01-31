import 'bootstrap/dist/css/bootstrap.css';

export function Container({ children }) {
  return <div className='container'>{children}</div>;
}

export function Row({ children }) {
  return <div className='row'>{children}</div>;
}

export function Column({ size_md, size_flex, children }) {
  return (
    <div className={`col-${size_md} ${size_md && 'col-6'} ${size_flex && 'col-12'}`}>
      {children}
    </div>
  );
}
