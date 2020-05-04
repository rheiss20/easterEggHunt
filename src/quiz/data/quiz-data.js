import React from 'react';

const QUESTION_DATA = [
  {
    question: <span>Do you love Easter?</span>,
    answers: [
      <span>It&apos;s okay, I guess.</span>,
      <span>I love it more than my own life!</span>,
      <span>Easter sucks</span>,
      <span>I like Easter</span>
    ],
    correct: 1
  },
  {
    question: <span>How many eggs were in the second house?</span>,
    answers: [
      <span>5</span>,
      <span>10</span>,
      <span>15</span>,
      <span>20</span>
    ],
    correct: 2
  },
  {
    question: <span>What room in the first house had the most eggs?</span>,
    answers: [
      <span>Bathroom</span>,
      <span>Kitchen</span>,
      <span>Living Room</span>,
      <span>Bedroom</span>
    ],
    correct: 3
  },
  {
    question: <span>What is the family name of the couple that lives in the second house?</span>,
    answers: [
      <span>NAME INPUT FROM BEGINNING</span>,
      <span>Tobias</span>,
      <span>Coneys</span>,
      <span>Peters</span>
    ],
    correct: 1
  },
  {
    question: <span>What was the family name of the family that lived in the first house?</span>,
    answers: [
      <span>Cirillo</span>,
      <span>Zeng</span>,
      <span>Olegário</span>,
      <span>Fernandez-Beleta</span>
    ],
    correct: 2
  },
  {
    question: <span>Which house was your favorite?</span>,
    answers: [
      <span>Second house (no pets, works days, leaves door unlocked)</span>,
      <span>First house (<s>always gone</s> NO!!)</span>,
      <span>Third house (heavy sleeper, )</span>,
      <span>Fifth house (didn&apos;t need camera, didn&apos;t need to clean)</span>
    ],
    correct: 0
  },
  {
    question: <span>What happened to the family in the first house?</span>,
    answers: [
      <span>I don&apos;t know</span>,
      <span>Nothing, they&apos;re fine</span>,
      <span>               </span>,
      <span>It was either you or them</span>
    ],
    correct: 2
  },
  {
    question: <span>Will they find anything?</span>,
    answers: [
      <span>No, I collected all the pieces</span>,
      <span>No, I searched everywhere</span>,
      <span>No, I changed the photos</span>,
      <span>All of the above.</span>
    ],
    correct: 3
  },
  {
    question: <span>What is CORS?</span>,
    answers: [
      <span>Cross-Origin Resource Sharing</span>,
      <span>Allows restricted resources (e.g. fonts) on a web page to be requested from an outside domain.</span>,
      <span>Allows scripts to interact more openly with content outside of the original domain, leading to better integration between web services.</span>,
      <span>All of the above.</span>
    ],
    correct: 3
  },
  {
    question: <span>What is an Angular expression?</span>,
    answers: [
      <span>A JavaScript-like code snippet that is evaluated by Angular.</span>,
      <span>A code snippet that is evaluated in the context of the current model scope, rather than within the scope of the global context (window).</span>,
      <span>A binding in double curly brackets that gets evaluated and the results appear in the DOM in place of it.</span>,
      <span>All of the above.</span>
    ],
    correct: 3
  }
];

export default QUESTION_DATA;
