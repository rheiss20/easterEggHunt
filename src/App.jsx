import React, {
  useState,
  useEffect
} from 'react';
import {
  Image,
  Layer,
  Stage,
} from 'react-konva';
import useImage from 'use-image';
import maps from './maps.json';

import { QuizSection } from './quiz/main';
import {
  cheatChecker,
  controlAudio, randomRoom,
  renderLoadingScreen,
} from './util';
import { NavigationButtons } from './NavigationButtons';

// this is the establishment of the profanity filter for the name entry
import filter from 'leo-profanity';
filter.add(["4r5e", "5h1t", "5hit", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bit.ly", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cok", "coon", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cyalis", "cialis", "d1ck", "damn", "dick", "dildo", "dirsa", "dlck", "donkeyribber", "doosh", "duche", "dyke", "ejaculat", "ejakulat", "f u c k", "f u c k e r", "f4nny", "fag", "fanny", "fanyy", "fcuk", "feck", "felching", "fellat", "flange", "fook", "fooker", "fuck", "fuck", "fudge packer", "fudgepacker", "fuk", "fux", "f_u_c_k", "gangbang", "gaysex", "goatse", "god-damn", "goddamn", "hell", "hore", "horny", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "kike", "kyke", "k1ke", "k1k3", "knob", "knobhead", "knobjocky", "knobjokey", "kock", "kum", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbat", "masturbat", "mo-fo", "mof0", "mofo", "muff", "n1gga", "n1gger", "nazi", "nigg3r", "n1gg3r", "nigg4h", "n1gg4h", "nigga", "nigger", "n!gga", "n!gger", "naz!", "n!gg3r", "n!gg3r", "n!gg4h", "n!gg4h", "n!gga", "n!gger", "nutsack", "orgasim", "orgasm", "p0rn", "penis", "penor", "p3nor", "p3n0r", "phuck", "phuk", "phuq", "pigfucker", "piss", "poop", "porn", "prick", "pron", "pube", "pusse", "pussi", "s3x", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "s.o.b.", "schlong", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shemale", "shi+", "shit", "slut", "sluts", "smegma", "snatch", "spac", "s_h_i_t", "t1tt1e5", "t1tties", "t1ts", "teets", "teez", "testical", "testicle", "tit", "tinyurl", "tosser", "turd", "tw4t", "twat", "twunt", "v14gra", "v1gra", "vagina", "vag1na", "viagra", "vulva", "w00se", "wang", "wank", "whoar", "whore", "www", "xrated", "xxx"]);
filter.remove(["ass", "bestial", "bloody", "hell"]);

export function App () {
  // Turn off HUNT_MODE to enable tools to get the x/y/radius of the eggs
  const [HUNT_MODE, setHUNT_MODE] = useState('true');
  const [status, setStatus] = useState('loading');
  const [name, setName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [level, setLevel] = useState(1);
  const [startCountdown, setStartCountdown] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [renderStopClockButton, setRenderStopClockButton] = useState(false);
  const [image, setImage] = useState(useImage('SplashPage.jpg'));
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [scale, setScale] = useState(Math.min((width / image.width), (height / image.height)));
  const [imageX, setImageX] = useState((width / 2) - (image.width * scale * 0.5));
  const [currentLocation, setCurrentLocation] = useState(maps.LIVINGROOM);
  const [landingPage] = useImage('SplashPage.jpg');

  cheatChecker(name, setName, setStatus, setCurrentLocation, setLevel, startCountdown, setStartCountdown, setRenderStopClockButton, setHUNT_MODE);

  randomRoom();

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  // // On first mount, check if we need to load up a map
  useEffect(() => {
    if (landingPage) {
      setStatus('landing');
      setImage(landingPage);
    }
  }, [landingPage]);

  useEffect(() => {
    window.addEventListener('resize', updateWidthAndHeight);
    if (image) {
      const scaleX = width / image.width;
      const scaleY = height / image.height;
      const scale = Math.min(scaleX, scaleY);
      const imageX = (width / 2) - (image.width * scale * 0.5);
      setScale(scale);
      setImageX(imageX);
    }
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  }, [height, width, image]);

  // this is the function that actually checks the entire name string and sees if any of the words
  // in the profanity list are anywhere in the string
  const nameCheck = (name) => {
    for(let i =0;i < filter.list().length; i++){
      if(name.toLowerCase().indexOf(filter.list()[i]) != -1)
        return true;
    }
  };

  if (status === 'loading') {
    return (<div>
      { renderLoadingScreen() }
    </div>);
  } else if (status === 'landing' || status === 'checking name') {
    return (
      <>
        <input
          type='text'
          placeholder='What is your name?'
          value={ name }
          autoFocus
          style={{
            position: 'absolute',
            top: `${(870 * scale) - (30 * scale)}px`,
            left: `${imageX + (image.width / 2 * scale) - (200 * scale)}px`,
            zIndex: 999,
            height: `${70 * scale}px`,
            width: `${400 * scale}px`,
            fontSize: `${40 * scale}px`
          }}
          onChange={ (e) => setName(e.target.value) }
        />
        <input
          type='Button'
          value='Start!'
          style={{
            position: 'absolute',
            top: `${975 * scale - (30 * scale)}px`,
            left: `${imageX + (image.width / 2 * scale) - (150 * scale)}px`,
            zIndex: 999,
            height: `${120 * scale}px`,
            width: `${300 * scale}px`,
            fontSize: `${90 * scale}px`,
            background: `${name === '' ? '' : '#F9FC9D'}`
          }}
          disabled={ name === '' || nameCheck(name) }
          onClick={ () => {
            setStatus('hunting');
            controlAudio('play', 'hunting');
          }
          }
        />
        <Stage
          width={ width }
          height={ height }
        >
          <Layer>
            <Image
              image={ image }
              x={ imageX }

              scaleX={ scale }
              scaleY={ scale }
            />
          </Layer>
        </Stage>
      </>
    );
  } else if (status === 'hunting') {
    return (<NavigationButtons
      name={name}
      HUNT_MODE={HUNT_MODE}
      setHUNT_MODE={setHUNT_MODE}
      currentLocation={currentLocation}
      width={ width }
      height={ height }
      status={status}
    />);
  } else if (status === 'quiz') {
    return (
      <div className={ 'quiz' }>
        { QuizSection(name, setStatus) }
      </div>
    );
  } else {
    return (<div>Something done broke</div>);
  }
}

export default App;
