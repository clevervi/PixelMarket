'use client';

import { useState } from 'react';
import { FaThumbsUp, FaQuestionCircle } from 'react-icons/fa';
import { useQuestionStore } from '@/store/questionStore';
import { useUserStore } from '@/store/userStore';
import type { Question } from '@/types';

interface ProductQuestionsProps {
  productId: string;
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { getProductQuestions, addQuestion, answerQuestion, markHelpful } = useQuestionStore();
  const { user } = useUserStore();
  const questions = getProductQuestions(productId);

  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('You must log in to ask a question.');
      return;
    }

    addQuestion({
      productId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      question: questionText,
    });

    setQuestionText('');
    setShowForm(false);
  };

  return (
    <div className="bg-[#FDF5E6] p-8 rounded-lg space-y-6">
      {/* Header */}
      <div className="border-b border-[#F4A460] pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[#8B4513]">
            <FaQuestionCircle className="text-[#8B4513]" />
            Questions and Answers
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Ask a question
          </button>
        </div>
        <p className="text-[#2C1810]">
          {questions.length} {questions.length === 1 ? 'question' : 'questions'} about this product
        </p>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#FAEBD7] p-6 rounded-lg space-y-4 border-2 border-[#F4A460]">
          <h3 className="text-xl font-semibold text-[#8B4513]">Your question</h3>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-[#8B4513] rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[#2C1810]"
            placeholder="¿Qué quieres saber sobre este producto?"
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              Post question
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-[#8B4513] text-[#8B4513] rounded-lg hover:bg-[#FFF8DC] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Lista de preguntas */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-center text-[#8B4513] dark:text-[#F4A460] py-8">
            Be the first to ask a question about this product
          </p>
        ) : (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onMarkHelpful={markHelpful}
              onAnswer={(answer) => answerQuestion(question.id, answer, 'Seller')}
            />
          ))
        )}
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onMarkHelpful,
  onAnswer,
}: {
  question: Question;
  onMarkHelpful: (id: string) => void;
  onAnswer: (answer: string) => void;
}) {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(answerText);
    setAnswerText('');
    setShowAnswerForm(false);
  };

  return (
    <div className="bg-[#FDF5E6] rounded-lg border-2 border-[#F4A460] p-6 space-y-3 shadow-sm">
      {/* Pregunta */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <FaQuestionCircle className="text-[#8B4513] flex-shrink-0" />
              <span className="font-semibold text-[#8B4513]">{question.userName}</span>
              <span className="text-sm text-[#2C1810]">
                {new Date(question.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
            <p className="text-[#2C1810] ml-6">{question.question}</p>
          </div>
        </div>

        {/* Respuesta */}
        {question.answer ? (
          <div className="ml-6 mt-3 pl-4 border-l-2 border-[#F4A460] bg-[#FFE4B5] p-3 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[#8B4513]">{question.answeredBy}</span>
              <span className="text-sm text-[#2C1810]">
                {question.answeredAt && new Date(question.answeredAt).toLocaleDateString('es-ES')}
              </span>
            </div>
            <p className="text-[#2C1810]">{question.answer}</p>
          </div>
        ) : (
          <div className="ml-6 mt-2">
            {!showAnswerForm ? (
              <button
                onClick={() => setShowAnswerForm(true)}
                className="text-sm text-[#8B4513] hover:text-secondary"
              >
                Reply
              </button>
            ) : (
              <form onSubmit={handleSubmitAnswer} className="space-y-2">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-[#8B4513] rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-[#2C1810]"
                  placeholder="Write your answer..."
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1 bg-primary text-white text-sm rounded hover:bg-secondary"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAnswerForm(false)}
                    className="px-4 py-1 border border-[#8B4513] text-[#8B4513] text-sm rounded hover:bg-[#FFF8DC]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Útil */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#F4A460]">
        <button
          onClick={() => onMarkHelpful(question.id)}
          className="flex items-center gap-2 text-sm text-[#8B4513] hover:text-secondary transition-colors"
        >
          <FaThumbsUp />
          Helpful ({question.helpful})
        </button>
      </div>
    </div>
  );
}
