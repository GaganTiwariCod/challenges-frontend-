import { commentApi } from '../api/comment.api';

export const commentService = {
  list: (challengeId, params) => commentApi.getComments(challengeId, params),
  create: (challengeId, content) => commentApi.addComment(challengeId, content),
  remove: (challengeId, commentId) => commentApi.deleteComment(challengeId, commentId)
};
