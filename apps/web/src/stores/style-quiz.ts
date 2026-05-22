// Quiz persistence with partialize (domain data only, no UI state)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StyleQuizState } from "./quiz.store";

export const useStyleQuizStore = create<StyleQuizState>()(
  persist(
    (set) => ({
      answers: [],
      currentStep: 0,
      totalSteps: 5,

      setStep: (step) => set({ currentStep: step }),
      answerQuestion: (questionId, option) =>
        set((state) => {
          const filtered = state.answers.filter((a) => a.questionId !== questionId);
          return {
            answers: [...filtered, { questionId, selectedOption: option }],
            currentStep: state.currentStep + 1,
          };
        }),
      back: () =>
        set((state) => {
          if (state.currentStep <= 0) return state;
          return { currentStep: state.currentStep - 1 };
        }),
      reset: () =>
        set({
          answers: [],
          currentStep: 0,
        }),
      setTotalSteps: (n) => set({ totalSteps: n }),
      checkIsComplete: () => {
        return false; // computed in selector, not stored
      },
    }),
    {
      name: "luxeverse-quiz",
      partialize: (state) => ({
        answers: state.answers,
      }),
    }
  )
);
