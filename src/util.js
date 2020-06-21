import maps from './maps';
import soundfile from './sounds/huntingMusic.mp3';
import React from 'react';

const audioElement = new Audio(soundfile);

export const setImageForRoom = (roomToChange, imageToChangeTo) => {
  let image = new window.Image();
  image.src = imageToChangeTo;
  roomToChange.image = image;
};

// Preload all the maps, also how the images are generated
Object.keys(maps).forEach(key => {
  // Fake images for populating the inspect element with junk
  setImageForRoom(maps[key], maps[key].fakeImageName);
  setImageForRoom(maps[key], maps[key].imageName);
});

export const controlAudio = (command) => {
  if (command === 'play'){
    audioElement.loop = true;
    audioElement.volume = 0.2;
    audioElement.play();
  } else if (command === 'stop'){
    audioElement.pause();
    audioElement.currentTime = 0;
  }
};

// THIS IS THE CODE TO CHANGE THE JPEG FILE FOR ROOMS WITH CLOSED THEN OPEN DOORS
export const triggerRoomUnlock = (roomWhereKeyIsFound) => {
  switch(roomWhereKeyIsFound) {
    case 'BEDROOMCLOSET':
      alert('You found the key that unlocks the door in the living room! Go check it out!');
      setImageForRoom(maps.LIVINGROOM, maps.IMAGECHANGES.livingRoomUnlockedImage);
      maps.LIVINGROOM.up = 'LIVINGROOMCLOSET';
      break;
    case 'KITCHENCORNER':
      alert('You found the key that unlocks the door in the bedroom! Go check it out!');
      setImageForRoom(maps.BEDROOMCORNER, maps.IMAGECHANGES.bedroomCornerUnlockedImage);
      maps.BEDROOMCORNER.up = 'BEDROOMCLOSET';
      break;
    case 'MYSTERY':
      maps.KITCHENCORNER.mystery = 'MYDOOR';
      break;
    default:
      alert('You have found the test trigger. This alert is all that happens because of it. You really shouldn\'t be seeing this.');
  }
};

// revert all the changes that could be made in triggerRoomUnlock
export const resetTriggers = (maxScore, setMaxScore) => {
  setImageForRoom(maps.LIVINGROOM, maps.IMAGECHANGES.livingRoomLockedImage);
  setImageForRoom(maps.BEDROOMCORNER, maps.IMAGECHANGES.bedroomCornerLockedImage);

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
};

export const generateGiveUpMessage = (score, name) => {
  if (score === 50) {
    alert(`${name} is a super hunter who found all 50 eggs!\nWOW!! Thanks for playing, and hope to see you again, soon!`);
  } else {
    alert(`${name} found ${score} out of 50 eggs!\nThanks for playing!`);
  }
};

export function renderLoadingScreen() {
  let screen = [];
  for (let i = 0; i < 13; i++) {
    screen.push(<div
      style={{
        position: "absolute",
        top: `${Math.floor((Math.random() * 1000))}px`,
        left: `${Math.floor((Math.random() * 1000))}px`,
        transform: `rotate(${Math.floor((Math.random() * 360))}deg) 
          scale(${Math.floor((Math.random() * 10))}, ${Math.floor((Math.random() * 10))}`,
      }}>
      LOADING
    </div>);
  }
  return screen;
}
