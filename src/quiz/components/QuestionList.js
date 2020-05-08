import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';

const QuestionList = ({ questions, handleAnswerClick, handleEnterPress }) => {
  return (
    <ul className="question-list">
      {questions.map(question => {
        console.log('question: ', question);
        console.log('question.question: ', question.question);
        console.log('question.question.props: ', question.question.props);
        console.log('question.question.props.children: ', question.question.props.children);
        return (
          <Question
            key={question.question.key}
            question={question.question}
            answers={question.answers}
            handleAnswerClick={handleAnswerClick}
            handleEnterPress={handleEnterPress}
          />
        );
      })}
    </ul>
  );
};

QuestionList.propTypes = {
  questions: PropTypes.array.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default QuestionList;
