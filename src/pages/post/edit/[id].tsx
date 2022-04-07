import { Box, Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC } from "react";
import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { withApollo } from "../../../utils/withApollo";

const EditPost: FC = () => {
  const router = useRouter();

  const routerId = router.query.id;
  const postId = typeof routerId === "string" ? parseInt(routerId) : -1;

  const { data } = usePostQuery({
    variables: { id: postId },
    skip: postId === -1,
  });

  const [updatePost] = useUpdatePostMutation();

  const title = data?.post?.title || "";
  const text = data?.post?.text || "";

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title, text }}
        onSubmit={async (values) => {
          const { errors } = await updatePost({
            variables: { ...values, id: postId },
          });

          if (!errors) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column">
              <InputField
                type="text"
                name="title"
                placeholder="title"
                label="Title"
              />
              <Box mt={4}>
                <InputField
                  name="text"
                  placeholder="text..."
                  label="Text"
                  type="text"
                  isTextarea
                />
              </Box>

              <Button
                mt={4}
                isLoading={isSubmitting}
                type="submit"
                colorScheme="green"
              >
                Edit post
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
