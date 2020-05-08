import React from 'react';
import { Text } from 'react-konva';


const QUESTION_DATA = [
  {
    question: <Text text="Do you love Easter?" key={'q1'}/>,
    answers: [
    <Text text="It's okay, I guess." key={'ans1'}/>,
    <Text text="I love it more than my own life!" key={'ans2'}/>,
    <Text text="Easter sucks" key={'ans3'}/>,
    <Text text="I like Easter" key={'ans4'}/>
  ],
  correct: 1
  },
  {
    question: <Text text="How many eggs were in the first house?" key={'q2'}/>,
    answers: [
    <Text text="36" key={'ans1'}/>,
    <Text text="2" key={'ans2'}/>,
    <Text text="23" key={'ans3'}/>,
    <Text text="50" key={'ans4'}/>
    ],
    correct: 3
  },
  {
    question: <Text text="How many eggs were in the second house?" key={'q3'}/>,
    answers: [
    <Text text="5" key={'ans1'}/>,
    <Text text="10" key={'ans2'}/>,
    <Text text="15" key={'ans3'}/>,
    <Text text="20" key={'ans4'}/>
  ],
    correct: 2
  },
  {
    question: <Text text="What room in the first house had the fewest eggs?" key={'q4'}/>,
    answers: [
    <Text text="Bathroom" key={'ans1'}/>,
    <Text text="Living Room" key={'ans2'}/>,
    <Text text="Laundry Hall" key={'ans3'}/>,
    <Text text="Bedroom" key={'ans4'}/>
  ],
    correct: 2
  },
  {
    question: <Text text="What is the last name of the family that lives in the second house?" key={'q5'}/>,
    answers: [
    <Text text="NAME INPUT FROM BEGINNING" key={'ans1'}/>,
    <Text text="Tobias" key={'ans2'}/>,
    <Text text="Coneys" key={'ans3'}/>,
    <Text text="Peters" key={'ans4'}/>
  ],
    correct: 1
  },
  {
    question: <Text text="What was the last name of the couple that lived in the first house?" key={'q6'}/>,
    answers: [
    <Text text="Cirillo" key={'ans1'}/>,
    <Text text="Zeng" key={'ans2'}/>,
    <Text text="Olegário" key={'ans3'}/>,
    <Text text="Fernandez-Beleta" key={'ans4'}/>
  ],
    correct: 2
  },
  {
    question: <Text text="Which house was your favorite?" key={'q7'}/>,
    answers: [
    <Text text="Second house (no pets, works days, leaves door unlocked)" key={'ans1'}/>,
    <Text text={`First house (<s>always gone</s>) NO!!`} key={'ans2'}/>,
    <Text text="Third house (heavy sleeper)" key={'ans3'}/>,
    <Text text="Fifth house (didn't need camera, didn't need to clean up)" key={'ans4'}/>
  ],
    correct: 0
  },
  {
    question: <Text text="What happened to the family in the first house?" key={'q8'}/>,
    answers: [
    <Text text="I don't know," key={'ans1'}/>,
    <Text text="Nothing, they're fine," key={'ans2'}/>,
    <Text text="               " key={'ans3'}/>,
    <Text text="It was either you or them" key={'ans4'}/>
  ],
    correct: 2
  },
  {
    question: <Text text="" key={'q9'}/>,
    answers: [
    <Text text="No, I collected all the pieces," key={'ans1'}/>,
    <Text text="No, I searched everywhere" key={'ans2'}/>,
    <Text text="No, I covered my tracks" key={'ans3'}/>,
    <Text text="All of the above" key={'ans4'}/>
  ],
    correct: 3
  },
  {
    question: <Text text="Where in the first house did IT happen?" key={'q10'}/>,
      answers: [
    <Text text="Bathroom" key={'ans1'}/>,
    <Text text="Bathroom" key={'ans2'}/>,
    <Text text="Bathroom" key={'ans3'}/>,
    <Text text="Bathroom" key={'ans4'}/>,
  ],
    correct: 3
  },
];

export default QUESTION_DATA;
