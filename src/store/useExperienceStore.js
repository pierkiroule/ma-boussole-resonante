import { create } from 'zustand'

export const useExperienceStore = create((set) => ({
  currentExperience: null,
  currentSession: null,

  setExperience: (experience) =>
    set({ currentExperience: experience }),

  setSession: (session) =>
    set({ currentSession: session }),

  clearExperience: () =>
    set({
      currentExperience: null,
      currentSession: null,
    }),
}))
