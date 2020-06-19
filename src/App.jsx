import React, {useState, useEffect} from 'react';
import {
    Circle,
    Image,
    Layer,
    Rect,
    Stage,
    Star,
    Text,
} from 'react-konva';
import useImage from 'use-image';
import maps from './maps.json';

import { QuizSection } from './quiz/main';
import {
  controlAudio,
  generateGiveUpMessage,
  renderLoadingScreen,
  resetTriggers,
  triggerRoomUnlock
} from './util';

// *****************************************************

// Turn off HUNT_MODE to enable tools to get the x/y/radius of the eggs
let HUNT_MODE = true;

let height = window.innerHeight;
let width = window.innerWidth;

export function App() {
  const [status, setStatus] = useState('loading');

  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(50);
  const [foundEggs, setFoundEggs] = useState([]);
  const [foundKeys, setFoundKeys] = useState([]);

  const [image, setImage] = useState(useImage('SplashPage.jpg'));
  const [scale, setScale] = useState(Math.min((width / image.width), (height / image.height)));
  const [imageX, setImageX] = useState((width / 2) - (image.width * scale * 0.5));
  const [currentLocation, setCurrentLocation] = useState(maps.LIVINGROOM);

  const [eggX, setEggX] = useState(500);
  const [eggY, setEggY] = useState(500);
  const [eggRadius, setEggRadius] = useState(30);

  const [landingPage] = useImage('SplashPage.jpg');
  const [arrowUp] = useImage('ArrowUp.png');
  const [arrowDown] = useImage('ArrowDown.png');
  const [arrowLeft] = useImage('ArrowLeft.png');
  const [arrowRight] = useImage('ArrowRight.png');
  const [checkmark] = useImage('checkmark.gif');
  const [congratulations] = useImage('Congratulations.png');

  const handleImageDrag = event => {
    setEggX((event.target.attrs.x- imageX) / scale );
    setEggY((event.target.attrs.y  / scale));
  };

  // On first mount, check if we need to load up a map
  useEffect(() => {
    if (image) {
      let scaleX = width / image.width;
      let scaleY = height / image.height;
      let scale = Math.min(scaleX, scaleY);
      let imageX = (width/2) - (image.width * scale * 0.5);
      setScale(scale);
      setImageX(imageX)
    }
  }, [image]);

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

  // CHEATS ************************************************

  if (name === 'CHEAT_howie') {
    triggerRoomUnlock('MYSTERY');
    setName('Howie, dear');
    setStatus('hunting');
    controlAudio('play');
    setCurrentLocation(maps.LIVINGROOM);
  } else if (name === 'CHEAT_quiz') {
    setName('You little cheater, boy');
    setStatus('quiz');
  } else if (name === 'CHEAT_nohunt') {
    setName('Doesn\'t matter');
    setStatus('hunting');
    HUNT_MODE = false;
    setCurrentLocation(maps.LIVINGROOM);
  }

  // *******************************************************

  const changeLocation = (newLocationName) => {
    setCurrentLocation(maps[newLocationName])
  };

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
        width={width}
        height={height}
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
            generateGiveUpMessage(score, name);
            setStatus('landing');
            setName('');
            setScore(0);
            setFoundEggs([]);
            setFoundKeys([]);
            resetTriggers(maxScore, setMaxScore);
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
        width={width}
        height={height}
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

          {// If in HUNT_MODE, put invisible circles on unfound eggs and stars on found eggs
            HUNT_MODE ?
              currentLocation.eggs.map((egg, i) => (
                foundEggs.indexOf(`${currentLocation.name}egg${i}`) === -1 ?
                  <Circle
                    x={ imageX + (egg.eggX * scale)}
                    y={ (egg.eggY * scale)}
                    radius={ egg.eggRadius * scale}
                    onClick={() => {
                      setScore(score+1);
                      setFoundEggs([`${currentLocation.name}egg${i}`, ...foundEggs])
                    }}
                    onTouchStart={() => {
                      setScore(score+1);
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

                stroke={'red'}
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
                        triggerRoomUnlock(currentLocation.name);
                        setFoundKeys([`${currentLocation.name}key${i}`, ...foundKeys])
                      }}
                      onTouchStart={() => {
                        triggerRoomUnlock(currentLocation.name);
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
          {currentLocation.up &&
          <Image
            image={arrowUp}
            x={width * 0.5 - (arrowUp ? arrowUp.width : 0) * 0.5 * 0.1}
            y={height * 0.8 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.2}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.up)}
            onTouchStart={() => changeLocation(currentLocation.up)}
          />}
          {currentLocation.upTwo &&
          <Image
            image={arrowUp}
            x={width * 0.53}
            y={height * 0.8 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.2}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.upTwo)}
            onTouchStart={() => changeLocation(currentLocation.upTwo)}
          />}
          { currentLocation.down &&
          <Image
            image={arrowDown}
            x={width * 0.5 - (arrowDown ? arrowDown.width : 0) * 0.5 * 0.1}
            y={height * 0.8 + (arrowDown ? arrowDown.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.down)}
            onTouchStart={() => changeLocation(currentLocation.down)}
          />}
          { currentLocation.left &&
          <Image
            image={arrowLeft}
            x={width * 0.47 - (arrowLeft ? arrowLeft.width : 0) * 0.5 * 0.2}
            y={height * 0.78 + (arrowLeft ? arrowLeft.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.left)}
            onTouchStart={() => changeLocation(currentLocation.left)}
          />}
          { currentLocation.right &&
          <Image
            image={arrowRight}
            x={width * 0.53}
            y={height * 0.78 + (arrowRight ? arrowRight.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.right)}
            onTouchStart={() => changeLocation(currentLocation.right)}
          />}
          { currentLocation.mystery &&
          <Image
            image={arrowRight}
            x={width * 0.53}
            y={height * 0.78 + (arrowRight ? arrowRight.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {
              changeLocation(currentLocation.mystery);
              controlAudio('stop');
            }}
            onTouchStart={() => {
              changeLocation(currentLocation.mystery);
              controlAudio('stop');
            }}
          />}
          {currentLocation.quiz &&
          <Image
            image={arrowUp}
            x={width * 0.5 - (arrowUp ? arrowUp.width : 0) * 0.5 * 0.1}
            y={height * 0.8 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.2}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {setStatus('quiz')}}
            onTouchStart={() => {setStatus('quiz')}}
          />}
          {score === maxScore ?
            <Image
              image={congratulations}
              x={width * 0.5 - 250}
              y={height * 0.5 - 250}
              scaleX={0.5}
              scaleY={0.5}
              onClick={() => {
                triggerRoomUnlock('MYSTERY');
                setMaxScore(250)
              }}
              onTouchStart={() => {
                triggerRoomUnlock('MYSTERY');
                setMaxScore(250)
              }}
            /> : null
          }
        </Layer>
      </Stage>
      </>);
  } else if (status === 'quiz') {
    return (
    <div className={'quiz'}>
      {QuizSection(name, setStatus)}
    </div>
      )
  }else {
    return (<div>Something done broke</div>)
  }

}

export default App;
