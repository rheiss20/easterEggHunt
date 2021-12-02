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
      maps.LIVINGROOMDARK.exitSecondHouse = {
        transferTo: 'STAIRTOSECONDHOUSEX',
        arrowX: 1782,
        arrowY: 1226
      };
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
    setTimeout(() => {
      setStartCountdown(true);
    }, 2000);
  }
};

export const generateCountdownClock = (setIsCountdownRunning) => {
  setIsCountdownRunning(true);
  const barWidth = 0;
  const totalSecondsForCountdown = 150;
  const barFrameRateInFPS = 10;
  const timeIncrement = 1000 / barFrameRateInFPS;
  const percentIncrement = (100 * timeIncrement) / (totalSecondsForCountdown * 1000);

  clockCountdown(barWidth, totalSecondsForCountdown, barFrameRateInFPS, timeIncrement, percentIncrement);
};

let isCounting = true;

export const clockCountdown = (barWidth, totalSecondsForCountdown, barFrameRateInFPS,
  timeIncrement, percentIncrement) => {
  const countdown = setInterval(() => {
    if (barWidth >= 100) {
      clearInterval(countdown);
      document.getElementById('popUpWindowLoadingBarSubtext').innerHTML = 'Connection Successfully Terminated. Goodbye!';
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else if (!isCounting) {
      clearInterval(countdown);
      document.getElementById('popUpWindowLoadingBarSubtext').innerHTML = 'ERROR: LOGOUT ATTEMPT HALTED';
      document.getElementById('giveUpButton').style.display = 'inline-block';
      setTimeout(() => {
        document.getElementById('popUpWindowHeader').innerHTML = 'WATCH OUT';
      }, 60000);
      setTimeout(() => {
        document.getElementById('popUpWindowParagraph').innerHTML = `You don't know who you can trust! Not even Mrs. Tobias. Please stand by as we attempt to terminate your connection…<br>
        Do not attempt to access files that were previously locked while this warning is active.<br>
        Do not move this box by clicking and dragging it.`;
      }, 120000);
      setTimeout(() => {
        document.getElementById('popUpWindowParagraph').innerHTML = `You don't know who you can trust! Not even Mrs. Tobias.<br>
        She didn't tell the police or her husband.<br>
        Do not attempt to access files that were previously locked while this warning is active.<br>
        Do not move this box by clicking and dragging it.`;
      }, 180000);
      setTimeout(() => {
        document.getElementById('popUpWindowParagraph').innerHTML = `You don't know who you can trust! Not even Mrs. Tobias.<br>
        She didn't tell the police or her husband.<br>
        And now he's gone... I don't know why you covered for me, Mrs. Tobias, but if you see this, try logging in as your name. There's something I've hidden for you. `;
        document.getElementById('popUpWindowLoadingBarSubtext').innerHTML = 'IT WAS AN ACCIDENT';
      }, 300000);
    } else {
      const progressBar = document.getElementById('popUpWindowProgressBar');
      barWidth += percentIncrement;
      progressBar.style.width = barWidth + '%';
      const barPercentLeft = 100 - barWidth;
      const secondsLeftInCountdown = ((timeIncrement * (barPercentLeft / percentIncrement)) / 1000).toFixed(0);
      document.getElementById('popUpWindowCounter').innerHTML = secondsLeftInCountdown;
    }
  }, timeIncrement);
};

export const stopCountdownClock = () => {
  console.log('stop the clock, chief');
  isCounting = false;
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
// Bring all this back in if you want a cool feature where it saves when you give up, but otherwise, just have it refresh the game.
export const resetTriggers = (
  // maxScore, setMaxScore, startCountdown, setStartCountdown, setIsCountdownRunning
) => {
  // setImageForRoom(maps.LIVINGROOM, maps.IMAGECHANGES.livingRoomLockedImage);
  // setImageForRoom(maps.BEDROOMCORNER, maps.IMAGECHANGES.bedroomCornerLockedImage);
  // setImageForRoom(maps.STAIRTOSECONDHOUSE, maps.IMAGECHANGES.stairToSecondHouseUnlockedImage);
  // if (startCountdown === true) {
  //   setStartCountdown(false);
  // }
  // setIsCountdownRunning(false);
  //
  // if (maxScore === 250) {
  //   setMaxScore(50);
  // }
  //
  // if (maps.LIVINGROOM.up) {
  //   delete maps.LIVINGROOM.up;
  // }
  // if (maps.BEDROOMCORNER.up) {
  //   delete maps.BEDROOMCORNER.up;
  // }
  // if (maps.KITCHENCORNER.mystery) {
  //   delete maps.KITCHENCORNER.mystery;
  // }
  // if (maps.BEDROOMCORNER2.turnLeft) {
  //   delete maps.BEDROOMCORNER.turnLeft;
  // }
  // if (maps.LIGHTSWITCHCORNER.down) {
  //   delete maps.LIGHTSWITCHCORNER.down;
  // }
  // if (!maps.STAIRTOSECONDHOUSE.secondHouse) {
  //   maps.STAIRTOSECONDHOUSE.secondHouse = {
  //     transferTo: 'LIVINGROOM2',
  //     arrowX: 1069,
  //     arrowY: 917
  //   };
  // }
  window.location.reload();
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
      key={i}
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

export const cheatChecker = (name, setName, setStatus, setCurrentLocation, setLevel, startCountdown, setStartCountdown, setRenderStopClockButton, setHUNT_MODE) => {
  switch (name) {
    case 'CHEAT_howie':
      triggerRoomUnlock('MYSTERY');
      setName('Howie, dear');
      setStatus('hunting');
      controlAudio('play', 'hunting');
      setCurrentLocation(maps.LIVINGROOM);
      break;
    case 'CHEAT_quiz':
      setName('You little cheater, boy');
      setStatus('quiz');
      break;
    case 'CHEAT_nick':
      setName('Nick Bruhnke');
      setStatus('hunting');
      setCurrentLocation(maps.LIVINGROOM2);
      setLevel(2);
      secondHouseTrigger('in');
      break;
    case 'CHEAT_clock':
      setName('Clockman');
      setStatus('hunting');
      setRenderStopClockButton(true);
      setCurrentLocation(maps.LIVINGROOM);
      levelThreeTriggers(startCountdown, setStartCountdown);
      break;
    case 'CHEAT_nohunt':
      triggerRoomUnlock('MYSTERY');
      setName('Doesn\'t matter');
      setStatus('hunting');
      setHUNT_MODE(false);
      setCurrentLocation(maps.LIVINGROOM);
      break;
    case 'CHEAT_exes':
      setName('Elle King');
      setStatus('hunting');
      setCurrentLocation(maps.STAIRTOSECONDHOUSEX);
      levelThreeTriggers(startCountdown, setStartCountdown);
      break;
  }
};
