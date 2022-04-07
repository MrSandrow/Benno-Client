import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React, { FC } from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

const Navbar: FC = () => {
  const router = useRouter();
  const apolloClient = useApolloClient();

  const { data } = useMeQuery({ skip: isServer() });
  const [logout, { loading }] = useLogoutMutation();

  return (
    <Flex p={4} bg="tomato" zIndex={1} position="sticky" top={0} align="center">
      <NextLink href="/">
        <Button>Home</Button>
      </NextLink>
      <Box ml="auto">{displayLinks()}</Box>
    </Flex>
  );

  function displayLinks() {
    if (data?.me) {
      return (
        <Flex alignItems={"center"} gap={4}>
          <Box>Hello {data.me.username} !</Box>
          <Button
            isLoading={loading}
            onClick={async () => {
              await logout();
              apolloClient.resetStore();
            }}
          >
            Logout
          </Button>
        </Flex>
      );
    }

    return (
      <>
        <NextLink href={`/login?next=${router.asPath}`} replace={true}>
          <Link mr="2">Login</Link>
        </NextLink>

        <NextLink href={`/register?next=${router.asPath}`} replace={true}>
          <Link>Register</Link>
        </NextLink>
      </>
    );
  }
};

export default Navbar;
