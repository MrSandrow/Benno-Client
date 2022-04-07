import { Button, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import NextLink from "next/link";
import { isServer } from "../utils/isServer";
import UpdootSection from "../components/UpdootSection";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    skip: isServer(),
    variables: { limit: 5, cursor: null },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <Layout variant="regular">
      <Flex justifyContent="space-between">
        <Heading marginLeft={0.5}>Benno</Heading>
        <NextLink href="/create-post">
          <Button>Create Post</Button>
        </NextLink>
      </Flex>

      {displayPosts()}
    </Layout>
  );

  function displayPosts() {
    if (data) {
      return (
        <>
          <Stack marginTop={4} spacing={2}>
            {data.posts.posts.map((post) => (
              <Grid
                key={post.id}
                p={5}
                shadow="md"
                borderRadius="md"
                borderWidth="1px"
                gridAutoFlow="column"
                gridTemplateColumns="auto 1fr"
                alignItems="center"
                gap={4}
                textAlign="center"
              >
                <UpdootSection post={post} />

                <NextLink href={`/post/${post.id}`}>
                  <a>
                    <Grid gap={1}>
                      <Heading fontSize="xl">{post.title}</Heading>
                      <Text>By {post.creator.username}</Text>
                      <Text textAlign={"center"} marginTop={2}>
                        {post.text}
                      </Text>
                    </Grid>
                  </a>
                </NextLink>
              </Grid>
            ))}
          </Stack>

          {data.posts.hasMore && (
            <Flex justifyContent="center" marginTop={8}>
              <Button isLoading={loading} onClick={handleClick}>
                Load more
              </Button>
            </Flex>
          )}
        </>
      );
    }

    return (
      <Text marginTop={6} textAlign="center">
        There are no posts yet.
      </Text>
    );
  }

  function handleClick() {
    if (!data || !data.posts.posts.length) return;

    const lastPost = data.posts.posts[data.posts.posts.length - 1];
    const lastPostCreationDate = lastPost.createdAt;

    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: lastPostCreationDate,
      },
    });
  }
};

export default withApollo({ ssr: true })(Index);
