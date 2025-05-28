import { FC } from "react";
import { orbitron } from "../../fonts";

interface SideTitleProps {
  children: React.ReactNode;
}

const SideTitle: FC<SideTitleProps> = ({ children }) => {
  return (
    <h4 className={`card-title p-3 ${orbitron.className}`}>{children}</h4>
  );
};

export default SideTitle;
