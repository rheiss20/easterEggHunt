import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quiz from './Quiz';
import Results from './Results';
import QUESTION_DATA from '../data/quiz-data';
import { Group, Layer } from 'react-konva';

class QuizApp extends Component {
  state = {
    ...this.getInitialState(this.props.totalQuestions)
  };

  static propTypes = {
    totalQuestions: PropTypes.number.isRequired
  };

  getInitialState (totalQuestions) {
    const QUESTIONS = QUESTION_DATA.slice(0, 10);
    totalQuestions = Math.min(totalQuestions, QUESTION_DATA.length);

    return {
      questions: QUESTIONS,
      totalQuestions: totalQuestions,
      userAnswers: QUESTIONS.map(() => {
        return {
          tries: 0
        };
      }),
      step: 1,
      modal: {
        state: 'hide',
        praise: '',
        points: ''
      }
    };
  }

  handleAnswerClick = (index) => (e) => {
    const { questions, step, userAnswers } = this.state;
    const isCorrect = questions[0].correct === index;
    const currentStep = step - 1;
    const tries = userAnswers[currentStep].tries;

    if (isCorrect && e.target.nodeName === 'LI') {
      // Prevent other answers from being clicked after correct answer is clicked
      e.target.parentNode.style.pointerEvents = 'none';

      e.target.classList.add('right');

      userAnswers[currentStep] = {
        tries: tries + 1
      };

      this.setState({
        userAnswers: userAnswers
      });

      setTimeout(this.nextStep, 1000);
    } else if (e.target.nodeName === 'LI') {
      e.target.style.pointerEvents = 'none';
      e.target.classList.add('wrong');

      userAnswers[currentStep] = {
        tries: tries + 1
      };

      this.setState({
        userAnswers: userAnswers
      });
    }
  };

  handleEnterPress = (index) => (e) => {
    if (e.keyCode === 13) {
      this.handleAnswerClick(index)(e);
    }
  };

  nextStep = () => {
    const { questions, step } = this.state;
    const restOfQuestions = questions.slice(1);

    this.setState({
      step: step + 1,
      questions: restOfQuestions,
      modal: {
        state: 'hide'
      }
    });
  };

  restartQuiz = () => {
    this.setState({
      ...this.getInitialState(this.props.totalQuestions)
    });
  };

  render () {
    const { step, questions, userAnswers, totalQuestions } = this.state;

    if (step >= totalQuestions + 1) {
      return (
        <Results
          restartQuiz={this.restartQuiz}
          userAnswers={userAnswers}
        />
      );
    } else {
      return (
        <Group>
          <Quiz
            step={step}
            questions={questions}
            handleAnswerClick={this.handleAnswerClick}
            handleEnterPress={this.handleEnterPress}
            totalQuestions={totalQuestions}
          />
        </Group>
      );
    }
  }
}

export default QuizApp;
