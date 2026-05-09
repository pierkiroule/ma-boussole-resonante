import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const emptyTags = {
  north: [],
  south: [],
  east: [],
  west: [],
}

export const useAppStore = create(
  persist(
    (set) => ({
      profile: null,
      selectedTags: emptyTags,
      connections: [],

      setProfile: (profile) =>
        set({ profile }),

      setSelectedTags: (selectedTags) =>
        set({ selectedTags }),

      addConnection: (connection) =>
        set((state) => ({
          connections: [
            ...(state.connections || []),
            connection,
          ],
        })),

      removeConnection: (from, to) =>
        set((state) => ({
          connections: (state.connections || []).filter((connection) => {
            const same =
              connection.from === from &&
              connection.to === to

            const reverse =
              connection.from === to &&
              connection.to === from

            return !same && !reverse
          }),
        })),

      resetJourney: () =>
        set({
          selectedTags: emptyTags,
          connections: [],
        }),
    }),
    {
      name: 'boussole-storage',
    }
  )
)
