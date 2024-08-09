import { memo, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

interface ShadowContentProps {
  children: React.ReactNode;
  root: ShadowRoot;
}

function ShadowContent({ children, root }: ShadowContentProps) {
  return ReactDOM.createPortal(children, root)
}

const ShadowWrapper = memo((props: { code: string }) => {
  const [root, setRoot] = useState<ShadowRoot | null>(null);

  const attach = useCallback((el: HTMLDivElement) => {
    if (!el) {
      return
    }
    const root = el.attachShadow({ mode: 'open' });
    setRoot(root);
  }, []);

	return (
		<div className="shadow-wrapper" ref={attach}>
      {root && (
        <ShadowContent root={root}>
          <div dangerouslySetInnerHTML={{ __html: props.code }}></div>
        </ShadowContent>
      )}
		</div>
	);
});

export default ShadowWrapper;
