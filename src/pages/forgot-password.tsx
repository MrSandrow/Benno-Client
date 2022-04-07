import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Button,
  Stack,
  Link,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { FC, useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { withApollo } from "../utils/withApollo";
import NextLink from "next/link";

const ForgotPassword: FC = () => {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={() => setIsComplete(true)}
      >
        {({ isSubmitting }) =>
          isComplete ? (
            <Box textAlign="center">
              We sent you an email to reset your password.
            </Box>
          ) : (
            <Stack spacing={4}>
              <Alert
                status="warning"
                borderRadius="md"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
              >
                <AlertIcon />
                <AlertTitle>This feature has been disabled.</AlertTitle>
                <AlertDescription>
                  You can{" "}
                  <NextLink href="login">
                    <Link>create a new account</Link>
                  </NextLink>{" "}
                  instead.
                </AlertDescription>
              </Alert>

              <Form>
                <InputField
                  type="email"
                  name="email"
                  placeholder="email"
                  label="Email"
                />

                <Button
                  mt={4}
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="green"
                  disabled
                >
                  Reset password
                </Button>
              </Form>
            </Stack>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
