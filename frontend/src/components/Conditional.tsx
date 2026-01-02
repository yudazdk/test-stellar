import { type ReactNode } from 'react';

interface IConditionalProps {
  show: boolean;
  children: ReactNode;
}

export default function Conditional({ show, children }: IConditionalProps) {
  if (!show) {
    return null;
  }

  return <>{children}</>;
}