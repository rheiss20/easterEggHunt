/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import {
  controlAudio,
  generateGiveUpMessage,
  mysteryTrigger,
  playCongratulations2Sound,
  playCongratulationsSound,
  playEggClickSound,
  resetTriggers,
  secondHouseTrigger,
  generateCountdownClock,
  triggerRoomUnlock,
  randomNumberGenerator,
  stopCountdownClock
} from './util';
import maps from './maps.json';
import { Circle, Image, Layer, Rect, Stage, Star, Text } from 'react-konva';
import Portal from './Portal';
import { PopUpWindow } from './PopUpWindow';
import useImage from 'use-image';
import PropTypes from 'prop-types';
import glitchMaps from './glitchMaps.json';

export function NavigationButtons (props) {
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState(props.status);
  const [name, setName] = useState(props.name);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [maxScore, setMaxScore] = useState(50);
  const [foundEggs, setFoundEggs] = useState([]);
  const [foundKeys, setFoundKeys] = useState([]);
  const [foundExes, setFoundExes] = useState([]);
  const [numberOfExesFound, setNumberOfExesFound] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(props.currentLocation);
  const [renderStopClockButton] = useState(false);
  const [image, setImage] = useState(currentLocation.image);
  const [width, setWidth] = useState(props.width);
  const [height, setHeight] = useState(props.height);
  const [scale, setScale] = useState(Math.min((width / image.width), (height / image.height)));
  const [imageX, setImageX] = useState((width / 2) - (image.width * scale * 0.5));
  const [eggX, setEggX] = useState(500);
  const [eggY, setEggY] = useState(500);
  const [eggRadius, setEggRadius] = useState(30);
  const [arrowUp] = useImage('ArrowUp.png');
  const [arrowDown] = useImage('ArrowDown.png');
  const [arrowLeft] = useImage('ArrowLeft.png');
  const [arrowTurnLeft] = useImage('LeftTurnArrow.png');
  const [arrowRight] = useImage('ArrowRight.png');
  const [arrowTurnRight] = useImage('RightTurnArrow.png');
  const [turnAroundArrow] = useImage('TurnAroundArrow.png');
  const [goBack] = useImage('GoBack.png');
  const [glitchedArrow] = useImage(`GlitchedArrow${randomNumberGenerator(1,5)}.png`);
  const [checkmark] = useImage('checkmark.gif');
  const [congratulationsLevel1] = useImage('Congratulations.png');
  const [congratulationsLevel2] = useImage('CongratulationsLevel2.jpg');
  const [insideGlitchMap, setInsideGlitchMap] = useState(false);
  const elementScale = scale * 1.5;

  const randomGlitchLocation = function () {
    if (score === 15) {
      setInsideGlitchMap(false);
      return maps.EXITTOTHIRDHOUSEBROKEN;
    } else {
      const keys = Object.keys(glitchMaps);
      return glitchMaps[keys[keys.length * Math.random() << 0]];
    }
  };

  const randomDirectionArrow = function () {
    const arrayOfArrows = [arrowUp, arrowDown, arrowLeft, arrowTurnLeft, arrowRight, arrowTurnRight, turnAroundArrow, goBack];
    return arrayOfArrows[randomNumberGenerator(0,7)];
  };

  const handleImageDrag = event => {
    setEggX((event.target.attrs.x - imageX) / scale);
    setEggY((event.target.attrs.y / scale));
  };

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const changeLocation = (newLocationName) => {
    if (maps[newLocationName]) {
      setCurrentLocation(maps[newLocationName]);
    } else {
      setCurrentLocation(glitchMaps[newLocationName]);
    }
  };

  useEffect(() => {
    if (numberOfExesFound >= 20) {
      stopCountdownClock();
      maps.EXITTOTHIRDHOUSEX.up = {
        transferTo: 'THIRDHOUSE6',
        arrowX:579,
        arrowY:908
      };
    }
  }, [numberOfExesFound]);

  const changeXLocationToBroken = (currentLocation) => {
    const currentLocationString = currentLocation.name;
    const convertedString = currentLocationString.slice(0, -1);
    return `${convertedString}BROKEN`;
  };

  useEffect(() => {
    if (status === 'hunting') {
      setImage(currentLocation.image);
    }
  }, [status, currentLocation]);

  useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    if (currentLocation.image) {
      const scaleX = width / currentLocation.image.width;
      const scaleY = height / currentLocation.image.height;
      const scale = Math.min(scaleX, scaleY);
      const imageX = (width / 2) - (currentLocation.image.width * scale * 0.5);
      setScale(scale);
      setImageX(imageX);
    }
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  }, [height, width, currentLocation.image]);

  return (<>
    { props.HUNT_MODE
      ? <>
        <input
          type='Button'
          value='Give Up'
          id='giveUpButton'
          style={{
            position: 'absolute',
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
            generateCountdownClock(setIsCountdownRunning);
            generateGiveUpMessage(score, name, level, props.startTime);
            props.setStatus('landing');
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
        { renderStopClockButton
          ? <input
            type='Button'
            value='Stop Clock'
            id='stopClockButton'
            style={{
              position: 'absolute',
              top: `${120 * elementScale}px`,
              left: `${5 * elementScale}px`,
              zIndex: 999,
              height: `${60 * elementScale}px`,
              width: `${200 * elementScale}px`,
              fontSize: `${30 * elementScale}px`,
              background: 'yellow'
            }}
            onClick={() => {
              stopCountdownClock();
            }
            }
          />
          : null}
      </>
      : <>
        <textarea
          style={{ position: 'absolute', top: '0px', left: '0px', zIndex: 999 }}
          rows='4' cols='13' readOnly
          value={`{'eggX': ${eggX.toFixed(0)},\n'eggY': ${eggY.toFixed(0)},\n'eggRadius': ${eggRadius}}`}
        />
        <input
          type='range'
          min='1'
          max='1000'
          value={ eggRadius }
          style={{ position: 'absolute', top: '70px', left: '0px', zIndex: 999 }}
          onChange={ (e) => setEggRadius(e.target.value) }
        />
      </>
    }
    <Stage
      width={ width }
      height={ height }
    >
      <Layer>
        <Rect
          width={ width }
          height={ height }
          fill='#999999'
        />
        <Image
          image={ image }
          x={ imageX }

          scaleX={ scale }
          scaleY={ scale }
        />
      </Layer>
      <Layer>
        {
          // this is why the x's always show up, can modify this later
          (numberOfExesFound > 0 && numberOfExesFound < 20)
            ? <>
              <Rect
                x={ 5 * elementScale }
                stroke={ '#555' }
                strokeWidth={ 5 * elementScale }
                fill={ '#ddd' }
                width={ 280 * elementScale }
                height={ 50 * elementScale }
                shadowColor={ 'black' }
                shadowBlur={ 10 }
                shadowOffsetX={ 10 }
                shadowOffsetY={ 10 }
                shadowOpacity={ 0.2 }
                cornerRadius={ 10 * elementScale }
              />
              <Text
                x={ 15 * elementScale }
                y={ 10 * elementScale }
                wrap
                text={ `${numberOfExesFound}/20 X's found` }
                fontSize={ 30 * elementScale }
              />
            </>
            : (insideGlitchMap) ?
            <>
              <Rect
                x={ 5 * elementScale }
                stroke={ '#555' }
                strokeWidth={ 5 * elementScale }
                fill={ '#ddd' }
                width={ 280 * elementScale }
                height={ 50 * elementScale }
                shadowColor={ 'black' }
                shadowBlur={ 10 }
                shadowOffsetX={ 10 }
                shadowOffsetY={ 10 }
                shadowOpacity={ 0.2 }
                cornerRadius={ 10 * elementScale }
              />
              <Text
                x={ 15 * elementScale }
                y={ 10 * elementScale }
                wrap
                text={ `EGGs Found: ${score}/15` }
                fontSize={ 30 * elementScale }
              />
            </> :
            <>
              <Rect
                x={ 5 * elementScale }
                stroke={ '#555' }
                strokeWidth={ 5 * elementScale }
                fill={ '#ddd' }
                width={ 280 * elementScale }
                height={ 50 * elementScale }
                shadowColor={ 'black' }
                shadowBlur={ 10 }
                shadowOffsetX={ 10 }
                shadowOffsetY={ 10 }
                shadowOpacity={ 0.2 }
                cornerRadius={ 10 * elementScale }
              />
              <Text
                x={ 15 * elementScale }
                y={ 10 * elementScale }
                wrap
                text={ `Eggs Found: ${score}/50` }
                fontSize={ 30 * elementScale }
              />
            </>
        }

        {// If in HUNT_MODE, put invisible circles on unfound eggs and stars on found eggs
          props.HUNT_MODE
            ? currentLocation.eggs.map((egg, i) => (
              foundEggs.indexOf(`${currentLocation.name}egg${i}`) === -1
                ? <Circle
                  x={ imageX + (egg.eggX * scale)}
                  y={ (egg.eggY * scale)}
                  radius={ egg.eggRadius * scale}
                  onClick={() => {
                    playEggClickSound();
                    setScore(score + 1);
                    setFoundEggs([`${currentLocation.name}egg${i}`, ...foundEggs]);
                  }}
                  onTouchStart={ () => {
                    playEggClickSound();
                    setScore(score + 1);
                    setFoundEggs([`${currentLocation.name}egg${i}`, ...foundEggs]);
                  }}
                  key={ `${currentLocation.name}egg${i}` }
                />
                : <Star
                  x={ imageX + (egg.eggX * scale)}
                  y={ (egg.eggY * scale)}
                  innerRadius={ egg.eggRadius * scale * 0.7}
                  outerRadius={ egg.eggRadius * scale * 1.5}
                  rotation={ 10 * egg.eggRadius }
                  numPoints={ 5 }
                  fill='#F7BEA0'
                  stroke='black'
                  strokeWidth={ 2 * scale }
                  key={ `${currentLocation.name}egg${i}` }
                />
            )
            )
            : <Circle
              x={ imageX + (eggX * scale)}
              y={ (eggY * scale)}
              radius={ eggRadius * scale}

              draggable
              onDragMove={ handleImageDrag }

              stroke={ 'red' }
              strokeWidth={ 2 }
            />
        }
        {
          currentLocation.keys
            ? currentLocation.keys.map((key, i) => (
              foundKeys.indexOf(`${currentLocation.name}key${i}`) === -1
                ? <Circle
                  x={ imageX + (key.keyX * scale) }
                  y={ (key.keyY * scale) }
                  radius={ key.keyRadius * scale }
                  onClick={ () => {
                    triggerRoomUnlock(currentLocation.name);
                    setFoundKeys([`${currentLocation.name}key${i}`, ...foundKeys]);
                  }}
                  onTouchStart={ () => {
                    triggerRoomUnlock(currentLocation.name);
                    setFoundKeys([`${currentLocation.name}key${i}`, ...foundKeys]);
                  }}
                  key={ `${currentLocation.name}key${i}`}
                />
                : <Image
                  image={ checkmark }
                  x={ imageX + (key.keyX * scale) - (scale * key.keyRadius) }
                  y={ (key.keyY * scale) - (scale * key.keyRadius) }
                  width={ scale * key.keyRadius * 2 }
                  height={ scale * key.keyRadius * 2 }
                  key={ `${currentLocation.name}key${i}` }
                />
            )
            ) : null
        }
        {
          currentLocation.exes
            ? currentLocation.exes.map((ex, i) => (
              foundExes.indexOf(`${currentLocation.name}ex${i}`) === -1
                ? <Circle
                  x={ imageX + (ex.exX * scale) }
                  y={ (ex.exY * scale) }
                  radius={ ex.exRadius * scale }
                  onClick={ () => {
                    setNumberOfExesFound(numberOfExesFound + 1);
                    setFoundExes([`${currentLocation.name}ex${i}`, `${changeXLocationToBroken(currentLocation)}ex${i}`, ...foundExes]);
                    setScore(0);
                  }}
                  onTouchStart={ () => {
                    setNumberOfExesFound(numberOfExesFound + 1);
                    setFoundExes([`${currentLocation.name}ex${i}`, `${changeXLocationToBroken(currentLocation)}ex${i}`, ...foundExes]);
                    setScore(0);
                  }}
                  key={ `${currentLocation.name}ex${i}`}
                />
                : <Circle
                  x={ imageX + (ex.exX * scale) }
                  y={ (ex.exY * scale) }
                  radius={ ex.exRadius * scale }
                  key={ `${currentLocation.name}ex${i}`}
                  stroke={ 'red' }
                  strokeWidth={ 2 }
                />
            )
            ) : null
        }
        { currentLocation.randomArrow &&
        <Image
          image={ glitchedArrow }
          x={ randomNumberGenerator(225, 1775)}
          y={ randomNumberGenerator(150, 1200) }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => {
            setScore(0);
            setLevel(4);
            changeLocation(randomGlitchLocation().name);
            setInsideGlitchMap(true);
          }}
          onTouchStart={ () => {
            setScore(0);
            setLevel(4);
            changeLocation(randomGlitchLocation().name);
            setInsideGlitchMap(true);
          }}/>
        }
        { currentLocation.randomArrows &&
        <div>
          <Image
            image={ randomDirectionArrow() }
            x={ randomNumberGenerator(275, 1340)}
            y={ randomNumberGenerator(0, 897) }
            scaleX={ 0.1 }
            scaleY={ 0.1 }
            onClick={ () => {
              changeLocation(randomGlitchLocation().name);
            }}
            onTouchStart={ () => {
              changeLocation(randomGlitchLocation().name);
            }}/>
          <Image
            image={ randomDirectionArrow() }
            x={ randomNumberGenerator(275, 1340)}
            y={ randomNumberGenerator(0, 897) }
            scaleX={ 0.1 }
            scaleY={ 0.1 }
            onClick={ () => {
              changeLocation(randomGlitchLocation().name);
            }}
            onTouchStart={ () => {
              changeLocation(randomGlitchLocation().name);
            }}/>
          <Image
            image={ randomDirectionArrow() }
            x={ randomNumberGenerator(275, 1340)}
            y={ randomNumberGenerator(0, 897) }
            scaleX={ 0.1 }
            scaleY={ 0.1 }
            onClick={ () => {
              changeLocation(randomGlitchLocation().name);
            }}
            onTouchStart={ () => {
              changeLocation(randomGlitchLocation().name);
            }}/>
        </div>
        }
        { currentLocation.up &&
        <Image
          image={ arrowUp }
          x={ (imageX + (currentLocation.up.arrowX * scale)) - 30 }
          y={ currentLocation.up.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.up.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.up.transferTo) }
        />}
        { currentLocation.down &&
        <Image
          image={ arrowDown }
          x={ (width * 0.5 - 641 * 0.05) - 30 }
          y={ height * 0.8 + 850 * 0.05 }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.down) }
          onTouchStart={ () => changeLocation(currentLocation.down) }
        />}
        { currentLocation.goBack &&
        <Image
          image={ goBack }
          x={ (width * 0.5 - 641 * 0.05) - 30 }
          y={ height * 0.8 + 850 * 0.05 }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.goBack) }
          onTouchStart={ () => changeLocation(currentLocation.goBack) }
        />}
        { currentLocation.left &&
        <Image
          image={ arrowLeft }
          x={ (imageX + (currentLocation.left.arrowX * scale)) - 30 }
          y={ currentLocation.left.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.left.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.left.transferTo) }
        />}
        { currentLocation.turnLeft &&
        <Image
          image={ arrowTurnLeft }
          x={ (imageX + (currentLocation.turnLeft.arrowX * scale)) - 30 }
          y={ currentLocation.turnLeft.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.turnLeft.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.turnLeft.transferTo) }
        />}
        { currentLocation.right &&
        <Image
          image={ arrowRight }
          x={ (imageX + (currentLocation.right.arrowX * scale)) - 30 }
          y={ currentLocation.right.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.right.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.right.transferTo) }
        /> }
        { currentLocation.turnRight &&
        <Image
          image={ arrowTurnRight }
          x={ (imageX + (currentLocation.turnRight.arrowX * scale)) - 30 }
          y={ currentLocation.turnRight.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.turnRight.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.turnRight.transferTo) }
        /> }
        { currentLocation.turnAroundRight &&
        <Image
          image={ turnAroundArrow }
          x={ (imageX + (currentLocation.turnAroundRight.arrowX * scale)) - 30 }
          y={ currentLocation.turnAroundRight.arrowY * scale }
          scaleX={ -0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.turnAroundRight.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.turnAroundRight.transferTo) }
        />}
        { currentLocation.turnAroundLeft &&
        <Image
          image={ turnAroundArrow }
          x={ (imageX + (currentLocation.turnAroundLeft.arrowX * scale)) - 30 }
          y={ currentLocation.turnAroundLeft.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => changeLocation(currentLocation.turnAroundLeft.transferTo) }
          onTouchStart={ () => changeLocation(currentLocation.turnAroundLeft.transferTo) }
        />}
        { currentLocation.mystery &&
        <Image
          image={ arrowRight }
          x={ (imageX + (currentLocation.mystery.arrowX * scale)) - 30 }
          y={ currentLocation.mystery.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => {
            mysteryTrigger();
            changeLocation(currentLocation.mystery.transferTo);
          }}
          onTouchStart={ () => {
            mysteryTrigger();
            changeLocation(currentLocation.mystery.transferTo);
          }}
        />}
        { currentLocation.secondHouse &&
        <Image
          image={ arrowUp }
          x={ (imageX + (currentLocation.secondHouse.arrowX * scale)) - 30 }
          y={ currentLocation.secondHouse.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => {
            setLevel(2);
            changeLocation(currentLocation.secondHouse.transferTo);
            secondHouseTrigger('in');
            setScore(0);
            setMaxScore(50);
          }}
          onTouchStart={ () => {
            setLevel(2);
            changeLocation(currentLocation.secondHouse.transferTo);
            secondHouseTrigger('in');
            setScore(0);
            setMaxScore(50);
          }}
        />}
        { currentLocation.exitSecondHouse &&
        <Image
          image={ arrowRight }
          x={ (imageX + (currentLocation.exitSecondHouse.arrowX * scale)) - 30 }
          y={ currentLocation.exitSecondHouse.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => {
            changeLocation(currentLocation.exitSecondHouse.transferTo);
            secondHouseTrigger('out', props.startCountdown, props.setStartCountdown);
          }}
          onTouchStart={ () => {
            changeLocation(currentLocation.exitSecondHouse.transferTo);
            secondHouseTrigger('out', props.startCountdown, props.setStartCountdown);
          }}
        /> }
        { currentLocation.quiz &&
        <Image
          image={ arrowUp }
          x={ (imageX + (currentLocation.quiz.arrowX * scale)) - 30 }
          y={ currentLocation.quiz.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => { props.setStatus('quiz'); }}
          onTouchStart={ () => { props.setStatus('quiz'); }}
        /> }
        { currentLocation.end &&
        <Image
          image={ arrowUp }
          x={ (imageX + (currentLocation.end.arrowX * scale)) - 30 }
          y={ currentLocation.end.arrowY * scale }
          scaleX={ 0.1 }
          scaleY={ 0.1 }
          onClick={ () => { alert('That\'s all we got for now! Tune in next time to see more about this project and where its going! Make sure you tell Ryan that you got here when you get the chance'); }}
          onTouchStart={ () => { alert('That\'s all we got for now! Tune in next time to see more about this project and where its going! Make sure you tell Ryan that you got here when you get the chance'); }}
        /> }
        { score === maxScore && level === 1
          ? <Image
            image={ congratulationsLevel1 }
            x={ (width * 0.5) - (congratulationsLevel1.width * 0.375 * elementScale) }
            y={ (height * 0.5) - (congratulationsLevel1.height * 0.375 * elementScale) }
            scaleX={ elementScale * 0.75 }
            scaleY={ elementScale * 0.75 }
            onClick={ () => {
              triggerRoomUnlock('MYSTERY');
              setMaxScore(250);
            }}
            onTouchStart={ playCongratulationsSound() }
          /> : null
        }
        { score === maxScore && level === 2
          ? <Image
            image={ congratulationsLevel2 }
            x={ (width * 0.5) - (congratulationsLevel2.width * 0.375 * elementScale) }
            y={ (height * 0.5) - (congratulationsLevel2.height * 0.375 * elementScale) }
            scaleX={ elementScale * 0.75 }
            scaleY={ elementScale * 0.75 }
            onClick={ () => {
              triggerRoomUnlock('SECONDMYSTERY');
              setLevel(3);
              setMaxScore(250);
            }}
            onTouchStart={ playCongratulations2Sound() }
          /> : null
        }
        { props.startCountdown === true
          ? <Portal isOpened={ true }>
            {isCountdownRunning ? null : generateCountdownClock(setIsCountdownRunning)}
            <PopUpWindow id='popUpWindow' windowHeight={ height } windowWidth={ width } elementScale={ elementScale }/>
          </Portal> : null
        }
      </Layer>
    </Stage>
  </>);
}

NavigationButtons.propTypes = {
  name: PropTypes.string,
  HUNT_MODE: PropTypes.boolean,
  currentLocation: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  status: PropTypes.string,
  setStatus: PropTypes.func,
  startCountdown: PropTypes.boolean,
  setStartCountdown: PropTypes.func,
  startTime: PropTypes.number,
};
