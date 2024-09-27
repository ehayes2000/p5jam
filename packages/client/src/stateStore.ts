import { type TEditPost, type TJam } from './client'
import { createStore } from '@xstate/store'

export type JamPopup = 'none' | 'createJam' | 'joinJam'

export type StoreContext = {
  jamPopup: JamPopup
  jam: TJam | null
  post: TEditPost | null
}

export const store = createStore({
  // Initial context
  context: { jam: null, post: null, jamPopup: 'none' } as StoreContext,
  // Transitions
  on: {
    postCreated: (context, event: { payload: { post: TEditPost } }) => {
      return {
        ...context,
        post: event.payload.post,
      }
    },
    leftJam: (context) => {
      return {
        ...context,
        jam: null,
      }
    },
    receivedJamFromServer: (context, event: { payload: { jam: TJam } }) => {
      return {
        ...context,
        jam: event.payload.jam,
      }
    },
    userClickedJoinJam: (context) => {
      return {
        ...context,
        jamPopup: 'joinJam' as const,
      }
    },
    userClickedCreatedJam: (context) => {
      return {
        ...context,
        jamPopup: 'createJam' as const,
      }
    },
    userClosedPopup: (context) => {
      return {
        ...context,
        jamPopup: 'none' as const,
      }
    },
  },
})
