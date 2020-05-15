import React from 'react';
import PropTypes from 'prop-types';
import tally from '../helpers/tally';

const Results = ({ userAnswers, restartQuiz, name, setStatus }) => {
  const triesTotal = tally(userAnswers);

  console.log(triesTotal);
  const oneTry = triesTotal[1] && <div><strong>{name}</strong> got <strong>{triesTotal[1]}</strong> questions right on the first try. THAT'S NOT ENOUGH</div>;

  const generateResultsScreen = () => {
    if (triesTotal[1] === 10) {
      return (
      <div className="results-container">
        <h2>NOW YOU KNOW WHAT I KNOW</h2>
        <a onClick={restartQuiz}>Do you want to see more?</a>
      </div>);
    } else {
      return (
        <div className="results-container">
          <h2>Who is <strong>{name}</strong>?</h2>
          <div>I CAN SEE YOU</div>
          {oneTry}
          {triesTotal[2] && <div>If {name} wants to see what's next, it is gonna have to do better than that.</div>}
          {triesTotal[3] && <div>It doesn't know the answers. It doesn't even know why it's here.</div>}
          {triesTotal[4] && <div>This quiz wasn't made for {name}. It isn't even fit to lick my boots.</div>}
          <a onClick={() => {setStatus('resume hunting')}}>LEAVE</a>
        </div>
      )
    }
  };

  return generateResultsScreen();
};

Results.propTypes = {
  userAnswers: PropTypes.array.isRequired,
  restartQuiz: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default Results;
