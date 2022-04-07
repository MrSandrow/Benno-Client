import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Grid, IconButton, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { useVote } from "../hooks/useVote";

type Props = {
  post: PostSnippetFragment;
};

const UpdootSection: FC<Props> = ({ post }) => {
  const { upvote, downvote } = useVote(post);

  return (
    <Grid gap={1}>
      <IconButton
        onClick={upvote}
        size="xs"
        aria-label="Upvote"
        colorScheme={post.voteStatus === 1 ? "teal" : "gray"}
        icon={<ChevronUpIcon />}
      />

      <Text>{post.points}</Text>

      <IconButton
        onClick={downvote}
        size="xs"
        aria-label="Downvote"
        colorScheme={post.voteStatus === -1 ? "orange" : "gray"}
        icon={<ChevronDownIcon />}
      />
    </Grid>
  );
};

export default UpdootSection;
