import React from 'react';

const QUESTION_DATA = [
  {
    question: <span>Do you love Easter?</span>,
    answers: [
      <span key={'ans1'}>It&apos;s okay, I guess.</span>,
      <span key={'ans2'}>I love it more than my own life!</span>,
      <span key={'ans3'}>Easter sucks</span>,
      <span key={'ans4'}>I like Easter</span>
    ],
    correct: 1
  },
  {
    question: <span>How many eggs were in the second house?</span>,
    answers: [
      <span key={'ans1'}>5</span>,
      <span key={'ans2'}>10</span>,
      <span key={'ans3'}>15</span>,
      <span key={'ans4'}>20</span>
    ],
    correct: 2
  },
  {
    question: <span>What room in the first house had the most eggs?</span>,
    answers: [
      <span key={'ans1'}>Bathroom</span>,
      <span key={'ans2'}>Kitchen</span>,
      <span key={'ans3'}>Living Room</span>,
      <span key={'ans4'}>Bedroom</span>
    ],
    correct: 3
  },
  {
    question: <span>What is the family name of the couple that lives in the second house?</span>,
    answers: [
      <span key={'ans1'}>NAME INPUT FROM BEGINNING</span>,
      <span key={'ans2'}>Tobias</span>,
      <span key={'ans3'}>Coneys</span>,
      <span key={'ans4'}>Peters</span>
    ],
    correct: 1
  },
  {
    question: <span>What was the family name of the family that lived in the first house?</span>,
    answers: [
      <span key={'ans1'}>Cirillo</span>,
      <span key={'ans2'}>Zeng</span>,
      <span key={'ans3'}>Olegário</span>,
      <span key={'ans4'}>Fernandez-Beleta</span>
    ],
    correct: 2
  },
  {
    question: <span>Which house was your favorite?</span>,
    answers: [
      <span key={'ans1'}>Second house (no pets, works days, leaves door unlocked)</span>,
      <span key={'ans2'}>First house (<s>always gone</s> NO!!)</span>,
      <span key={'ans3'}>Third house (heavy sleeper, )</span>,
      <span key={'ans4'}>Fifth house (didn&apos;t need camera, didn&apos;t need to clean)</span>
    ],
    correct: 0
  },
  {
    question: <span>What happened to the family in the first house?</span>,
    answers: [
      <span key={'ans1'}>I don&apos;t know</span>,
      <span key={'ans2'}>Nothing, they&apos;re fine</span>,
      <span key={'ans3'}>               </span>,
      <span key={'ans4'}>It was either you or them</span>
    ],
    correct: 2
  },
  {
    question: <span>Will they find anything?</span>,
    answers: [
      <span key={'ans1'}>No, I collected all the pieces</span>,
      <span key={'ans2'}>No, I searched everywhere</span>,
      <span key={'ans3'}>No, I changed the photos</span>,
      <span key={'ans4'}>All of the above.</span>
    ],
    correct: 3
  },
  {
    question: <span>What is CORS?</span>,
    answers: [
      <span key={'ans1'}>Cross-Origin Resource Sharing</span>,
      <span key={'ans2'}>Allows restricted resources (e.g. fonts) on a web page to be requested from an outside domain.</span>,
      <span key={'ans3'}>Allows scripts to interact more openly with content outside of the original domain, leading to better integration between web services.</span>,
      <span key={'ans4'}>All of the above.</span>
    ],
    correct: 3
  },
  {
    question: <span>What is an Angular expression?</span>,
    answers: [
      <span key={'ans1'}>A JavaScript-like code snippet that is evaluated by Angular.</span>,
      <span key={'ans2'}>A code snippet that is evaluated in the context of the current model scope, rather than within the scope of the global context (window).</span>,
      <span key={'ans3'}>A binding in double curly brackets that gets evaluated and the results appear in the DOM in place of it.</span>,
      <span key={'ans4'}>All of the above.</span>
    ],
    correct: 3
  }
];

export default QUESTION_DATA;
