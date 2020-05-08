import React, { Component } from 'react';
import QuizApp from './components/QuizApp';

export class QuizSection extends Component {
  render() {
    return (
      <QuizApp
        totalQuestions={10}
      />
    )
  }
}
