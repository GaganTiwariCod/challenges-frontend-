import {mock} from './http'
import {seed} from '../data/mock'
export const notificationService = { list: () => mock(seed.notes), markRead: (id) => mock(true) }
