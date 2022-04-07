import { Box, Button, Grid, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FC } from "react";
import Layout from "../../components/Layout";
import {
  useDeletePostMutation,
  useMeQuery,
  usePostQuery,
} from "../../generated/graphql";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";
import { isServer } from "../../utils/isServer";

const Post: FC = () => {
  const router = useRouter();

  const routerId = router.query.id;
  const postId = typeof routerId === "string" ? parseInt(routerId) : -1;

  const { data: meData } = useMeQuery({ skip: isServer() });
  const { data: postData, loading: postLoading } = usePostQuery({
    variables: { id: postId },
    skip: postId === -1,
  });

  const [deletePost] = useDeletePostMutation();

  const postExists = postData?.post;
  const userOwnsPost = meData?.me?.id === postData?.post?.creator.id;

  const shouldDisplayButtons = postExists && userOwnsPost;

  return (
    <Layout>
      <Grid gap={6}>
        {displayPost()}

        {shouldDisplayButtons ? (
          <Box marginLeft="auto">
            <NextLink href={`edit/${routerId}`}>
              <Button marginRight={3}>Edit</Button>
            </NextLink>

            <Button
              onClick={async () => {
                await deletePost({
                  variables: { id: postId },
                  update: (cache) => {
                    cache.evict({ id: `Post:${postId}` });
                  },
                });

                router.push("/");
              }}
            >
              Delete
            </Button>
          </Box>
        ) : null}
      </Grid>
    </Layout>
  );

  function displayPost() {
    if (postLoading) return null;

    if (postData?.post) {
      return (
        <>
          <Heading>{postData?.post?.title}</Heading>
          <Text>{postData?.post?.text}</Text>
        </>
      );
    }

    return <Text textAlign="center">We couldn't display this post.</Text>;
  }
};

export default withApollo({ ssr: true })(Post);
