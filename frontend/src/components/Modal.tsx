/**
 * Renders children into a DOM portal (#todo-modal) with a semi-opaque backdrop.
 *
 * The component returns null when `show` is false. When visible, it mounts an overlay
 * and a centered modal container using createPortal into the element with id "todo-modal".
 *
 * @param props.show - Toggle visibility of the modal. If false, nothing is rendered.
 * @param props.children - Content to render inside the modal container.
 * @returns A React portal rendering the backdrop and modal content, or null when hidden.
 *
 * Note: Requires an element with id "todo-modal" to exist in the document.
 */
import { type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type TPortalProps = {
  show: boolean;
  children: ReactNode;
};


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
