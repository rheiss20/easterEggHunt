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

import soundfile from './sounds/splashPageMusic.mp3';

// Turn off HUNT_MODE to enable tools to get the x/y/radius of the eggs
const HUNT_MODE = true;

// Preload all the maps
Object.keys(maps).forEach(key => {
  let image = new window.Image();
  image.src = maps[key].imageName;
  maps[key].image = image
});

const height = window.innerHeight;
const width = window.innerWidth;

// AUDIO SETTINGS

const audioElement = new Audio(soundfile);

const controlAudio = (command) => {
  if (command === 'play'){
    audioElement.loop = true;
    audioElement.volume = 0.2;
    audioElement.play();
  } else if (command === 'stop'){
    audioElement.pause();
    audioElement.currentTime = 0;
  }
};

function App() {
  const [status, setStatus] = useState('loading');

  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [foundEggs, setFoundEggs] = useState([]);

  const [scale, setScale] = useState(0.2);
  const [image, setImage] = useState();
  const [imageX, setImageX] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(maps.ENTRANCE);

  const [eggX, setEggX] = useState(576);
  const [eggY, setEggY] = useState(446);
  const [eggRadius, setEggRadius] = useState(30);

  const [landingPage] = useImage('ATNEggHunt.png');
  const [arrowUp] = useImage('ArrowUp.png');
  const [arrowDown] = useImage('ArrowDown.png');
  const [arrowLeft] = useImage('ArrowLeft.png');
  const [arrowRight] = useImage('ArrowRight.png');
  const [elevatorUp] = useImage('ElevatorUp.png');
  const [elevatorDown] = useImage('ElevatorDown.png');
  const [mystery] = useImage('question mark icon.jpg');
  const [invisible] = useImage('invisible.png');

  // THIS WILL BE THE TRIGGER THAT MAKES THE SECRET TUNNEL ACCESSIBLE
  let mysteryOrInvisible;

  if (score > 2) {
    mysteryOrInvisible = mystery;
  } else {
    mysteryOrInvisible = invisible;
  }
  // *****************************************************************

  let handleImageDrag = event => {
    setEggX((event.target.attrs.x- imageX) / scale )
    setEggY((event.target.attrs.y  / scale))
  }

  useEffect(() => {
    if(landingPage){
      setStatus('landing')
      setImage(landingPage)
    }
  }, [landingPage])


  useEffect(() => {
    if(status === 'hunting'){
      alert(`Have yourself an Easter egg hunt without leaving the safety and comfort of your own home! There are 36 eggs hidden inside the house. Use the arrows to navigate, and click on the egg when you find it! Have fun, and try to collect them all!`)
    }
  }, [status])

  useEffect(() => {
    switch(status) {
      case 'landing':
        setImage(landingPage); break
      case 'hunting': setImage(currentLocation.image); break
      default:
    }
  }, [status, currentLocation, landingPage])

  // On first mount, check if we need to load up a map
  useEffect(() => {
    if (image) {
      let scaleX = width / image.width
      let scaleY = height / image.height
      let scale = Math.min(scaleX, scaleY)
      let imageX = (window.innerWidth/2) - (image.width * scale * 0.5)
      setScale(scale)
      setImageX(imageX)
    }
  }, [image])

  let changeLocation = (newLocationName) => {
    setCurrentLocation(maps[newLocationName])
  }

  if (status === 'loading') {
    return (<div>Loading</div>)
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
          top: `${870 * scale}px`,
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
            top: `${975 * scale}px`,
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
            alert(`${name} found ${score} out of 36 eggs!\nThanks for playing!`);
            setStatus('landing');
            setName('');
            setScore(0);
            setFoundEggs([]);
            setCurrentLocation(maps.ENTRANCE);
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
              max="200"
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
            text={`Current Score: ${score}`}
            fontSize={30}
          />

          {currentLocation.up &&
          <Image
            image={arrowUp}
            x={window.innerWidth * 0.5 - (arrowUp ? arrowUp.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.8 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.1}
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
            x={window.innerWidth * 0.47 - (arrowLeft ? arrowLeft.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.78 + (arrowLeft ? arrowLeft.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.left)}
          />}
          { currentLocation.right &&
          <Image
            image={arrowRight}
            x={window.innerWidth * 0.53 - (arrowRight ? arrowRight.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.78 + (arrowRight ? arrowRight.height : 0) * 0.5 * 0.1}
            scaleX={0.1}
            scaleY={0.1}
            onClick={() => changeLocation(currentLocation.right)}
          />}

          { currentLocation.elevatorUp &&
          <Image
            image={elevatorUp}
            x={window.innerWidth * 0.47 - (arrowLeft ? arrowLeft.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.74 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.1}
            scaleX={0.5}
            scaleY={0.5}
            onClick={() => changeLocation(currentLocation.elevatorUp)}
          />}
          { currentLocation.elevatorDown &&
          <Image
            image={elevatorDown}
            x={window.innerWidth * 0.53 - (elevatorDown ? elevatorDown.width : 0) * 0.5 * 0.1}
            y={window.innerHeight * 0.76 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.1}
            scaleX={0.5}
            scaleY={0.5}
            onClick={() => changeLocation(currentLocation.elevatorDown)}
          />}
          { currentLocation.mystery &&
          <Image
              image={mysteryOrInvisible}
              x={window.innerWidth * 0.53 - (elevatorDown ? elevatorDown.width : 0) * 0.5 * 0.1}
              y={window.innerHeight * 0.76 - (arrowUp ? arrowUp.height : 0) * 0.5 * 0.1}
              scaleX={0.5}
              scaleY={0.5}
              onClick={() => changeLocation(currentLocation.mystery)}
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
                      rotation={10}
                      numPoints={5}
                      fill='#F96302'
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
        </Layer>
      </Stage>
      </>);
  } else {
    return (<div>Something done broke</div>)
  }

}

export default App;
