'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Question {
  id: string;
  type: 'range' | 'select';
  options?: string[];
}

interface Answers {
  [key: string]: number | string;
}

const getRangeText = (value: number, type: string) => {
  const t = useTranslations('CarRecommendations');
  
      if (value <= 25) return t('notInterested');
      if (value <= 50) return t('normal');
      if (value <= 75) return t('interested');
      return t('veryInterested');
  }


const renderQuestion = (question: Question, answers: Answers, handleAnswer: (id: string, value: number | string) => void) => {
  const t = useTranslations('CarRecommendations');
  const isRangeType = question.type === 'range';

  return (
    <div key={question.id} className="mb-6">
      <label className="block text-lg font-medium text-gray-700 mb-2">
        {t(`questions.${question.id}`)}
      </label>
      {isRangeType ? (
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={answers[question.id] || 50}
            onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{t(`rangeLabels.${question.id}.min`)}</span>
            <span>{t(`rangeLabels.${question.id}.max`)}</span>
          </div>
          <div className="text-center text-sm font-medium text-gray-700 mt-2">
            {getRangeText(answers[question.id] as number || 50, question.id)}
          </div>
        </div>
      ) : (
        <select
          value={answers[question.id] || ''}
          onChange={(e) => handleAnswer(question.id, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">{t('selectPlaceholder')}</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>
              {t(`options.${question.id}.${option}`)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default function CarRecommendations() {
  const [answers, setAnswers] = useState<Answers>({});
  const t = useTranslations('CarRecommendations');

  const handleAnswer = (id: string, value: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const questions: Question[] = [
    { id: 'budget', type: 'range' },
    { id: 'cargoSpace', type: 'range' },
    { id: 'fuelEfficiency', type: 'range' },
    { id: 'luxury', type: 'range' },
    { id: 'performance', type: 'range' },
    { id: 'safety', type: 'range' },
    { id: 'tech', type: 'range' },
    { id: 'reliability', type: 'range' },
    { id: 'maintenance', type: 'range' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      <div className="max-w-2xl mx-auto">
        {questions.map(question => renderQuestion(question, answers, handleAnswer))}
      </div>
    </div>
  );
} 