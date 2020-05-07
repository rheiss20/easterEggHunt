import React from 'react';
import PropTypes from 'prop-types';
import Answer from './Answer';
import { Group } from 'react-konva';

const Question = ({ question, answers, handleAnswerClick, handleEnterPress }) => {
  return (
    <Group
      className="question"
      style={{
        fontSize: '2em',
      }}
    >
      <Group
        className="question-title"
        tabIndex="0"
        style={{
          fontSize: '1.25em',
          margin: '0 0 15px',
        }}
      >
        {question}
      </Group>
      <Group
        className="question-answers"
        tabIndex="-1"
        style={{
          padding: '0',
          marginTop: '.75em',
          paddingLeft: '1.2em',
        }}
      >
        {answers.map((answer, index) => {
          return (
            <Answer
              key={answer.key}
              answer={answer}
              handleAnswerClick={handleAnswerClick(index)}
              handleEnterPress={handleEnterPress(index)}
            />
          );
        })}
      </Group>
    </Group>
  );
};

Question.propTypes = {
  question: PropTypes.element.isRequired,
  answers: PropTypes.array.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default Question;
