import React from 'react';
import PropTypes from 'prop-types';
import QuestionList from './QuestionList';

const Quiz = ({ step, questions, totalQuestions, handleAnswerClick, handleEnterPress, name }) => {
  return (
    <div className="wrapper">
      <header>
        <div className="question-count">
          <h2>Question</h2>
          <div className="question-number">{step}</div>
          <div className="description">of <span>{totalQuestions}</span></div>
        </div>
        <button onClick={ () => {
          alert(`You can't run away now.`);
        } }>GO BACK</button>
      </header>

      <div className="questions">
        <QuestionList
          questions={questions}
          handleAnswerClick={handleAnswerClick}
          handleEnterPress={handleEnterPress}
          name={name}
        />
      </div>
    </div>
  );
};

Quiz.propTypes = {
  step: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired
};

export default Quiz;
