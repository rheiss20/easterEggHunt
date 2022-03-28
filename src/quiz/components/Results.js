import React from 'react';
import PropTypes from 'prop-types';
import tally from '../helpers/tally';

const Results = ({ userAnswers, name, setStatus }) => {
  const triesTotal = tally(userAnswers);

  console.log(triesTotal);

  const generateResultsScreen = () => {
    if (triesTotal[1] === 10) {
      return (
        <div className="results-container">
          <h2>Is that actually you?</h2>
          <div>You got all the questions right on the first try.</div>
          <div>It must really be you...</div>
          <div>You&#39;ve come back to me.</div>
          <div>Or you are a stranger...</div>
          <div>Either way, it doesn&#39;t matter if you are him or not.</div>
          <div>He already knows what happens next. He couldn&#39;t stop it then, and he can&#39;t stop it now.</div>
          <br/>
          <div>And neither can you.</div>
          <a onClick={() => { setStatus('after quiz'); }}>GO ON</a>
        </div>);
    } else {
      return (
        <div className="results-container">
          <h2>Who are you, <strong>{name}</strong>?</h2>
          <br/>
          <div><strong>{name}</strong> got <strong>{triesTotal[1]}</strong> questions right on the first try.</div>
          <div>You are obviously not him. You are a stranger.</div>
          <div>How did you find this page? What lead you here?</div>
          <br/>
          <div>I am sure that it doesn&#39;t matter.</div>
          <div>Would you like to see what happened to him?</div>
          <br/>
          <div>Of course you do.</div>
          <a onClick={() => { setStatus('after quiz'); }}>GO ON</a>
        </div>
      );
    }
  };

  return generateResultsScreen();
};

Results.propTypes = {
  userAnswers: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired
};

export default Results;
