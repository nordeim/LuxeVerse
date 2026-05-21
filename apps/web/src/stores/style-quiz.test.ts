import { describe, it, expect } from "vitest";
import { useStyleQuizStore } from "./style-quiz";

describe("useStyleQuizStore", () => {
  it("starts at step 0 with no answers", () => {
    useStyleQuizStore.setState({
      answers: [],
      currentStep: 0,
      isComplete: false,
    });
    const state = useStyleQuizStore.getState();
    expect(state.answers).toHaveLength(0);
    expect(state.currentStep).toBe(0);
  });

  it("answers a question and advances step", () => {
    const { answerQuestion } = useStyleQuizStore.getState();
    answerQuestion("q1", "Option A");

    const state = useStyleQuizStore.getState();
    expect(state.answers).toHaveLength(1);
    expect(state.answers[0]).toEqual({ questionId: "q1", selectedOption: "Option A" });
    expect(state.currentStep).toBe(1);
  });

  it("goes back to previous step", () => {
    const { back } = useStyleQuizStore.getState();
    back();

    const state = useStyleQuizStore.getState();
    expect(state.currentStep).toBe(0);
  });

  it("resets quiz state", () => {
    useStyleQuizStore.setState((state) => {
      state.answerQuestion("q1", "Option B");
      return state;
    });

    const { reset } = useStyleQuizStore.getState();
    reset();

    const afterReset = useStyleQuizStore.getState();
    expect(afterReset.answers).toHaveLength(0);
    expect(afterReset.currentStep).toBe(0);
  });
});
