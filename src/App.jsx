import React, {useState, useEffect} from 'react';
import {
    Circle,
    Image,
    Layer,
    Rect,
    Stage,
    Star,
    Text
} from 'react-konva';
import useImage from 'use-image';
import maps from './maps.json';

import soundfile from './sounds/huntingMusic.mp3';
import { QuizSection } from './quiz/main';

// *****************************************************

// Turn off HUNT_MODE to enable tools to get the x/y/radius of the eggs
const HUNT_MODE = true;

// *****************************************************

const setImageForRoom = (roomToChange, imageToChangeTo) => {
  let image = new window.Image();
  image.src = imageToChangeTo;
  roomToChange.image = image;
};

// Preload all the maps, also how the images are generated
Object.keys(maps).forEach(key => {
  // Fake images for populating the inspect element with junk
  setImageForRoom(maps[key], maps[key].fakeImageName)
  setImageForRoom(maps[key], maps[key].imageName)
});

// *****************************************************

const height = window.innerHeight;
const width = window.innerWidth;

// AUDIO SETTINGS **************************

const audioElement = new Audio(soundfile);

const controlAudio = (command) => {
  // if (command === 'play'){
  //   audioElement.loop = true;
  //   audioElement.volume = 0.2;
  //   audioElement.play();
  // } else if (command === 'stop'){
  //   audioElement.pause();
  //   audioElement.currentTime = 0;
  // }
};

// ******************************************

export function App() {
  const [status, setStatus] = useState('loading');

  const [name, setName] = useState('');
  const [score, setScore] = useState(49);
  const [maxScore, setMaxScore] = useState(50);
  const [foundEggs, setFoundEggs] = useState([]);
  const [foundKeys, setFoundKeys] = useState([]);

  const [scale, setScale] = useState(0.2);
  const [image, setImage] = useState();
  const [imageX, setImageX] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(maps.LIVINGROOM);

  const [eggX, setEggX] = useState(576);
  const [eggY, setEggY] = useState(446);
  const [eggRadius, setEggRadius] = useState(30);

  const [landingPage] = useImage('SplashPage.jpg');
  const [arrowUp] = useImage('ArrowUp.png');
  const [arrowDown] = useImage('ArrowDown.png');
  const [arrowLeft] = useImage('ArrowLeft.png');
  const [arrowRight] = useImage('ArrowRight.png');
  const [checkmark] = useImage('checkmark.gif');
  const [congratulations] = useImage('Congratulations.png');

  //************************************************************
  // THIS IS THE CODE TO CHANGE THE JPEG FILE FOR ROOMS WITH CLOSED THEN OPEN DOORS
  const triggerRoomUnlock = (roomWhereKeyIsFound) => {
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
  const resetTriggers = () => {
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

  // ******************************************************************

  let handleImageDrag = event => {
    setEggX((event.target.attrs.x- imageX) / scale );
    setEggY((event.target.attrs.y  / scale));
  };

  useEffect(() => {
    if(landingPage){
      setStatus('landing');
      setImage(landingPage)
    }
  }, [landingPage]);


  useEffect(() => {
    if(status === 'hunting'){
      alert(`Have yourself an Easter egg hunt without leaving the safety and comfort of your own home! There are 50 eggs hidden inside this house. Click on the arrows to navigate, and click on an egg when you find it to add it to your score! Have fun, and try to collect them all!\n(Click "Give Up" when you are done playing.)`)
    }
  }, [status]);

  useEffect(() => {
    switch(status) {
      case 'landing':
        setImage(landingPage);
        break;
      case 'hunting': setImage(currentLocation.image);
      break;
      default:
    }
  }, [status, currentLocation, landingPage]);

  // On first mount, check if we need to load up a map
  useEffect(() => {
    if (image) {
      let scaleX = width / image.width;
      let scaleY = height / image.height;
      let scale = Math.min(scaleX, scaleY);
      let imageX = (window.innerWidth/2) - (image.width * scale * 0.5);
      setScale(scale);
      setImageX(imageX)
    }
  }, [image]);

  let changeLocation = (newLocationName) => {
    setCurrentLocation(maps[newLocationName])
  };

  const generateGiveUpMessage = () => {
    if (score === 50) {
      alert(`${name} is a super hunter who found all 50 eggs!\nWOW!! Thanks for playing, and hope to see you again, soon!`);
    } else {
      alert(`${name} found ${score} out of 50 eggs!\nThanks for playing!`);
    }
  };

  function renderLoadingScreen() {
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

  if (status === 'loading') {
    return (<div>
      {renderLoadingScreen()}
    </div>)
  } else if (status === 'landing'  || status === 'checking name') {
    return (
      <>
      <input
        type="text"
        placeholder="What is your name?"
        value={name}
        autoFocus
        style={{
          position: "absolute",
          top: `${870 * scale - 30}px`,
          left: `${imageX + (image.width / 2 * scale) - (200* scale)}px`,
          zIndex: 999,
          height: `${70 * scale}px`,
          width: `${400 * scale}px`,
          fontSize: `${40 * scale}px`
        }}
        onChange={(e) => setName(e.target.value)}
      />
      <input
          type="Button"
          value="Start!"
          style={{
            position: "absolute",
            top: `${975 * scale - 30}px`,
            left: `${imageX + (image.width / 2 * scale) - (150* scale)}px`,
            zIndex: 999,
            height: `${120 * scale}px`,
            width: `${300 * scale}px`,
            fontSize: `${90 * scale}px`,
            background: `${name === '' ? '' : '#F9FC9D'}`
          }}
          disabled={name === ''}
          onClick={() => {
            setStatus('hunting');
            controlAudio('play');
            }
          }
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer>
          <Image
            image={image}
            x={imageX}

            scaleX={scale}
            scaleY={scale}
          />
        </Layer>
      </Stage>
      </>
    )
  } else if (status === 'hunting') {
    return (<>
      {
        HUNT_MODE ?
        <>
        <input
          type="Button"
          value="Give Up"
          style={{
            position: "absolute",
            top: `60px`,
            left: `10px`,
            zIndex: 999,
            height: `${60}px`,
            width: `${200}px`,
            fontSize: `${30}px`,
            background: 'yellow'
          }}
          onClick={() => {
            controlAudio('stop');
            generateGiveUpMessage();
            setStatus('landing');
            setName('');
            setScore(0);
            setFoundEggs([]);
            setFoundKeys([]);
            resetTriggers();
            setCurrentLocation(maps.LIVINGROOM);
          }
        }
        />
        </> :
        <>
          <textarea
              style={{position: "absolute", top: '0px', left: '0px', zIndex: 999}}
            rows="4" cols="13" readOnly
            value={`{"eggX": ${eggX.toFixed(0)},\n"eggY": ${eggY.toFixed(0)},\n"eggRadius": ${eggRadius}}`}
          />
          <input
              type="range"
              min="1"
              max="1000"
              value={eggRadius}
              style={{position: "absolute", top: '70px', left: '0px', zIndex: 999}}
              onChange={(e) => setEggRadius(e.target.value)}
          />
        </>
      }
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Layer>
          <Rect
            width={width}
            height={height}
            fill='#999999'
          />
          <Image
            image={image}
            x={imageX}

            scaleX={scale}
            scaleY={scale}
          />
        </Layer>
        <Layer>
          <Rect
            x={5}
            stroke={'#555'}
            strokeWidth={5}
            fill={'#ddd'}
            width={280}
            height={50}
            shadowColor={'black'}
            shadowBlur={10}
            shadowOffsetX={10}
            shadowOffsetY={10}
            shadowOpacity={0.2}
            cornerRadius={10}
          />
          <Text
            x={15}
            y={10}
            wrap
            text={`Eggs Found: ${score}/50`}
            fontSize={30}
          />

          {currentLocation.up &&
          <Image
            image={arrowUp}
            x={window.innerWidth * 0.5 - (arrowUp ? arrowUp.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.8 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.2}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.up)}
          />}
          { currentLocation.down &&
          <Image
            image={arrowDown}
            x={window.innerWidth * 0.5 - (arrowDown ? arrowDown.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.8 + (arrowDown ? arrowDown.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.down)}
          />}
          { currentLocation.left &&
          <Image
            image={arrowLeft}
            x={window.innerWidth * 0.47 - (arrowLeft ? arrowLeft.width : 0) * 0.5 * 0.2}
            y={window.innerHeight * 0.78 + (arrowLeft ? arrowLeft.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.left)}
          />}
          { currentLocation.right &&
          <Image
            image={arrowRight}
            x={window.innerWidth * 0.53}
            y={window.innerHeight * 0.78 + (arrowRight ? arrowRight.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.right)}
          />}
          { currentLocation.mystery &&
          <Image
            image={arrowRight}
            x={window.innerWidth * 0.53}
            y={window.innerHeight * 0.78 + (arrowRight ? arrowRight.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {
              changeLocation(currentLocation.mystery);
              controlAudio('stop');
              }
            }
          />}
          {currentLocation.quiz &&
          <Image
            image={arrowUp}
            x={window.innerWidth * 0.5 - (arrowUp ? arrowUp.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.8 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.2}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {setStatus('quiz')}}
          />}

          {// If in HUNT_MODE, put invisible circles on unfound eggs and stars on found eggs
            HUNT_MODE ?
              currentLocation.eggs.map((egg, i) => (
                foundEggs.indexOf(`${currentLocation.name}egg${i}`) === -1 ?
                  <Circle
                    x={ imageX + (egg.eggX * scale)}
                    y={ (egg.eggY * scale)}
                    radius={ egg.eggRadius * scale}
                    onClick={() => {
                      setScore(score+1)
                      setFoundEggs([`${currentLocation.name}egg${i}`, ...foundEggs])
                    }}
                    key={`${currentLocation.name}egg${i}`}
                  />
                :
                  <Star
                      x={ imageX + (egg.eggX * scale)}
                      y={ (egg.eggY * scale)}
                      innerRadius={ egg.eggRadius * scale * 0.7}
                      outerRadius={ egg.eggRadius * scale * 1.5}
                      rotation={10 * egg.eggRadius}
                      numPoints={5}
                      fill='#F7BEA0'
                      stroke='black'
                      strokeWidth={2 * scale}
                      key={`${currentLocation.name}egg${i}`}
                  />
                )
              )
            :
              <Circle
                x={ imageX + (eggX * scale)}
                y={ (eggY * scale)}
                radius={ eggRadius * scale}

                draggable
                onDragMove={handleImageDrag}

                stroke={ 'red'}
                strokeWidth={ 2}
              />
          }
          {
            currentLocation.keys ?
            currentLocation.keys.map((key, i) => (
                foundKeys.indexOf(`${currentLocation.name}key${i}`) === -1 ?
                    <Circle
                      x={imageX + (key.keyX * scale)}
                      y={(key.keyY * scale)}
                      radius={key.keyRadius * scale}
                      onClick={() => {
                        triggerRoomUnlock(currentLocation.name)
                        setFoundKeys([`${currentLocation.name}key${i}`, ...foundKeys])
                      }}
                      key={`${currentLocation.name}key${i}`}
                    />
                    :
                    <Image
                      image={checkmark}
                      x={imageX + (key.keyX * scale) - (scale * key.keyRadius)}
                      y={(key.keyY * scale) - (scale * key.keyRadius)}
                      width={ scale * key.keyRadius * 2}
                      height={ scale * key.keyRadius * 2}
                      key={`${currentLocation.name}key${i}`}
                    />
                    )
            ) : null
          }
          {score === maxScore ?
            <Image
              image={congratulations}
              x={window.innerWidth * 0.5 - 250}
              y={window.innerHeight * 0.5 - 250}
              scaleX={0.5}
              scaleY={0.5}
              onClick={() => {
                triggerRoomUnlock('MYSTERY')
                setMaxScore(250)
              }}
            /> : null
          }
        </Layer>
      </Stage>
      </>);
  } else if (status === 'quiz') {
    return (
      <>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            height: '100%',
            width: '100%',
            fontFamily: `'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif`,
            background: `rgb(249,219,61)`,
            color: `#222`,
            margin: `0`,
            padding: `0`,
            overflowY: `scroll`,
            fontSize: `16px`,
          }}
        >
          <Layer>
            <QuizSection/>
          </Layer>
        </Stage>
      </>
      )
  }else {
    return (<div>Something done broke</div>)
  }

}

export default App;
