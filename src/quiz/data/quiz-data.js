import React from 'react';

const QUESTION_DATA = [
  {
    question: <span key={'q1'}>Do you love Easter?</span>,
    answers: [
      <span key={'a'}>It's okay, I guess.</span>,
      <span key={'b'}>I love it more than my own life!</span>,
      <span key={'c'}>Easter sucks</span>,
      <span key={'d'}>I like Easter</span>
    ],
    correct: 1
  },
  {
    question: <span key={'q2'}>How many eggs were in the first house?</span>,
    answers: [
      <span key={'a'}>36</span>,
      <span key={'b'}>2</span>,
      <span key={'c'}>23</span>,
      <span key={'d'}>50</span>
    ],
    correct: 3
  },
  {
    question: <span key={'q3'}>How many eggs were in the second house?</span>,
    answers: [
      <span key={'a'}>5</span>,
      <span key={'b'}>10</span>,
      <span key={'c'}>15</span>,
      <span key={'d'}>20</span>
    ],
    correct: 1
  },
  {
    question: <span key={'q4'}>Which room in the first house had the fewest eggs?</span>,
    answers: [
      <span key={'a'}>Bathroom</span>,
      <span key={'b'}>Living Room</span>,
      <span key={'c'}>Laundry Hall</span>,
      <span key={'d'}>Bedroom</span>
    ],
    correct: 2
  },
  {
    question: <span key={'q5'}>What is the last name of the family that lives in the second house?</span>,
    answers: [
      <span key={'a'}>nameInputFromBeginning</span>,
      <span key={'b'}>Tobias</span>,
      <span key={'c'}>Coneys</span>,
      <span key={'d'}>Peters</span>
    ],
    correct: 1
  },
  {
    question: <span key={'q6'}>What <strong>was</strong> the last name of the couple that lived in the first house?</span>,
    answers: [
      <span key={'a'}>Cirillo</span>,
      <span key={'b'}>Zeng</span>,
      <span key={'c'}>Olegário</span>,
      <span key={'d'}>Fernandez-Beleta</span>
    ],
    correct: 2
  },
  {
    question: <span key={'q7'}>Which house was your favorite?</span>,
    answers: [
      <span key={'a'}>Second house (no pets, works days, leaves door unlocked)</span>,
      <span key={'b'}>First house <s>(always gone)</s></span>,
      <span key={'c'}>Third house (heavy sleeper)</span>,
      <span key={'d'}>Fifth house (didn't need camera, didn't need to clean)</span>
    ],
    correct: 0
  },
  {
    question: <span key={'q8'}>What happened to the Olegário couple?</span>,
    answers: [
      <span key={'a'}>I don't know</span>,
      <span key={'b'}>Nothing, they're fine</span>,
      <span key={'c'}>               </span>,
      <span key={'d'}>It was either you or them</span>
    ],
    correct: 2
  },
  {
    question: <span key={'q9'}>                             </span>,
    answers: [
      <span key={'a'}>No, I'm much too smart for them</span>,
      <span key={'b'}>No, I put everything back EXACTLY the way I found it</span>,
      <span key={'c'}>No, I covered up the important parts of the pictures</span>,
      <span key={'d'}>All of the above.</span>
    ],
    correct: 3
  },
  {
    question: <span key={'q10'}>Where did you leave them?</span>,
    answers: [
      <span key={'a'}>Bathroom</span>,
      <span key={'b'}>Bathroom</span>,
      <span key={'c'}>Bathroom</span>,
      <span key={'d'}>Bathroom</span>
    ],
    correct: 2
  },
];

export default QUESTION_DATA;
