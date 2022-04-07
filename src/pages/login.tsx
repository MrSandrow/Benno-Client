import React, { FC } from "react";
import { Form, Formik } from "formik";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

const Login: FC = () => {
  const [login] = useLoginMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: { options: values },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });

              cache.evict({ fieldName: "posts" });
            },
          });

          const user = response.data?.login.user;
          const errors = response.data?.login.errors;

          if (user) {
            const nextPage = router.query.next;
            const destination = typeof nextPage === "string" ? nextPage : "/";

            router.replace(destination);
            return;
          }

          if (errors) {
            setErrors(toErrorMap(errors));
            return;
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column">
              <InputField
                type="email"
                name="email"
                placeholder="email"
                label="Email"
              />
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>

              <NextLink href="/forgot-password">
                <Link mt={3}>Reset password</Link>
              </NextLink>

              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                colorScheme="green"
              >
                Login
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
