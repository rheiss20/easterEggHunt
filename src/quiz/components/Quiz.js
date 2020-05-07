import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Group,
} from 'react-konva';
import QuestionList from './QuestionList';

const Quiz = ({ step, questions, totalQuestions, handleAnswerClick, handleEnterPress }) => {
  return (
    <Group className="wrapper">
      <Group
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '20px',
      }}
      >
        <Group className="question-count">
          <Text
            text="Question"
            style={{
              fontSize: `1.25em`,
              margin: `0 0 15px`,
            }}
          />
          <Text
            className="question-number"
            text={step}
            style={{
              fontSize: '4em',
              fontWeight: '100',
            }}
          />
          <Text
            className="description"
            text={`of ${totalQuestions}`}
            style={{
              fontSize: '1.5em',
            }}
          />
        <Text
          text="Custom Quiz"
          style={{
            fontWeight: 'normal',
            fontSize: `2.25em`,
            textTransform: `uppercase`,
            letterSpacing: `-1px`,
            textAlign: `center`,
          }}
        />
        </Group>
      </Group>

      <Group
        className="questions"
        style={{
          width: '85%',
          margin: '35px auto 0',
        }}
      >
        <QuestionList
          questions={questions}
          handleAnswerClick={handleAnswerClick}
          handleEnterPress={handleEnterPress}
        />
      </Group>
    </Group>
  );
};

Quiz.propTypes = {
  step: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default Quiz;
