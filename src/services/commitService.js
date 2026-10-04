import {mock} from './http'
export const commitService = { listByChallenge: (id) => mock([]), create: (id, text) => mock({id, text}) }
