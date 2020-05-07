import React from 'react';
import PropTypes from 'prop-types';
import { Group } from 'react-konva';

const Answer = ({ answer, handleAnswerClick, handleEnterPress }) => {
  return (
    <Group
      className="question-answer"
      tabIndex="0"
      onClick={handleAnswerClick}
      onKeyDown={handleEnterPress}
      style={{
        listStyleType: 'lower-alpha',
        cursor: 'pointer',
        padding: '.3em',
        marginBottom: '.3em',
        border: '5px solid transparent',
      }}
    >
      {answer}
    </Group>
  );
};

Answer.propTypes = {
  answer: PropTypes.element.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default Answer;
