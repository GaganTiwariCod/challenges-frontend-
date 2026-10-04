import { challengeApi } from '../api/challenge.api';

export const challengeService = {
  list: (params) => challengeApi.getChallenges(params),
  get: (id) => challengeApi.getChallenge(id),
  create: (data) => challengeApi.createChallenge(data),
  update: (id, data) => challengeApi.updateChallenge(id, data),
  takeOath: (id, oathText) => challengeApi.takeOath(id, oathText),
  publish: (id) => challengeApi.publishChallenge(id),
  cancel: (id) => challengeApi.cancelChallenge(id),
  getCategories: () => challengeApi.getCategories()
};
