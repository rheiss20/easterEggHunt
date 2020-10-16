import maps from './maps';
import huntingMusicFile from './sounds/huntingMusic.mp3';
import secondHouseSoundsFile from './sounds/secondHouseSounds.mp3';
import eggPopSoundFile from './sounds/pop1.mp3';
import keySoundFile from './sounds/key.mp3';
import React from 'react';

const huntingMusic = new Audio(huntingMusicFile);
const secondHouseSounds = new Audio(secondHouseSoundsFile);
const eggPopSound = new Audio(eggPopSoundFile);
const keySound = new Audio(keySoundFile);

export const navySealCopypasta = "What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.";

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

export const controlAudio = (command, file) => {
  if (file === 'hunting'){
    if (command === 'play'){
      huntingMusic.loop = true;
      huntingMusic.volume = 0.2;
      huntingMusic.play();
    } else if (command === 'stop'){
      huntingMusic.pause();
      huntingMusic.currentTime = 0;
    }
  } else if (file === '2nd'){
    if (command === 'play'){
      secondHouseSounds.loop = true;
      secondHouseSounds.volume = 0.7;
      secondHouseSounds.play();
    } else if (command === 'stop'){
      secondHouseSounds.pause();
      secondHouseSounds.currentTime = 0;
    }
  }
};

// THIS IS THE CODE TO CHANGE THE JPEG FILE FOR ROOMS WITH CLOSED THEN OPEN DOORS
export const triggerRoomUnlock = (roomWhereKeyIsFound) => {
  switch(roomWhereKeyIsFound) {
    case 'BEDROOMCLOSET':
      alert('You found the key that unlocks the door in the living room! Go check it out!');
      playKeyClickSound();
      setImageForRoom(maps.LIVINGROOM, maps.IMAGECHANGES.livingRoomUnlockedImage);
      maps.LIVINGROOM.up = {
        "transferTo": "LIVINGROOMCLOSET",
        "arrowX":823,
        "arrowY":669
      };
      break;
    case 'KITCHENCORNER':
      alert('You found the key that unlocks the door in the bedroom! Go check it out!');
      playKeyClickSound();
      setImageForRoom(maps.BEDROOMCORNER, maps.IMAGECHANGES.bedroomCornerUnlockedImage);
      maps.BEDROOMCORNER.up = {
        "transferTo": "BEDROOMCLOSET",
        "arrowX":1392,
        "arrowY":1196
      };
      break;
    case 'MYSTERY':
      maps.KITCHENCORNER.mystery = {
        "transferTo": "MYDOOR",
        "arrowX":1782,
        "arrowY":1226
      };
      break;
    case 'SECONDMYSTERY':
      maps.BEDROOMCORNER2.turnLeft = {
        "transferTo":"LIGHTSWITCHCORNER",
        "arrowX":732,
        "arrowY":984
      };
      break;
    case 'LIGHTSWITCHCORNER':
      controlAudio('stop', 'hunting');
      maps.LIGHTSWITCHCORNER.down = "BEDROOMCORNERMESSY";
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

export const secondHouseTrigger = (direction) => {
  if (direction === 'in'){
    controlAudio('play', 'hunting');
    setImageForRoom(maps.STAIRTOSECONDHOUSE, maps.IMAGECHANGES.stairToSecondHouseLockedImage);
    delete maps.STAIRTOSECONDHOUSE.secondHouse;
  } else if (direction === 'out'){
    controlAudio('stop', '2nd');
  }
};

export const playEggClickSound = () => {
  eggPopSound.volume = 1;
  eggPopSound.play();
};

export const playKeyClickSound = () => {
  keySound.volume = 0.6;
  keySound.play();
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
      "transferTo": "LIVINGROOM2",
      "arrowX":1069,
      "arrowY":917
    };
  }
};

export const generateGiveUpMessage = (score, name, level) => {
  if (score === 50 && level === 1) {
    alert(`${name} is a super hunter who found all 50 eggs!\nWOW!! Thanks for playing, and hope to see you again, soon!`);
  } else if (level === 2) {
    alert(`${score} EGGS\n1 HOUSE\nWhere did you go, ${name}?\nWhat did you see?`);
  } else if (score === 50 && level === 3) {
    alert(`2 HOUSES\nWhere did you go, ${name}?\nWhat did you see?`);
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
