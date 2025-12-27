import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

const Body = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`card-body ${className}`}>{children}</div>;

const Title = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h5 className={`card-title text-slate-800 dark:text-slate-100 ${className}`}>
    {children}
  </h5>
);

export const Card = ({ className = "", children }: CardProps) => (
  <div
    className={`card border-1 bg-base-100 border-gray-300 dark:border-gray-700 shadow-sm p-3 ${className}`}
  >
    {children}
  </div>
);

Card.Body = Body;
Card.Title = Title;
