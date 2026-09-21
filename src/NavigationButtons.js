import React, { useState, useEffect, useRef } from 'react';
import {
  clearFourthHouseRoom,
  controlAudio,
  generateGiveUpMessage,
  mysteryTrigger,
  playCongratulations2Sound,
  playCongratulationsSound,
  playKeyClickSound,
  playEggClickSound,
  resetTriggers,
  secondHouseTrigger,
  generateCountdownClock,
  triggerRoomUnlock,
  randomNumberGenerator,
  resetFourthHouse,
  stopCountdownClock,
} from './util';
import maps from './maps.json';
import { Circle, Group, Image, Layer, Rect, Stage, Star, Text } from 'react-konva';
import Portal from './Portal';
import { PopUpWindow } from './PopUpWindow';
import useImage from 'use-image';
import PropTypes from 'prop-types';
import glitchMaps from './glitchMaps.json';
import { ComputerDesktop } from './fourth-house/ComputerDesktop';

export function NavigationButtons(props) {
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState(props.status);
  const [name, setName] = useState(props.name);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(props.currentLocation.fourthHouse ? 4 : 1);
  const [maxScore, setMaxScore] = useState(
    props.currentLocation.fourthHouse ? 10 : 50,
  );
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
  const [scale, setScale] = useState(
    Math.min(width / image.width, height / image.height),
  );
  const [imageX, setImageX] = useState(width / 2 - image.width * scale * 0.5);
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
  const [glitchedArrow] = useImage(
    `GlitchedArrow${randomNumberGenerator(1, 5)}.png`,
  );
  const [checkmark] = useImage('checkmark.gif');
  const [congratulationsLevel1] = useImage('Congratulations.png');
  const [congratulationsLevel2] = useImage('CongratulationsLevel2.jpg');
  const [congratulationsLevel3] = useImage('CongratulationsLevel3.jpg');
  const [insideGlitchMap, setInsideGlitchMap] = useState(false);
  const [showLevel3Congratulations, setShowLevel3Congratulations] = useState(false);
  const [clearedFourthHouseRooms, setClearedFourthHouseRooms] = useState([]);
  const [isFourthStairUnlocked, setIsFourthStairUnlocked] = useState(false);
  const [isComputerOpen, setIsComputerOpen] = useState(false);
  const [desktopClickCount, setDesktopClickCount] = useState(0);
  const playedLevel1CongratulationsRef = useRef(false);
  const playedLevel2CongratulationsRef = useRef(false);
  const dismissingLevel3CongratulationsRef = useRef(false);
  const elementScale = scale * 1.5;
  const directionScale = Math.max(0.05, Math.min(0.12, height / 8000));
  const renderedImageWidth = image ? image.width * scale : width;
  const renderedImageHeight = image ? image.height * scale : height;

  const getArrowPosition = (arrow, arrowX, arrowY, mirrored = false) => {
    const arrowWidth = arrow ? arrow.width * directionScale : 0;
    const arrowHeight = arrow ? arrow.height * directionScale : 0;
    const centeredX = imageX + arrowX * scale - arrowWidth * 0.5;
    const clampedX = Math.min(
      Math.max(centeredX, imageX),
      imageX + renderedImageWidth - arrowWidth,
    );
    const clampedY = Math.min(
      Math.max(arrowY * scale, 0),
      renderedImageHeight - arrowHeight,
    );

    return {
      x: mirrored ? clampedX + arrowWidth : clampedX,
      y: clampedY,
    };
  };

  const randomGlitchLocation = function() {
    if (score === 15) {
      setInsideGlitchMap(false);
      return maps.EXITTOTHIRDHOUSEBROKEN;
    } else {
      const keys = Object.keys(glitchMaps);
      return glitchMaps[keys[(keys.length * Math.random()) << 0]];
    }
  };

  const randomDirectionArrow = function() {
    const arrayOfArrows = [
      arrowUp,
      arrowDown,
      arrowLeft,
      arrowTurnLeft,
      arrowRight,
      arrowTurnRight,
      turnAroundArrow,
      goBack,
    ];
    return arrayOfArrows[randomNumberGenerator(0, 7)];
  };

  const handleImageDrag = (event) => {
    setEggX((event.target.attrs.x - imageX) / scale);
    setEggY(event.target.attrs.y / scale);
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

  const openComputer = (includeOpeningClick = true) => {
    setDesktopClickCount(props.onDesktopOpen(includeOpeningClick));
    setIsComputerOpen(true);
  };

  const collectEgg = (eggIndex) => {
    const eggId = `${currentLocation.name}egg${eggIndex}`;
    if (foundEggs.includes(eggId)) return;

    playEggClickSound();
    const nextFoundEggs = [eggId, ...foundEggs];
    setFoundEggs(nextFoundEggs);
    setScore((currentScore) => currentScore + 1);

    if (!currentLocation.fourthHouse || currentLocation.eggs.length === 0) {
      return;
    }

    const roomEggPrefix = `${currentLocation.name}egg`;
    const roomEggsFound = nextFoundEggs.filter((foundEgg) =>
      foundEgg.startsWith(roomEggPrefix),
    ).length;
    if (roomEggsFound === currentLocation.eggs.length) {
      const emptyImage = clearFourthHouseRoom(currentLocation.name);
      setClearedFourthHouseRooms((clearedRooms) =>
        clearedRooms.includes(currentLocation.name)
          ? clearedRooms
          : [...clearedRooms, currentLocation.name],
      );
      if (emptyImage) {
        emptyImage.onload = () => setImage(emptyImage);
      }
    }
  };

  useEffect(() => {
    if (numberOfExesFound >= 20) {
      stopCountdownClock();
      maps.EXITTOTHIRDHOUSEX.up = {
        transferTo: 'THIRDHOUSE6',
        arrowX: 579,
        arrowY: 908,
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
      const nextImage = currentLocation.image;
      if (nextImage && nextImage.width && nextImage.height) {
        setImage(nextImage);
      } else if (nextImage) {
        nextImage.onload = () => setImage(nextImage);
      }
    }
  }, [status, currentLocation]);

  useEffect(() => {
    if (props.startCountdown && !isCountdownRunning) {
      generateCountdownClock(setIsCountdownRunning);
    }
  }, [props.startCountdown, isCountdownRunning]);

  useEffect(() => {
    if (props.startComputerOpen) {
      openComputer(false);
    }
  }, [props.startComputerOpen]);

  useEffect(() => {
    if (
      level === 4 &&
      currentLocation.digiRoom &&
      score >= 10 &&
      !isFourthStairUnlocked
    ) {
      playKeyClickSound();
      alert('');
      const giveUpButton = document.getElementById('giveUpButton');
      if (giveUpButton) giveUpButton.style.display = 'none';
      maps.DIGISTAIR.up = {
        transferTo: 'EMPTYSTAIRDOWN',
        arrowX: 1000,
        arrowY: 750,
      };
      setIsFourthStairUnlocked(true);
    }
  }, [level, score, currentLocation.digiRoom, isFourthStairUnlocked]);

  useEffect(() => {
    if (insideGlitchMap && score >= 15 && !showLevel3Congratulations) {
      dismissingLevel3CongratulationsRef.current = false;
      setShowLevel3Congratulations(true);
      playCongratulations2Sound();
    }
  }, [insideGlitchMap, score, showLevel3Congratulations]);

  useEffect(() => {
    if (
      score === maxScore &&
      level === 1 &&
      !playedLevel1CongratulationsRef.current
    ) {
      playedLevel1CongratulationsRef.current = true;
      playCongratulationsSound();
    }
    if (
      score === maxScore &&
      level === 2 &&
      !playedLevel2CongratulationsRef.current
    ) {
      playedLevel2CongratulationsRef.current = true;
      playCongratulations2Sound();
    }
  }, [score, maxScore, level]);

  const dismissLevel3Congratulations = () => {
    if (dismissingLevel3CongratulationsRef.current) return;
    dismissingLevel3CongratulationsRef.current = true;
    setShowLevel3Congratulations(false);
    setInsideGlitchMap(false);
    setScore(0);
    setLevel(3);
    changeLocation('EXITTOTHIRDHOUSEBROKEN');
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    if (image && image.width && image.height) {
      const scaleX = width / image.width;
      const scaleY = height / image.height;
      const scale = Math.min(scaleX, scaleY);
      const imageX = width / 2 - image.width * scale * 0.5;
      setScale(scale);
      setImageX(imageX);
    }
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  }, [height, width, image]);

  return (
    <>
      {props.HUNT_MODE ? (
        <>
          <input
            type='button'
            defaultValue='Give Up'
            id='giveUpButton'
            style={{
              position: 'absolute',
              top: `${60 * elementScale}px`,
              left: `${5 * elementScale}px`,
              zIndex: 999,
              height: `${60 * elementScale}px`,
              width: `${200 * elementScale}px`,
              fontSize: `${30 * elementScale}px`,
              background: 'yellow',
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
            }}
          />
          {renderStopClockButton ? (
            <input
              type='button'
              defaultValue='Stop Clock'
              id='stopClockButton'
              style={{
                position: 'absolute',
                top: `${120 * elementScale}px`,
                left: `${5 * elementScale}px`,
                zIndex: 999,
                height: `${60 * elementScale}px`,
                width: `${200 * elementScale}px`,
                fontSize: `${30 * elementScale}px`,
                background: 'yellow',
              }}
              onClick={() => {
                stopCountdownClock();
              }}
            />
          ) : null}
        </>
      ) : (
        <>
          <textarea
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              zIndex: 999,
            }}
            rows='4'
            cols='13'
            readOnly
            value={`{'eggX': ${eggX.toFixed(0)},\n'eggY': ${eggY.toFixed(
              0,
            )},\n'eggRadius': ${eggRadius}}`}
          />
          <input
            type='range'
            min='1'
            max='1000'
            value={eggRadius}
            style={{
              position: 'absolute',
              top: '70px',
              left: '0px',
              zIndex: 999,
            }}
            onChange={(e) => setEggRadius(e.target.value)}
          />
        </>
      )}
      <Stage width={width} height={height}>
        <Layer>
          <Rect
            width={width}
            height={height}
            fill={currentLocation.blackScreen ? '#000000' : '#999999'}
          />
          {!currentLocation.blackScreen ? (
            <Image image={image} x={imageX} scaleX={scale} scaleY={scale} />
          ) : null}
        </Layer>
        <Layer>
          {currentLocation.name !== 'EMPTYSTAIRDOWN' &&
          currentLocation.name !== 'FOURTHBASEMENT' &&
          !currentLocation.blackScreen &&
          (numberOfExesFound > 0 && numberOfExesFound < 20 ? (
            <>
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
                text={`${numberOfExesFound}/20 X's found`}
                fontSize={30 * elementScale}
              />
            </>
          ) : insideGlitchMap ? (
            <>
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
                text={`EGGs Found: ${score}/15`}
                fontSize={30 * elementScale}
              />
            </>
          ) : (
            <>
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
                text={`Eggs Found: ${score}/${currentLocation.fourthHouse ? 10 : 50}`}
                fontSize={30 * elementScale}
              />
            </>
          ))}

          {// If in HUNT_MODE, put invisible circles on unfound eggs and stars on found eggs
          props.HUNT_MODE ? (
            currentLocation.eggs.map((egg, i) =>
              foundEggs.indexOf(`${currentLocation.name}egg${i}`) === -1 ? (
                <Circle
                  x={imageX + egg.eggX * scale}
                  y={egg.eggY * scale}
                  radius={egg.eggRadius * scale}
                  fill='rgba(0, 0, 0, 0.001)'
                  onClick={() => collectEgg(i)}
                  onTouchStart={() => collectEgg(i)}
                  key={`${currentLocation.name}egg${i}`}
                />
              ) : currentLocation.fourthHouse &&
                clearedFourthHouseRooms.includes(currentLocation.name) ? null : (
                <Star
                  x={imageX + egg.eggX * scale}
                  y={egg.eggY * scale}
                  innerRadius={egg.eggRadius * scale * 0.7}
                  outerRadius={egg.eggRadius * scale * 1.5}
                  rotation={10 * egg.eggRadius}
                  numPoints={5}
                  fill='#F7BEA0'
                  stroke='black'
                  strokeWidth={2 * scale}
                  key={`${currentLocation.name}egg${i}`}
                />
              ),
            )
          ) : (
            <Circle
              x={imageX + eggX * scale}
              y={eggY * scale}
              radius={eggRadius * scale}
              draggable
              onDragMove={handleImageDrag}
              stroke={'red'}
              strokeWidth={2}
            />
          )}
          {currentLocation.keys
            ? currentLocation.keys.map((key, i) =>
                foundKeys.indexOf(`${currentLocation.name}key${i}`) === -1 ? (
                  <Circle
                    x={imageX + key.keyX * scale}
                    y={key.keyY * scale}
                    radius={key.keyRadius * scale}
                    fill='rgba(0, 0, 0, 0.001)'
                    onClick={() => {
                      triggerRoomUnlock(currentLocation.name);
                      if (currentLocation.name === 'KITCHENCUPBOARD') {
                        props.setFoundKitchenCupboard(true);
                      }
                      setFoundKeys([
                        `${currentLocation.name}key${i}`,
                        ...foundKeys,
                      ]);
                    }}
                    onTouchStart={() => {
                      triggerRoomUnlock(currentLocation.name);
                      if (currentLocation.name === 'KITCHENCUPBOARD') {
                        props.setFoundKitchenCupboard(true);
                      }
                      setFoundKeys([
                        `${currentLocation.name}key${i}`,
                        ...foundKeys,
                      ]);
                    }}
                    key={`${currentLocation.name}key${i}`}
                  />
                ) : (
                  <Image
                    image={checkmark}
                    x={imageX + key.keyX * scale - scale * key.keyRadius}
                    y={key.keyY * scale - scale * key.keyRadius}
                    width={scale * key.keyRadius * 2}
                    height={scale * key.keyRadius * 2}
                    key={`${currentLocation.name}key${i}`}
                  />
                ),
              )
            : null}
          {currentLocation.exes
            ? currentLocation.exes.map((ex, i) =>
                foundExes.indexOf(`${currentLocation.name}ex${i}`) === -1 ? (
                  <Circle
                    x={imageX + ex.exX * scale}
                    y={ex.exY * scale}
                    radius={ex.exRadius * scale}
                    fill='rgba(0, 0, 0, 0.001)'
                    onClick={() => {
                      setNumberOfExesFound(numberOfExesFound + 1);
                      setFoundExes([
                        `${currentLocation.name}ex${i}`,
                        `${changeXLocationToBroken(currentLocation)}ex${i}`,
                        ...foundExes,
                      ]);
                      setScore(0);
                    }}
                    onTouchStart={() => {
                      setNumberOfExesFound(numberOfExesFound + 1);
                      setFoundExes([
                        `${currentLocation.name}ex${i}`,
                        `${changeXLocationToBroken(currentLocation)}ex${i}`,
                        ...foundExes,
                      ]);
                      setScore(0);
                    }}
                    key={`${currentLocation.name}ex${i}`}
                  />
                ) : (
                  <Circle
                    x={imageX + ex.exX * scale}
                    y={ex.exY * scale}
                    radius={ex.exRadius * scale}
                    key={`${currentLocation.name}ex${i}`}
                    stroke={'red'}
                    strokeWidth={2}
                  />
                ),
              )
            : null}
          <Group
            visible={
              !showLevel3Congratulations &&
              currentLocation.name !== 'FOURTHBASEMENT'
            }
          >
          {currentLocation.randomArrow && (
            <Image
              image={glitchedArrow}
              {...getArrowPosition(
                glitchedArrow,
                randomNumberGenerator(225, image.width - 225),
                randomNumberGenerator(150, image.height - 150),
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => {
                setScore(0);
                setLevel(4);
                changeLocation(randomGlitchLocation().name);
                setInsideGlitchMap(true);
              }}
              onTouchStart={() => {
                setScore(0);
                setLevel(4);
                changeLocation(randomGlitchLocation().name);
                setInsideGlitchMap(true);
              }}
            />
          )}
          {currentLocation.randomArrows && (
            <>
              <Image
                image={randomDirectionArrow()}
                {...getArrowPosition(
                  arrowUp,
                  randomNumberGenerator(275, image.width - 275),
                  randomNumberGenerator(0, image.height),
                )}
                scaleX={directionScale}
                scaleY={directionScale}
                onClick={() => {
                  changeLocation(randomGlitchLocation().name);
                }}
                onTouchStart={() => {
                  changeLocation(randomGlitchLocation().name);
                }}
              />
              <Image
                image={randomDirectionArrow()}
                {...getArrowPosition(
                  arrowUp,
                  randomNumberGenerator(275, image.width - 275),
                  randomNumberGenerator(0, image.height),
                )}
                scaleX={directionScale}
                scaleY={directionScale}
                onClick={() => {
                  changeLocation(randomGlitchLocation().name);
                }}
                onTouchStart={() => {
                  changeLocation(randomGlitchLocation().name);
                }}
              />
              <Image
                image={randomDirectionArrow()}
                {...getArrowPosition(
                  arrowUp,
                  randomNumberGenerator(275, image.width - 275),
                  randomNumberGenerator(0, image.height),
                )}
                scaleX={directionScale}
                scaleY={directionScale}
                onClick={() => {
                  changeLocation(randomGlitchLocation().name);
                }}
                onTouchStart={() => {
                  changeLocation(randomGlitchLocation().name);
                }}
              />
            </>
          )}
          {currentLocation.up && (
            <Image
              image={arrowUp}
              {...getArrowPosition(
                arrowUp,
                currentLocation.up.arrowX,
                currentLocation.up.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => changeLocation(currentLocation.up.transferTo)}
              onTouchStart={() => changeLocation(currentLocation.up.transferTo)}
            />
          )}
          {currentLocation.down && (
            <Image
              image={arrowDown}
              {...getArrowPosition(
                arrowDown,
                image.width * 0.5,
                image.height * 0.82,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => changeLocation(currentLocation.down)}
              onTouchStart={() => changeLocation(currentLocation.down)}
            />
          )}
          {currentLocation.goBack && (
            <Image
              image={goBack}
              {...getArrowPosition(
                goBack,
                image.width * 0.5,
                image.height * 0.82,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => changeLocation(currentLocation.goBack)}
              onTouchStart={() => changeLocation(currentLocation.goBack)}
            />
          )}
          {currentLocation.left && (
            <Image
              image={arrowLeft}
              {...getArrowPosition(
                arrowLeft,
                currentLocation.left.arrowX,
                currentLocation.left.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => changeLocation(currentLocation.left.transferTo)}
              onTouchStart={() =>
                changeLocation(currentLocation.left.transferTo)
              }
            />
          )}
          {currentLocation.turnLeft && (
            <Image
              image={arrowTurnLeft}
              {...getArrowPosition(
                arrowTurnLeft,
                currentLocation.turnLeft.arrowX,
                currentLocation.turnLeft.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() =>
                changeLocation(currentLocation.turnLeft.transferTo)
              }
              onTouchStart={() =>
                changeLocation(currentLocation.turnLeft.transferTo)
              }
            />
          )}
          {currentLocation.right && (
            <Image
              image={arrowRight}
              {...getArrowPosition(
                arrowRight,
                currentLocation.right.arrowX,
                currentLocation.right.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => changeLocation(currentLocation.right.transferTo)}
              onTouchStart={() =>
                changeLocation(currentLocation.right.transferTo)
              }
            />
          )}
          {currentLocation.turnRight && (
            <Image
              image={arrowTurnRight}
              {...getArrowPosition(
                arrowTurnRight,
                currentLocation.turnRight.arrowX,
                currentLocation.turnRight.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() =>
                changeLocation(currentLocation.turnRight.transferTo)
              }
              onTouchStart={() =>
                changeLocation(currentLocation.turnRight.transferTo)
              }
            />
          )}
          {currentLocation.turnAroundRight && (
            <Image
              image={turnAroundArrow}
              {...getArrowPosition(
                turnAroundArrow,
                currentLocation.turnAroundRight.arrowX,
                currentLocation.turnAroundRight.arrowY,
                true,
              )}
              scaleX={-directionScale}
              scaleY={directionScale}
              onClick={() =>
                changeLocation(currentLocation.turnAroundRight.transferTo)
              }
              onTouchStart={() =>
                changeLocation(currentLocation.turnAroundRight.transferTo)
              }
            />
          )}
          {currentLocation.turnAroundLeft && (
            <Image
              image={turnAroundArrow}
              {...getArrowPosition(
                turnAroundArrow,
                currentLocation.turnAroundLeft.arrowX,
                currentLocation.turnAroundLeft.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() =>
                changeLocation(currentLocation.turnAroundLeft.transferTo)
              }
              onTouchStart={() =>
                changeLocation(currentLocation.turnAroundLeft.transferTo)
              }
            />
          )}
          {currentLocation.mystery && (
            <Image
              image={arrowRight}
              {...getArrowPosition(
                arrowRight,
                currentLocation.mystery.arrowX,
                currentLocation.mystery.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => {
                mysteryTrigger();
                changeLocation(currentLocation.mystery.transferTo);
              }}
              onTouchStart={() => {
                mysteryTrigger();
                changeLocation(currentLocation.mystery.transferTo);
              }}
            />
          )}
          {currentLocation.secondHouse && (
            <Image
              image={arrowUp}
              {...getArrowPosition(
                arrowUp,
                currentLocation.secondHouse.arrowX,
                currentLocation.secondHouse.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => {
                setLevel(2);
                changeLocation(currentLocation.secondHouse.transferTo);
                secondHouseTrigger('in');
                setScore(0);
                setMaxScore(50);
              }}
              onTouchStart={() => {
                setLevel(2);
                changeLocation(currentLocation.secondHouse.transferTo);
                secondHouseTrigger('in');
                setScore(0);
                setMaxScore(50);
              }}
            />
          )}
          {currentLocation.exitSecondHouse && (
            <Image
              image={arrowRight}
              {...getArrowPosition(
                arrowRight,
                currentLocation.exitSecondHouse.arrowX,
                currentLocation.exitSecondHouse.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => {
                changeLocation(currentLocation.exitSecondHouse.transferTo);
                secondHouseTrigger(
                  'out',
                  props.startCountdown,
                  props.setStartCountdown,
                );
              }}
              onTouchStart={() => {
                changeLocation(currentLocation.exitSecondHouse.transferTo);
                secondHouseTrigger(
                  'out',
                  props.startCountdown,
                  props.setStartCountdown,
                );
              }}
            />
          )}
          {currentLocation.quiz && (
            <Image
              image={arrowUp}
              {...getArrowPosition(
                arrowUp,
                currentLocation.quiz.arrowX,
                currentLocation.quiz.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => {
                props.setStatus('quiz');
              }}
              onTouchStart={() => {
                props.setStatus('quiz');
              }}
            />
          )}
          {currentLocation.end && (
            <Image
              image={arrowUp}
              {...getArrowPosition(
                arrowUp,
                currentLocation.end.arrowX,
                currentLocation.end.arrowY,
              )}
              scaleX={directionScale}
              scaleY={directionScale}
              onClick={() => {
                resetFourthHouse();
                setClearedFourthHouseRooms([]);
                setLevel(4);
                setScore(0);
                setMaxScore(10);
                setFoundEggs([]);
                changeLocation(currentLocation.end.transferTo);
              }}
              onTouchStart={() => {
                resetFourthHouse();
                setClearedFourthHouseRooms([]);
                setLevel(4);
                setScore(0);
                setMaxScore(10);
                setFoundEggs([]);
                changeLocation(currentLocation.end.transferTo);
              }}
            />
          )}
          </Group>
          {currentLocation.computer ? (
              <Circle
                x={imageX + currentLocation.computer.computerX * scale}
                y={currentLocation.computer.computerY * scale}
                radius={currentLocation.computer.computerRadius * scale}
                onClick={() => openComputer()}
                onTouchStart={() => openComputer()}
              />
          ) : null}
          {score === maxScore && level === 1 && congratulationsLevel1 ? (
            <Image
              image={congratulationsLevel1}
              x={
                width * 0.5 - congratulationsLevel1.width * 0.375 * elementScale
              }
              y={
                height * 0.5 -
                congratulationsLevel1.height * 0.375 * elementScale
              }
              scaleX={elementScale * 0.75}
              scaleY={elementScale * 0.75}
              onClick={() => {
                triggerRoomUnlock('MYSTERY');
                setMaxScore(250);
              }}
              onTouchStart={() => {
                triggerRoomUnlock('MYSTERY');
                setMaxScore(250);
              }}
            />
          ) : null}
          {score === maxScore && level === 2 && congratulationsLevel2 ? (
            <Image
              image={congratulationsLevel2}
              x={
                width * 0.5 - congratulationsLevel2.width * 0.375 * elementScale
              }
              y={
                height * 0.5 -
                congratulationsLevel2.height * 0.375 * elementScale
              }
              scaleX={elementScale * 0.75}
              scaleY={elementScale * 0.75}
              onClick={() => {
                triggerRoomUnlock('SECONDMYSTERY');
                setLevel(3);
                setMaxScore(250);
              }}
              onTouchStart={() => {
                triggerRoomUnlock('SECONDMYSTERY');
                setLevel(3);
                setMaxScore(250);
              }}
            />
          ) : null}
          {showLevel3Congratulations && congratulationsLevel3 ? (
            <>
              <Rect
                width={width}
                height={height}
                fill='#000'
                onClick={dismissLevel3Congratulations}
                onTouchStart={dismissLevel3Congratulations}
              />
              <Image
                image={congratulationsLevel3}
                x={imageX}
                y={0}
                width={renderedImageWidth}
                height={renderedImageHeight}
                onClick={dismissLevel3Congratulations}
                onTouchStart={dismissLevel3Congratulations}
              />
            </>
          ) : null}
        </Layer>
      </Stage>
      {props.startCountdown ? (
        <Portal isOpened>
          <PopUpWindow
            id='popUpWindow'
            windowHeight={height}
            windowWidth={width}
            elementScale={elementScale}
          />
        </Portal>
      ) : null}
      {isComputerOpen ? (
        <ComputerDesktop
          onClose={() => setIsComputerOpen(false)}
          canPlayShellHouse={
            props.foundKitchenCupboard &&
            props.perfectQuizScore &&
            desktopClickCount < 450
          }
          foundKitchenCupboard={props.foundKitchenCupboard}
          perfectQuizScore={props.perfectQuizScore}
          playerName={props.leaderboardName}
          startTime={props.startTime}
          isCheatRun={props.isCheatRun}
          startLeaderboardOpen={props.startLeaderboardOpen}
          sessionClickCount={desktopClickCount}
        />
      ) : null}
    </>
  );
}

NavigationButtons.propTypes = {
  name: PropTypes.string,
  HUNT_MODE: PropTypes.bool,
  currentLocation: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  status: PropTypes.string,
  setStatus: PropTypes.func,
  startCountdown: PropTypes.bool,
  setStartCountdown: PropTypes.func,
  startTime: PropTypes.number,
  foundKitchenCupboard: PropTypes.bool,
  perfectQuizScore: PropTypes.bool,
  setFoundKitchenCupboard: PropTypes.func,
  leaderboardName: PropTypes.string,
  isCheatRun: PropTypes.bool,
  startComputerOpen: PropTypes.bool,
  startLeaderboardOpen: PropTypes.bool,
  sessionClickCount: PropTypes.number,
  onDesktopOpen: PropTypes.func,
};
