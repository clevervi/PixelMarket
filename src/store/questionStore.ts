import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from '@/types';

interface QuestionStore {
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'helpful'>) => void;
  answerQuestion: (questionId: string, answer: string, answeredBy: string) => void;
  getProductQuestions: (productId: string) => Question[];
  markHelpful: (questionId: string) => void;
}

export const useQuestionStore = create<QuestionStore>()(
  persist(
    (set, get) => ({
      questions: [],

      addQuestion: (question) => {
        const newQuestion: Question = {
          ...question,
          id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          helpful: 0,
          createdAt: new Date(),
        };
        set((state) => ({ questions: [...state.questions, newQuestion] }));
      },

      answerQuestion: (questionId, answer, answeredBy) => {
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId
              ? { ...q, answer, answeredBy, answeredAt: new Date() }
              : q
          ),
        }));
      },

      getProductQuestions: (productId) => {
        return get().questions
          .filter((q) => q.productId === productId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      markHelpful: (questionId) => {
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId ? { ...q, helpful: q.helpful + 1 } : q
          ),
        }));
      },
    }),
    {
      name: 'questions-storage',
      skipHydration: true,
    }
  )
);
