"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@luxeverse/utils";
import { useStyleQuizStore } from "../../stores/style-quiz";
import { useStyleProfileStore } from "../../stores/style-profile";

function clearQuizDraft(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("style-quiz-draft");
  }
}

// ============================================================================
// Quiz Data (extracted to JSON for easy editing)
// ============================================================================

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string; image?: string }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "persona",
    question: "Which style persona resonates with you most?",
    options: [
      { label: "Romantic", value: "romantic" },
      { label: "Minimalist", value: "minimalist" },
      { label: "Bold", value: "bold" },
      { label: "Classic", value: "classic" },
    ],
  },
  {
    id: "occasion",
    question: "What's your most frequent dressing occasion?",
    options: [
      { label: "Work", value: "work" },
      { label: "Weekend", value: "weekend" },
      { label: "Evening", value: "evening" },
      { label: "Travel", value: "travel" },
    ],
  },
  {
    id: "color",
    question: "Pick a color palette that speaks to you:",
    options: [
      { label: "Obsidian & Champagne", value: "obsidian,champagne" },
      { label: "Navy & Cream", value: "navy,cream" },
      { label: "Emerald & Gold", value: "emerald,gold" },
      { label: "Burgundy & Blush", value: "burgundy,blush" },
    ],
  },
  {
    id: "fit",
    question: "How do you prefer your clothes to fit?",
    options: [
      { label: "Tailored", value: "tailored" },
      { label: "Relaxed", value: "relaxed" },
      { label: "Oversized", value: "oversized" },
      { label: "Structured", value: "structured" },
    ],
  },
  {
    id: "budget",
    question: "What's your typical budget for a statement piece?",
    options: [
      { label: "Under $500", value: "500" },
      { label: "$500 – $1000", value: "1000" },
      { label: "$1000 – $2000", value: "2000" },
      { label: "$2000+", value: "5000" },
    ],
  },
];

// ============================================================================
// Component
// ============================================================================

export default function StyleQuizPage() {
  const { currentStep, answers, answerQuestion, back, reset } =
    useStyleQuizStore();
  const profile = useStyleProfileStore();
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentStep] ?? null;

  const handleAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      answerQuestion(currentQuestion.id, value);

      if (currentStep >= totalSteps - 1) {
        setIsComplete(true);
      }
    },
    [currentQuestion, currentStep, totalSteps, answerQuestion]
  );

  const handleBack = useCallback(() => {
    if (isComplete) {
      setIsComplete(false);
    }
    back();
  }, [isComplete, back]);

  const handleReset = useCallback(() => {
    reset();
    setIsComplete(false);
    clearQuizDraft();
  }, [reset]);

  // ------------------------------------------------------------------
  // localStorage draft persistence
  // ------------------------------------------------------------------
  useEffect(() => {
    // Save draft whenever answers change
    if (answers.length > 0) {
      const draft = {
        currentStep,
        answers,
        isComplete,
      };
      localStorage.setItem("style-quiz-draft", JSON.stringify(draft));
    }
  }, [currentStep, answers, isComplete]);

  useEffect(() => {
    // Restore draft on mount if present and user hasn't completed
    const saved = localStorage.getItem("style-quiz-draft");
    if (saved && answers.length === 0) {
      try {
        const draft = JSON.parse(saved) as {
          currentStep: number;
          answers: typeof answers;
          isComplete: boolean;
        };
        if (draft.answers.length > 0 && !isComplete) {
          // We only restore if the Zustand store is empty
          // (avoids overwriting server-persisted state)
          // In a real app we'd check timestamps
          draft.answers.forEach((a) => {
            answerQuestion(a.questionId, a.selectedOption);
          });
          setIsComplete(draft.isComplete);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Allow manual saving before unload
  useEffect(() => {
    function handleBeforeUnload() {
      if (answers.length > 0 && !isComplete) {
        const draft = { currentStep, answers, isComplete };
        localStorage.setItem("style-quiz-draft", JSON.stringify(draft));
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentStep, answers, isComplete]);

  // Sync profile when complete
  if (isComplete && answers.length > 0) {
    const persona = answers.find((a) => a.questionId === "persona")?.selectedOption ?? "minimalist";
    const colorAnswer = answers.find((a) => a.questionId === "color")?.selectedOption ?? "";
    const budget = answers.find((a) => a.questionId === "budget")?.selectedOption ?? "1000";

    if (profile.persona !== persona) {
      profile.setPersona(persona);
    }
    if (profile.favoriteColors.length === 0) {
      profile.setFavoriteColors(colorAnswer.split(","));
    }
    if (!profile.priceRange) {
      profile.setPriceRange(0, parseInt(budget, 10));
    }
  }

  // Completion state
  if (isComplete) {
    const persona = answers.find((a) => a.questionId === "persona")?.selectedOption ?? "minimalist";
    const colorAnswer = answers.find((a) => a.questionId === "color")?.selectedOption ?? "";

    return (
      <div className="container-custom py-12">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-3xl font-display text-obsidian-900">Your Style Profile</h1>
          <p className="text-obsidian-600">
            Based on your quiz, your dominant style is:
          </p>
          <div className="rounded-xl bg-obsidian-50 p-8">
            <h2 className="text-xl font-display capitalize text-obsidian-900">{persona}</h2>
            <p className="mt-2 text-sm text-obsidian-600">{colorAnswer.replace(/,/g, " & ")}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-obsidian-900 px-6 py-3 text-sm font-medium text-obsidian-900 transition-colors hover:bg-obsidian-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg bg-obsidian-900 px-6 py-3 text-sm font-medium text-obsidian-50 transition-colors hover:bg-obsidian-800"
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if current step is valid
  if (!currentQuestion) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-obsidian-600">Quiz not available.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-obsidian-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs text-obsidian-500">
              {Math.round(((currentStep) / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-obsidian-200">
            <div
              className="h-full rounded-full bg-metallic-gold transition-all duration-500"
              style={{ width: `${((currentStep) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="text-2xl font-display text-obsidian-900">
          {currentQuestion.question}
        </h1>

        {/* Options grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAnswer(option.value)}
              className={cn(
                "rounded-xl border-2 p-6 text-left transition-all",
                "border-obsidian-200 hover:border-metallic-gold hover:bg-obsidian-50",
                "focus:outline-hidden focus:ring-2 focus:ring-neon-cyan"
              )}
            >
              <span className="text-sm font-medium text-obsidian-900">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              currentStep === 0
                ? "cursor-not-allowed text-obsidian-400"
                : "text-obsidian-900 hover:bg-obsidian-100"
            )}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-obsidian-600 underline hover:text-obsidian-900"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
