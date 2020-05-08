import React from 'react';
import PropTypes from 'prop-types';
import tally from '../helpers/tally';
import {
  Layer,
  Group,
  Text
} from 'react-konva';

const Results = ({ userAnswers, restartQuiz }) => {
  const triesTotal = tally(userAnswers);
  const oneTry = triesTotal[1] && <Text><strong>{triesTotal[1]}</strong> on the first try.</Text>;
  const twoTries = triesTotal[2] && <Text><strong>{triesTotal[2]}</strong> on the second try.</Text>;
  const threeTries = triesTotal[3] && <Text><strong>{triesTotal[3]}</strong> on the third try.</Text>;
  const fourTries = triesTotal[4] && <Text><strong>{triesTotal[4]}</strong> on the fourth try.</Text>;

  return (
    <Layer
      className="results-container"
      style={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        fontSize: '1.75em',
        lineHeight: '1.75em',
        animation: 'slide-in .4s ease',
      }}
    >
      <Group
        style={{
          fontSize: '1.25em',
          margin: '0 0 15px',
        }}
      >Quiz Results</Group>
      <Group>You answered...</Group>
      {oneTry}
      {twoTries}
      {threeTries}
      {fourTries}
      <Group onClick={restartQuiz}>Restart Quiz</Group>
    </Layer>
  );
};

Results.propTypes = {
  userAnswers: PropTypes.array.isRequired,
  restartQuiz: PropTypes.func.isRequired
};

export default Results;
