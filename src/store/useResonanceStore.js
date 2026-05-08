import { create } from 'zustand'

export const useResonanceStore = create((set) => ({
  entryId: null,

  weather: '',

  centerWord: '',

  heartSentence: '',

  gestureAnchor: '',

  selectedTags: {
    north: [],
    south: [],
    east: [],
    west: [],
  },

  setEntryId: (entryId) =>
    set({ entryId }),

  setWeather: (weather) =>
    set({ weather }),

  setCenterWord: (centerWord) =>
    set({ centerWord }),

  setHeartSentence: (heartSentence) =>
    set({ heartSentence }),

  setGestureAnchor: (gestureAnchor) =>
    set({ gestureAnchor }),

  toggleTag: (axis, tag) =>
    set((state) => {
      const current =
        state.selectedTags[axis]

      const exists =
        current.includes(tag)

      return {
        selectedTags: {
          ...state.selectedTags,

          [axis]: exists
            ? current.filter(
                (t) => t !== tag
              )
            : [...current, tag],
        },
      }
    }),

  resetResonance: () =>
    set({
      entryId: null,

      weather: '',

      centerWord: '',

      heartSentence: '',

      gestureAnchor: '',

      selectedTags: {
        north: [],
        south: [],
        east: [],
        west: [],
      },
    }),
}))
