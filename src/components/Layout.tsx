import React, { ComponentProps, FC } from "react";
import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

type Props = ComponentProps<typeof Wrapper>;

const Layout: FC<Props> = ({ children, variant }) => {
  return (
    <>
      <Navbar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
