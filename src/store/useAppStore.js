import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      profile: null,
      currentExperience: null,
      currentSession: null,
      currentEntry: null,

      selectedTags: {
        north: [],
        south: [],
        east: [],
        west: [],
      },

      connections: [],

      synthesisTitle: '',
      weather: '',
      comment: '',

      setProfile: (profile) =>
        set({ profile }),

      setCurrentExperience: (experience) =>
        set({ currentExperience: experience }),

      setCurrentSession: (session) =>
        set({ currentSession: session }),

      setCurrentEntry: (entry) =>
        set({ currentEntry: entry }),

      setSelectedTags: (tags) =>
        set({ selectedTags: tags }),

      addConnection: (connection) =>
        set((state) => ({
          connections: [
            ...state.connections,
            connection,
          ],
        })),

      removeConnection: (from, to) =>
        set((state) => ({
          connections: state.connections.filter((connection) => {
            const sameDirection =
              connection.from === from &&
              connection.to === to

            const reverseDirection =
              connection.from === to &&
              connection.to === from

            return !sameDirection && !reverseDirection
          }),
        })),

      setSynthesisTitle: (title) =>
        set({ synthesisTitle: title }),

      setWeather: (weather) =>
        set({ weather }),

      setComment: (comment) =>
        set({ comment }),

      resetJourney: () =>
        set({
          currentExperience: null,
          currentSession: null,
          currentEntry: null,
          selectedTags: {
            north: [],
            south: [],
            east: [],
            west: [],
          },
          connections: [],
          synthesisTitle: '',
          weather: '',
          comment: '',
        }),
    }),
    {
      name: 'boussole-storage',
    }
  )
)
