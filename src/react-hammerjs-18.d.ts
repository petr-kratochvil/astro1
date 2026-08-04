declare module "react-hammerjs-18" {
  import { ComponentType, ReactNode } from "react";

  export interface HammerInput {
    direction: number;
    [key: string]: unknown;
  }

  export interface HammerProps {
    onSwipe?: (event: HammerInput) => void;
    id?: string;
    children?: ReactNode;
    [key: string]: unknown;
  }

  const Hammer: ComponentType<HammerProps>;
  export default Hammer;
}
