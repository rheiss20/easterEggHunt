import maps from './maps';
import huntingMusicFile from './sounds/huntingMusic.mp3';
import secondHouseSoundsFile from './sounds/secondHouseSounds.mp3';
import eggPopSoundFile from './sounds/pop1.mp3';
import keySoundFile from './sounds/key.mp3';
import congratsFile from './sounds/congratulations.mp3';
import congratsFile2 from './sounds/congratulations2.mp3';
import React from 'react';

const huntingMusic = new Audio(huntingMusicFile);
const secondHouseSounds = new Audio(secondHouseSoundsFile);
const eggPopSound = new Audio(eggPopSoundFile);
const keySound = new Audio(keySoundFile);
const congratsSound = new Audio(congratsFile);
const congratsSound2 = new Audio(congratsFile2);

export const setImageForRoom = (roomToChange, imageToChangeTo) => {
  const image = new window.Image();
  image.src = imageToChangeTo;
  roomToChange.image = image;
};

// Preload all the maps, also how the images are generated
Object.keys(maps).forEach(key => {
  // Fake images for populating the inspect element with junk
  setImageForRoom(maps[key], maps[key].fakeImageName);
  setImageForRoom(maps[key], maps[key].imageName);
});

export const controlAudio = (command, file) => {
  if (file === 'hunting') {
    if (command === 'play') {
      huntingMusic.loop = true;
      huntingMusic.volume = 0.2;
      huntingMusic.play();
    } else if (command === 'stop') {
      huntingMusic.pause();
      huntingMusic.currentTime = 0;
    }
  } else if (file === '2nd') {
    if (command === 'play') {
      secondHouseSounds.loop = true;
      secondHouseSounds.volume = 0.7;
      secondHouseSounds.play();
    } else if (command === 'stop') {
      secondHouseSounds.pause();
      secondHouseSounds.currentTime = 0;
    }
  }
};

// THIS IS THE CODE TO CHANGE THE JPEG FILE FOR ROOMS WITH CLOSED THEN OPEN DOORS
export const triggerRoomUnlock = (roomWhereKeyIsFound) => {
  switch (roomWhereKeyIsFound) {
    case 'BEDROOMCLOSET':
      alert('You found the key that unlocks the door in the living room! Go check it out!');
      playKeyClickSound();
      setImageForRoom(maps.LIVINGROOM, maps.IMAGECHANGES.livingRoomUnlockedImage);
      maps.LIVINGROOM.up = {
        transferTo: 'LIVINGROOMCLOSET',
        arrowX: 823,
        arrowY: 669
      };
      break;
    case 'KITCHENCORNER':
      alert('You found the key that unlocks the door in the bedroom! Go check it out!');
      playKeyClickSound();
      setImageForRoom(maps.BEDROOMCORNER, maps.IMAGECHANGES.bedroomCornerUnlockedImage);
      maps.BEDROOMCORNER.up = {
        transferTo: 'BEDROOMCLOSET',
        arrowX: 1392,
        arrowY: 1196
      };
      break;
    case 'MYSTERY':
      maps.KITCHENCORNER.mystery = {
        transferTo: 'MYDOOR',
        arrowX: 1782,
        arrowY: 1226
      };
      break;
    case 'SECONDMYSTERY':
      maps.BEDROOMCORNER2.turnLeft = {
        transferTo: 'LIGHTSWITCHCORNER',
        arrowX: 732,
        arrowY: 984
      };
      break;
    case 'LIGHTSWITCHCORNER':
      controlAudio('stop', 'hunting');
      maps.LIGHTSWITCHCORNER.down = 'BEDROOMCORNERMESSY';
      alert('You hear something... Are you sure you\'re alone?');
      controlAudio('play', '2nd');
      break;
    case 'KITCHENCUPBOARD':
      // CHANGE THIS AFTER PLAYTESTING CHANGE THIS AFTER PLAYTESTING CHANGE THIS AFTER PLAYTESTING
      alert('If you found this, tell Ryan. He\'s trying to track how many people find this by accident.');
      break;
    default:
      alert('You have found the test trigger. This alert is all that happens because of it. You really shouldn\'t be seeing this.');
  }
};

export const mysteryTrigger = () => {
  controlAudio('stop', 'hunting');
};

export const secondHouseTrigger = (direction, startCountdown, setStartCountdown) => {
  if (direction === 'in') {
    controlAudio('play', 'hunting');
    setImageForRoom(maps.STAIRTOSECONDHOUSE, maps.IMAGECHANGES.stairToSecondHouseLockedImage);
    delete maps.STAIRTOSECONDHOUSE.secondHouse;
  } else if (direction === 'out') {
    controlAudio('stop', '2nd');
    levelThreeTriggers(startCountdown, setStartCountdown);
  }
};

export const levelThreeTriggers = (startCountdown, setStartCountdown) => {
  if (startCountdown === false) {
    setStartCountdown(true);
  }
};

export const startCountdownClock = (setIsCountdownRunning) => {
  setIsCountdownRunning(true);
  let barWidth = 0;
  const totalSecondsForCountdown = 1500;
  const barFrameRateInFPS = 10;
  const timeIncrement = 1000 / barFrameRateInFPS;
  const percentIncrement = (100 * timeIncrement)/(totalSecondsForCountdown*1000);

  setInterval(() => {
    if (barWidth >= 100) {
      clearInterval();
      document.getElementById("myP").innerHTML = `Connection Successfully Terminated. Goodbye!`;
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      const progressBar = document.getElementById("progressBar");
      barWidth += percentIncrement;
      progressBar.style.width = barWidth + '%';
      let barPercentLeft = 100 - barWidth;
      let secondsLeftInCountdown = ((timeIncrement * (barPercentLeft / percentIncrement)) / 1000).toFixed(0);
      document.getElementById("counter").innerHTML = secondsLeftInCountdown;
    }
  }, timeIncrement);
};

export const startDragging = ({ clientX, clientY }) => {
  this.handleRef.style.transform = `translate(${this.dragStartLeft + clientX - this.dragStartX}px, ${this.dragStartTop + clientY - this.dragStartY}px)`;
};

export const stopDragging = () => {
  window.removeEventListener('mousemove', this.startDragging, false);
  window.removeEventListener('mouseup', this.stopDragging, false);
};

export const playEggClickSound = () => {
  eggPopSound.volume = 1;
  eggPopSound.play();
};

export const playKeyClickSound = () => {
  keySound.volume = 0.6;
  keySound.play();
};

export const playCongratulationsSound = () => {
  congratsSound.volume = 0.6;
  congratsSound.play();
};

export const playCongratulations2Sound = () => {
  congratsSound2.volume = 0.6;
  congratsSound2.play();
};

// revert all the changes that could be made in triggerRoomUnlock
export const resetTriggers = (maxScore, setMaxScore) => {
  setImageForRoom(maps.LIVINGROOM, maps.IMAGECHANGES.livingRoomLockedImage);
  setImageForRoom(maps.BEDROOMCORNER, maps.IMAGECHANGES.bedroomCornerLockedImage);
  setImageForRoom(maps.STAIRTOSECONDHOUSE, maps.IMAGECHANGES.stairToSecondHouseUnlockedImage);

  if (maxScore === 250) {
    setMaxScore(50);
  }

  if (maps.LIVINGROOM.up) {
    delete maps.LIVINGROOM.up;
  }
  if (maps.BEDROOMCORNER.up) {
    delete maps.BEDROOMCORNER.up;
  }
  if (maps.KITCHENCORNER.mystery) {
    delete maps.KITCHENCORNER.mystery;
  }
  if (maps.BEDROOMCORNER2.turnLeft) {
    delete maps.BEDROOMCORNER.turnLeft;
  }
  if (maps.LIGHTSWITCHCORNER.down) {
    delete maps.LIGHTSWITCHCORNER.down;
  }
  if (!maps.STAIRTOSECONDHOUSE.secondHouse) {
    maps.STAIRTOSECONDHOUSE.secondHouse = {
      transferTo: 'LIVINGROOM2',
      arrowX: 1069,
      arrowY: 917
    };
  }
};

export const generateGiveUpMessage = (score, name, level, startTime) => {
  const totalTime = Date.now() - startTime;
  if (score === 50 && level === 1) {
    alert(`${name} is a super hunter who found all 50 eggs!\nWOW!! Thanks for playing, and hope to see you again, soon!`);
  } else if (level === 2) {
    alert(`${score + 50} EGGS\n1 HOUSE\nWhere did you go, ${name}?\nWhat did you see?`);
  } else if (score === 50 && level === 3) {
    alert(`${score + 50} EGGS\n2 HOUSES\nWhere did you go, ${name}?\nWhat did you see? ${totalTime}ms`);
  } else {
    alert(`${name} found ${score} out of 50 eggs!\nThanks for playing!`);
  }
};

export const renderLoadingScreen = () => {
  const screen = [];
  for (let i = 0; i < 13; i++) {
    screen.push(<div
      style={{
        position: 'absolute',
        top: `${Math.floor((Math.random() * 1000))}px`,
        left: `${Math.floor((Math.random() * 1000))}px`,
        transform: `rotate(${Math.floor((Math.random() * 360))}deg) 
          scale(${Math.floor((Math.random() * 10))}, ${Math.floor((Math.random() * 10))}`
      }}>
      LOADING
    </div>);
  }
  return screen;
};
