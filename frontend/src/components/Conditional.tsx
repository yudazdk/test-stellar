import { type ReactNode } from 'react';

interface IConditionalProps {
  show: boolean;
  children: ReactNode;
}

// Renders children only when `show` is true; otherwise returns null
export default function Conditional({ show, children }: IConditionalProps) {
  if (!show) {
    return null;
  }

  return <>{children}</>;
}