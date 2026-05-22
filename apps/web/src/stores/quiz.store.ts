// Quiz state definitions (no enums — string unions)
export interface QuizAnswer {
  questionId: string;
  selectedOption: string;
}

export interface StyleQuizState {
  answers: QuizAnswer[];
  currentStep: number;
  totalSteps: number;
  setStep: (step: number) => void;
  answerQuestion: (questionId: string, option: string) => void;
  back: () => void;
  reset: () => void;
  setTotalSteps: (n: number) => void;
  /** Derived: true when all questions answered */
  checkIsComplete: (totalQuestions: number) => boolean;
}
