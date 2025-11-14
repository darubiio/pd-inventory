import { ReactNode, Fragment } from "react";

interface OnlyIfProps {
  condition: boolean;
  children: ReactNode;
}

export const OnlyIf = ({ condition, children }: OnlyIfProps) => (
  <Fragment>{condition ? children : null}</Fragment>
);
