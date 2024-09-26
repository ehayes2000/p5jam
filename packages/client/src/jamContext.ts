import { create, StoreApi } from 'zustand'

type JamPopup = 'none' | 'createJam' | 'joinJam'
interface StoreType {
  jamPopup: JamPopup
  setPopup: (newState: JamPopup) => void
}

const useStore = create<StoreType>(
  (set) =>
    ({
      jamPopup: 'none',
      setPopup: (newState) =>
        set((state: StoreType) => ({ jamPopup: newState })),
    }) as StoreType,
)

export default useStore
