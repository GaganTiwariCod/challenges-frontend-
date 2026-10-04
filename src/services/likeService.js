import { challengeApi } from '../api/challenge.api';

export const likeService = {
  toggle: async (challengeId, isLiked) => {
    if (isLiked) {
      return challengeApi.unlikeChallenge(challengeId);
    } else {
      return challengeApi.likeChallenge(challengeId);
    }
  }
};
