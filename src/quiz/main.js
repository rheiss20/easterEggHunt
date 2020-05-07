import React, { Component } from 'react';
import QuizApp from './components/QuizApp';

export class QuizSection extends Component {
  render() {
    console.log('It actually renders the QuizSection component');
    return (
      <QuizApp
        totalQuestions={10}
      />
    )
  }
}
