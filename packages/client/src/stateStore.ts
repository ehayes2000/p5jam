import { create } from 'zustand'
import { type TJam, type TEditPost } from './client'

type JamPopup = 'none' | 'createJam' | 'joinJam'

interface StoreType {
  jamPopup: JamPopup
  setPopup: (newState: JamPopup) => void
  jam: TJam | null
  setJam: (newJam: TJam | null) => void
  post: TEditPost | null
  setPost: (newPost: TEditPost | null) => void
}

const useStore = create<StoreType>((set) => ({
  jamPopup: 'none',
  setPopup: (newPopup) => set((state) => ({ ...state, jamPopup: newPopup })),
  jam: null,
  setJam: (newJam) => set((state) => ({ ...state, jam: newJam })),
  post: null,
  setPost: (newPost: TEditPost | null) =>
    set((state) => ({ ...state, post: newPost })),
}))

export default useStore
