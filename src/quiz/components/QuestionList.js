import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';

const QuestionList = ({ questions, handleAnswerClick, handleEnterPress, name }) => {
  return (
    <ul className="question-list">
      {questions.map(question => {
        return (
          <Question
            key={question.question.key}
            question={question.question}
            answers={question.answers}
            handleAnswerClick={handleAnswerClick}
            handleEnterPress={handleEnterPress}
            name={name}
          />
        );
      })}
    </ul>
  );
};

QuestionList.propTypes = {
  questions: PropTypes.array.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default QuestionList;
