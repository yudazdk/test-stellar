import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type TPortalProps = {
  show: boolean;
  className?: string;
  children: ReactNode;
};

/**
 *
 * @param props
 * @returns
 */
export default function Modal(props: TPortalProps) {
  const { children, show } = props;

  if (!show) return null;

  return createPortal(
    <>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 w-full h-full bg-white/[.55]"
        style={{
          zIndex: 49,
          opacity: 0.55,
          background: '#505F7D',
        }}
      />
      <div
        className="absolute px-8 bg-white rounded-lg h-fit inset-y-8 top-32 right-[40%]"
        style={{ zIndex: 50 }}
      >
        {children}
      </div>
    </>,
    document.getElementById('todo-modal')!
  );
}
