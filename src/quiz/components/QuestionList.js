import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';
import { Group } from 'react-konva';

const QuestionList = ({ questions, handleAnswerClick, handleEnterPress }) => {
  return (
    <Group
      className="question-list"
      // style={{
      //   padding: 0,
      // }}
    >
      {questions.map(question => {
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
    </Group>
  );
};

QuestionList.propTypes = {
  questions: PropTypes.array.isRequired,
  handleAnswerClick: PropTypes.func.isRequired,
  handleEnterPress: PropTypes.func.isRequired
};

export default QuestionList;
