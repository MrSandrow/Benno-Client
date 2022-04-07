import { ApolloCache, gql } from "@apollo/client";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

export const useVote = (post: PostSnippetFragment) => {
  const postId = post.id;
  const previousVoteStatus = post.voteStatus || 0;

  const [voteMutation] = useVoteMutation();

  function upvote() {
    if (previousVoteStatus === -1) {
      vote(2);
      return;
    }

    if (previousVoteStatus === 0) {
      vote(1);
      return;
    }

    if (previousVoteStatus === 1) {
      vote(-1);
      return;
    }
  }

  function downvote() {
    if (previousVoteStatus === -1) {
      vote(1);
      return;
    }

    if (previousVoteStatus === 0) {
      vote(-1);
      return;
    }

    if (previousVoteStatus === 1) {
      vote(-2);
      return;
    }
  }

  return { upvote, downvote };

  function vote(value: number) {
    voteMutation({
      variables: { value, postId },
      update: (cache) => {
        updateAfterVote(value, postId, cache);
      },
    });
  }
};

type PostContent = {
  id: number;
  points: number;
  voteStatus: number | null;
};

function updateAfterVote(
  value: number,
  postId: number,
  cache: ApolloCache<VoteMutation>
) {
  const data = cache.readFragment<PostContent>({
    id: `Post:${postId}`,
    fragment: gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
  });

  if (!data) return;

  const newPoints = data.points + value;
  const newVoteStatus = (data.voteStatus || 0) + value;

  cache.writeFragment({
    id: `Post:${postId}`,
    fragment: gql`
      fragment __ on Post {
        id
        points
        voteStatus
      }
    `,
    data: {
      points: newPoints,
      voteStatus: newVoteStatus,
      id: postId,
    },
  });
}
