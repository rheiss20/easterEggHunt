import React from 'react';
import PropTypes from 'prop-types';
import Answer from './Answer';

const Question = ({ question, answers, handleAnswerClick, handleEnterPress }) => {
  return (
    <li className="question">
      <h2 className="question-title" tabIndex="0">
        {question}
      </h2>
      <ul className="question-answers" tabIndex="-1">
        {answers.map((answer, index) => {
          console.log('answer: ', answer);
          console.log('answer.props: ', answer.props);
          console.log('answer.props.children: ', answer.props.children);
          return (
            <Answer
              key={answer.key}
              answer={answer}
              handleAnswerClick={handleAnswerClick(index)}
              handleEnterPress={handleEnterPress(index)}
            />
          );
        })}
      </ul>
    </li>
  );
};

Question.propTypes = {
  question: PropTypes.element.isRequired,
  answers: PropTypes.array.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default Question;
