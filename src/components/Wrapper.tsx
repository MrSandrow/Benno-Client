import { Box } from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  variant?: "small" | "regular";
};

const Wrapper: FC<Props> = ({ children, variant = "regular" }) => {
  return (
    <Box
      mx="auto"
      my={8}
      maxW={variant === "regular" ? "800px" : "400px"}
      w="90%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
