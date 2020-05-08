import React from 'react';
import QuizApp from './components/QuizApp';
import './style.css';

export const QuizSection = (name) => {
  return (
    <QuizApp
      totalQuestions={10}
      name={name}
    />
  )
};
