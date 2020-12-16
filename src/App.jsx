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
  mysteryTrigger,
  playEggClickSound,
  renderLoadingScreen,
  resetTriggers,
  secondHouseTrigger,
  triggerRoomUnlock
} from './util';

// *****************************************************

// Turn off HUNT_MODE to enable tools to get the x/y/radius of the eggs
let HUNT_MODE = true;

export function App() {
  const [status, setStatus] = useState('loading');

  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [maxScore, setMaxScore] = useState(50);
  const [foundEggs, setFoundEggs] = useState([]);
  const [foundKeys, setFoundKeys] = useState([]);

  const [image, setImage] = useState(useImage('SplashPage.jpg'));
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
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
  const [arrowTurnLeft] = useImage('LeftTurnArrow.png');
  const [arrowRight] = useImage('ArrowRight.png');
  const [arrowTurnRight] = useImage('RightTurnArrow.png');
  const [turnAroundArrow] = useImage('TurnAroundArrow.png');
  const [goBack] = useImage('GoBack.png');
  const [checkmark] = useImage('checkmark.gif');
  const [congratulationsLevel1] = useImage('Congratulations.png');
  const [congratulationsLevel2] = useImage('CongratulationsLevel2.jpg');

  let elementScale = scale * 1.5;

  const handleImageDrag = event => {
    setEggX((event.target.attrs.x- imageX) / scale );
    setEggY((event.target.attrs.y  / scale));
  };

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  // On first mount, check if we need to load up a map

  useEffect(() => {
    if(landingPage){
      setStatus('landing');
      setImage(landingPage)
    }
  }, [landingPage]);

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    if (image) {
      let scaleX = width / image.width;
      let scaleY = height / image.height;
      let scale = Math.min(scaleX, scaleY);
      let imageX = (width/2) - (image.width * scale * 0.5);
      setScale(scale);
      setImageX(imageX)
    }
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [height, width, image]);

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
    controlAudio('play', 'hunting');
    setCurrentLocation(maps.LIVINGROOM);
  } else if (name === 'CHEAT_quiz') {
    setName('You little cheater, boy');
    setStatus('quiz');
  } else if (name === 'CHEAT_nick') {
    setName('Nick Bruhnke');
    setStatus('hunting');
    setCurrentLocation(maps.LIVINGROOM2);
    setLevel(2);
    secondHouseTrigger('in');
  } else if (name === 'CHEAT_nohunt') {
    triggerRoomUnlock('MYSTERY');
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
          top: `${(870 * scale) - (30* scale)}px`,
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
            top: `${975 * scale - (30* scale)}px`,
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
            controlAudio('play', 'hunting');
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
            top: `${60 * elementScale}px`,
            left: `${5 * elementScale}px`,
            zIndex: 999,
            height: `${60 * elementScale}px`,
            width: `${200 * elementScale}px`,
            fontSize: `${30 * elementScale}px`,
            background: 'yellow'
          }}
          onClick={() => {
            controlAudio('stop', 'hunting');
            controlAudio('stop', '2nd');
            generateGiveUpMessage(score, name, level);
            setStatus('landing');
            setName('');
            setScore(0);
            setLevel(1);
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
            x={5 * elementScale}
            stroke={'#555'}
            strokeWidth={5 * elementScale}
            fill={'#ddd'}
            width={280 * elementScale}
            height={50 * elementScale}
            shadowColor={'black'}
            shadowBlur={10}
            shadowOffsetX={10}
            shadowOffsetY={10}
            shadowOpacity={0.2}
            cornerRadius={10 * elementScale}
          />
          <Text
            x={15 * elementScale}
            y={10 * elementScale}
            wrap
            text={`Eggs Found: ${score}/50`}
            fontSize={30 * elementScale}
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
                      playEggClickSound();
                      setScore(score+1);
                      setFoundEggs([`${currentLocation.name}egg${i}`, ...foundEggs])
                    }}
                    onTouchStart={() => {
                      playEggClickSound();
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
          { currentLocation.up &&
          <Image
            image={arrowUp}
            x={(imageX + (currentLocation.up.arrowX * scale)) - 30}
            y={currentLocation.up.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.up.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.up.transferTo)}
          />}
          { currentLocation.upTwo &&
          <Image
            image={arrowUp}
            x={(imageX + (currentLocation.upTwo.arrowX * scale)) - 30}
            y={currentLocation.upTwo.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.upTwo.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.upTwo.transferTo)}
          />}
          { currentLocation.down &&
          <Image
            image={arrowDown}
            x={(width * 0.5 - arrowDown.width * 0.05) - 30}
            y={height * 0.8 + arrowDown.height * 0.05}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.down)}
            onTouchStart={() => changeLocation(currentLocation.down)}
          />}
          { currentLocation.goBack &&
          <Image
            image={goBack}
            x={(width * 0.5 - arrowDown.width * 0.05) - 30}
            y={height * 0.8 + arrowDown.height * 0.05}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.goBack)}
            onTouchStart={() => changeLocation(currentLocation.goBack)}
          />}
          { currentLocation.left &&
          <Image
            image={arrowLeft}
            x={(imageX + (currentLocation.left.arrowX * scale)) - 30}
            y={currentLocation.left.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.left.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.left.transferTo)}
          />}
          { currentLocation.turnLeft &&
          <Image
            image={arrowTurnLeft}
            x={(imageX + (currentLocation.turnLeft.arrowX * scale)) - 30}
            y={currentLocation.turnLeft.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.turnLeft.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.turnLeft.transferTo)}
          />}
          { currentLocation.right &&
          <Image
            image={arrowRight}
            x={(imageX + (currentLocation.right.arrowX * scale)) - 30}
            y={currentLocation.right.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.right.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.right.transferTo)}
          />}
          { currentLocation.turnRight &&
          <Image
            image={arrowTurnRight}
            x={(imageX + (currentLocation.turnRight.arrowX * scale)) - 30}
            y={currentLocation.turnRight.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.turnRight.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.turnRight.transferTo)}
          />}
          { currentLocation.turnAroundRight &&
          <Image
            image={turnAroundArrow}
            x={(imageX + (currentLocation.turnAroundRight.arrowX * scale)) - 30}
            y={currentLocation.turnAroundRight.arrowY * scale}
            scaleX={-0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.turnAroundRight.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.turnAroundRight.transferTo)}
          />}
          { currentLocation.turnAroundLeft &&
          <Image
            image={turnAroundArrow}
            x={(imageX + (currentLocation.turnAroundLeft.arrowX * scale)) - 30}
            y={currentLocation.turnAroundLeft.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.turnAroundLeft.transferTo)}
            onTouchStart={() => changeLocation(currentLocation.turnAroundLeft.transferTo)}
          />}
          { currentLocation.mystery &&
          <Image
            image={arrowRight}
            x={(imageX + (currentLocation.mystery.arrowX * scale)) - 30}
            y={currentLocation.mystery.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {
              mysteryTrigger();
              changeLocation(currentLocation.mystery.transferTo);
            }}
            onTouchStart={() => {
              mysteryTrigger();
              changeLocation(currentLocation.mystery.transferTo);
            }}
          />}
          { currentLocation.secondHouse &&
          <Image
            image={arrowUp}
            x={(imageX + (currentLocation.secondHouse.arrowX * scale)) - 30}
            y={currentLocation.secondHouse.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {
              changeLocation(currentLocation.secondHouse.transferTo);
              secondHouseTrigger('in');
              setScore(0);
              setMaxScore(50);
            }}
            onTouchStart={() => {
              changeLocation(currentLocation.secondHouse.transferTo);
              secondHouseTrigger('in');
              setScore(0);
              setMaxScore(50);
            }}
          />}
          { currentLocation.exitSecondHouse &&
          <Image
            image={arrowRight}
            x={(imageX + (currentLocation.exitSecondHouse.arrowX * scale)) - 30}
            y={currentLocation.exitSecondHouse.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {
              changeLocation(currentLocation.exitSecondHouse.transferTo);
              secondHouseTrigger('out')
            }}
            onTouchStart={() => {
              changeLocation(currentLocation.exitSecondHouse.transferTo);
              secondHouseTrigger('out')
            }}
          />}
          {currentLocation.quiz &&
          <Image
            image={arrowUp}
            x={(imageX + (currentLocation.quiz.arrowX * scale)) - 30}
            y={currentLocation.quiz.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {setStatus('quiz')}}
            onTouchStart={() => {setStatus('quiz')}}
          />}
          {currentLocation.end &&
          <Image
            image={arrowUp}
            x={(imageX + (currentLocation.end.arrowX * scale)) - 30}
            y={currentLocation.end.arrowY * scale}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => {alert(`That's all we got for now! Tune in next time to see more about this project and where its going! Make sure you tell Ryan that you got here when you get the chance ;)`)}}
            onTouchStart={() => {alert(`That's all we got for now! Tune in next time to see more about this project and where its going! Make sure you tell Ryan that you got here when you get the chance ;)`)}}
          />}
          {score === maxScore && level === 1 ?
            <Image
              image={congratulationsLevel1}
              x={(width * 0.5) - (congratulationsLevel1.width * 0.375 * elementScale)}
              y={(height * 0.5) - (congratulationsLevel1.height * 0.375 * elementScale)}
              scaleX={elementScale * 0.75}
              scaleY={elementScale * 0.75}
              onClick={() => {
                triggerRoomUnlock('MYSTERY');
                setLevel(2);
                setMaxScore(250)
              }}
              onTouchStart={() => {
                triggerRoomUnlock('MYSTERY');
                setLevel(2);
                setMaxScore(250)
              }}
            /> : null
          }
          {score === maxScore && level === 2 ?
            <Image
              image={congratulationsLevel2}
              x={(width * 0.5) - (congratulationsLevel2.width * 0.375 * elementScale)}
              y={(height * 0.5) - (congratulationsLevel2.height * 0.375 * elementScale)}
              scaleX={elementScale * 0.75}
              scaleY={elementScale * 0.75}
              onClick={() => {
                triggerRoomUnlock('SECONDMYSTERY');
                setLevel(3);
                setMaxScore(250)
              }}
              onTouchStart={() => {
                triggerRoomUnlock('SECONDMYSTERY');
                setLevel(3);
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
