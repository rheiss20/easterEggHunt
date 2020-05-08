import React from 'react';
import PropTypes from 'prop-types';

const Answer = ({ answer, handleAnswerClick, handleEnterPress, name }) => {
  let generateAnswerToQuestion = () => {
    if (answer.props.children === 'nameInputFromBeginning') {
      return name;
    } else {
      return answer;
    }
  };

  return (
    <li
      className="question-answer"
      tabIndex="0"
      onClick={handleAnswerClick}
      onKeyDown={handleEnterPress}
    >
      {generateAnswerToQuestion()}
    </li>
  );
};

Answer.propTypes = {
  answer: PropTypes.element.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default Answer;
