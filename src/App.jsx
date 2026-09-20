import React, { useState, useEffect, useRef } from 'react';
import { Image, Layer, Stage } from 'react-konva';
import useImage from 'use-image';
import maps from './maps.json';

import { QuizSection } from './quiz/main';
import { cheatChecker, controlAudio, renderLoadingScreen } from './util';
import { NavigationButtons } from './NavigationButtons';

// this is the establishment of the profanity filter for the name entry
import filter from 'leo-profanity';
// eslint-disable-next-line quotes
filter.add([
  '4r5e',
  '5h1t',
  '5hit',
  'anal',
  'anus',
  'ar5e',
  'arrse',
  'arse',
  'ass',
  'ass-fucker',
  'asses',
  'assfucker',
  'assfukka',
  'asshole',
  'assholes',
  'asswhole',
  'a_s_s',
  'b!tch',
  'b00bs',
  'b17ch',
  'b1tch',
  'ballbag',
  'balls',
  'ballsack',
  'bastard',
  'beastial',
  'beastiality',
  'bellend',
  'bestiality',
  'bi+ch',
  'biatch',
  'bitch',
  'bitcher',
  'bitchers',
  'bitches',
  'bitchin',
  // eslint-disable-next-line quotes
  "bitching",
  'bit.ly',
  'blow job',
  'blowjob',
  'blowjobs',
  'boiolas',
  'bollock',
  'bollok',
  'boner',
  'boob',
  'boobs',
  'booobs',
  'boooobs',
  'booooobs',
  'booooooobs',
  'breasts',
  'buceta',
  'bugger',
  'bum',
  'butt',
  'butthole',
  'buttmuch',
  'buttplug',
  'c0ck',
  'c0cksucker',
  'carpet muncher',
  'cawk',
  'chink',
  'cipa',
  'cl1t',
  'clit',
  'clitoris',
  'clits',
  'cnut',
  'cock',
  'cok',
  'coon',
  'crap',
  'cum',
  'cummer',
  'cumming',
  'cums',
  'cumshot',
  'cunilingus',
  'cunillingus',
  'cunnilingus',
  'cunt',
  'cyalis',
  'cialis',
  'd1ck',
  'damn',
  'dick',
  'dildo',
  'dirsa',
  'dlck',
  'donkeyribber',
  'doosh',
  'duche',
  'dyke',
  'ejaculat',
  'ejakulat',
  'f u c k',
  'f u c k e r',
  'f4nny',
  'fag',
  'fanny',
  'fanyy',
  'fcuk',
  'feck',
  'felching',
  'fellat',
  'flange',
  'fook',
  'fooker',
  'fuck',
  'fuck',
  'fudge packer',
  'fudgepacker',
  'fuk',
  'fux',
  'f_u_c_k',
  'gangbang',
  'gaysex',
  'goatse',
  'god-damn',
  'goddamn',
  'hell',
  'hore',
  'horny',
  'jack-off',
  'jackoff',
  'jap',
  'jerk-off',
  'jism',
  'jiz',
  'jizm',
  'jizz',
  'kawk',
  'kike',
  'kyke',
  'k1ke',
  'k1k3',
  'knob',
  'knobhead',
  'knobjocky',
  'knobjokey',
  'kock',
  'kum',
  'kunilingus',
  'l3i+ch',
  'l3itch',
  'labia',
  'lust',
  'm0f0',
  'm0fo',
  'm45terbate',
  'ma5terb8',
  'ma5terbate',
  'masochist',
  'master-bate',
  'masterb8',
  'masterbat*',
  'masterbat3',
  'masterbat',
  'masturbat',
  'mo-fo',
  'mof0',
  'mofo',
  'muff',
  'n1gga',
  'n1gger',
  'nazi',
  'nigg3r',
  'n1gg3r',
  'nigg4h',
  'n1gg4h',
  'nigga',
  'nigger',
  'n!gga',
  'n!gger',
  'naz!',
  'n!gg3r',
  'n!gg3r',
  'n!gg4h',
  'n!gg4h',
  'n!gga',
  'n!gger',
  'nutsack',
  'orgasim',
  'orgasm',
  'p0rn',
  'penis',
  'penor',
  'p3nor',
  'p3n0r',
  'phuck',
  'phuk',
  'phuq',
  'pigfucker',
  'piss',
  'poop',
  'porn',
  'prick',
  'pron',
  'pube',
  'pusse',
  'pussi',
  's3x',
  'pussies',
  'pussy',
  'pussys',
  'rectum',
  'retard',
  'rimjaw',
  'rimming',
  's hit',
  's.o.b.',
  'schlong',
  'scroat',
  'scrote',
  'scrotum',
  'semen',
  'sex',
  'sh!+',
  'sh!t',
  'sh1t',
  'shemale',
  'shi+',
  'shit',
  'slut',
  'sluts',
  'smegma',
  'snatch',
  'spac',
  's_h_i_t',
  't1tt1e5',
  't1tties',
  't1ts',
  'teets',
  'teez',
  'testical',
  'testicle',
  'tit',
  'tinyurl',
  'tosser',
  'turd',
  'tw4t',
  'twat',
  'twunt',
  'v14gra',
  'v1gra',
  'vagina',
  'vag1na',
  'viagra',
  'vulva',
  'w00se',
  'wang',
  'wank',
  'whoar',
  'whore',
  'www',
  'xrated',
  'xxx',
]);
filter.remove(['ass', 'bestial', 'bloody', 'hell']);

export function App() {
  // Turn off HUNT_MODE to enable tools to get the x/y/radius of the eggs
  const [HUNT_MODE, setHUNT_MODE] = useState(true);
  const [status, setStatus] = useState('loading');
  const [name, setName] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [level, setLevel] = useState(1);
  const [startCountdown, setStartCountdown] = useState(false);
  const [foundKitchenCupboard, setFoundKitchenCupboard] = useState(false);
  const [perfectQuizScore, setPerfectQuizScore] = useState(false);
  const [leaderboardName, setLeaderboardName] = useState('');
  const [isCheatRun, setIsCheatRun] = useState(false);
  const [startComputerOpen, setStartComputerOpen] = useState(false);
  const [startLeaderboardOpen, setStartLeaderboardOpen] = useState(false);
  const [sessionClickCount, setSessionClickCount] = useState(0);
  const clickCountRef = useRef(0);
  const isClickTrackingRef = useRef(false);
  const hasRunStartedRef = useRef(false);
  // eslint-disable-next-line no-unused-vars
  const [renderStopClockButton, setRenderStopClockButton] = useState(false);
  const [landingPage] = useImage('SplashPage.jpg');
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [scale, setScale] = useState(1);
  const [imageX, setImageX] = useState(width / 2);
  const [currentLocation, setCurrentLocation] = useState(maps.LIVINGROOM);
  const [startTime, setStartTime] = useState(0);
  const renderedImageWidth = image ? image.width * scale : width;
  const renderedImageHeight = image ? image.height * scale : height;
  const inputWidth = Math.min(360, renderedImageWidth * 0.62);
  const inputHeight = Math.min(52, renderedImageHeight * 0.065);
  const buttonWidth = Math.min(240, renderedImageWidth * 0.42);
  const buttonHeight = Math.min(72, renderedImageHeight * 0.09);
  const mobileLandingOffset = width <= 600 ? 50 : 0;
  const landingInputLeft = imageX + renderedImageWidth / 2 - inputWidth / 2;
  const landingInputTop = Math.max(
    16,
    renderedImageHeight * 0.62 - 150 + mobileLandingOffset,
  );
  const landingButtonLeft = imageX + renderedImageWidth / 2 - buttonWidth / 2;
  const landingButtonTop = Math.max(
    landingInputTop + inputHeight + 12,
    renderedImageHeight * 0.71 - 150 + mobileLandingOffset,
  );

  useEffect(() => {
    cheatChecker(
      name,
      setName,
      setStatus,
      setCurrentLocation,
      setLevel,
      startCountdown,
      setStartCountdown,
      setRenderStopClockButton,
      setHUNT_MODE,
      setFoundKitchenCupboard,
      setPerfectQuizScore,
      setLeaderboardName,
      setIsCheatRun,
      setStartTime,
      setStartComputerOpen,
      setStartLeaderboardOpen,
    );
  }, [name, startCountdown]);

  useEffect(() => {
    if (
      !hasRunStartedRef.current &&
      (status === 'hunting' || status === 'quiz')
    ) {
      clickCountRef.current = 0;
      isClickTrackingRef.current = true;
      hasRunStartedRef.current = true;
    }
  }, [status]);

  useEffect(() => {
    const trackClick = () => {
      if (isClickTrackingRef.current) {
        clickCountRef.current += 1;
      }
    };
    document.addEventListener('click', trackClick);
    return () => document.removeEventListener('click', trackClick);
  }, []);

  const finishClickTracking = (includeOpeningClick = false) => {
    if (!isClickTrackingRef.current) return clickCountRef.current;
    if (includeOpeningClick) {
      clickCountRef.current += 1;
    }
    isClickTrackingRef.current = false;
    setSessionClickCount(clickCountRef.current);
    return clickCountRef.current;
  };

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
      const nextScale = Math.min(scaleX, scaleY);
      const nextImageX = width / 2 - image.width * nextScale * 0.5;
      setScale(nextScale);
      setImageX(nextImageX);
    }
    return () => window.removeEventListener('resize', updateWidthAndHeight);
  }, [height, width, image]);

  // this is the function that actually checks the entire name string and sees if any of the words
  // in the profanity list are anywhere in the string
  const nameCheck = (name) => {
    for (let i = 0; i < filter.list().length; i++) {
      if (name.toLowerCase().indexOf(filter.list()[i]) != -1) return true;
    }
  };

  if (status === 'loading') {
    return <div>{renderLoadingScreen()}</div>;
  } else if (status === 'landing' || status === 'checking name') {
    return (
      <>
        <input
          type='text'
          placeholder='What is your name?'
          value={name}
          autoFocus
          style={{
            position: 'absolute',
            top: `${landingInputTop}px`,
            left: `${landingInputLeft}px`,
            zIndex: 999,
            height: `${inputHeight}px`,
            width: `${inputWidth}px`,
            fontSize: `${Math.min(28, inputHeight * 0.5)}px`,
          }}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type='button'
          style={{
            position: 'absolute',
            top: `${landingButtonTop}px`,
            left: `${landingButtonLeft}px`,
            zIndex: 999,
            height: `${buttonHeight}px`,
            width: `${buttonWidth}px`,
            fontSize: `${Math.min(40, buttonHeight * 0.55)}px`,
            background: `${name === '' ? '' : '#F9FC9D'}`,
          }}
          disabled={name === '' || nameCheck(name)}
          onClick={() => {
            setLeaderboardName(name);
            setIsCheatRun(false);
            setStatus('hunting');
            controlAudio('play', 'hunting');
            alert(
              'Have yourself an Easter egg hunt without leaving the safety and comfort of your own home! There are 50 eggs hidden inside this house. Click on the arrows to navigate, and click on an egg when you find it to add it to your score! Have fun, and try to collect them all!\n(Click \'Give Up\' when you are done playing.)',
            );
            setStartTime(Date.now());
          }}
        >
          Start!
        </button>
        <Stage width={width} height={height}>
          <Layer>
            <Image image={image} x={imageX} scaleX={scale} scaleY={scale} />
          </Layer>
        </Stage>
      </>
    );
  } else if (status === 'hunting') {
    return (
      <NavigationButtons
        name={name}
        HUNT_MODE={HUNT_MODE}
        currentLocation={currentLocation}
        width={width}
        height={height}
        status={status}
        setStatus={setStatus}
        startCountdown={startCountdown}
        setStartCountdown={setStartCountdown}
        startTime={startTime}
        foundKitchenCupboard={foundKitchenCupboard}
        perfectQuizScore={perfectQuizScore}
        setFoundKitchenCupboard={setFoundKitchenCupboard}
        leaderboardName={leaderboardName || name}
        isCheatRun={isCheatRun}
        startComputerOpen={startComputerOpen}
        startLeaderboardOpen={startLeaderboardOpen}
        sessionClickCount={sessionClickCount}
        onDesktopOpen={finishClickTracking}
      />
    );
  } else if (status === 'quiz') {
    return (
      <main className='quiz'>
        {QuizSection(name, setStatus, setPerfectQuizScore)}
      </main>
    );
  } else if (status === 'after quiz') {
    delete maps.FINALSTAIRDOWNBROKEN.quiz;
    maps.FINALSTAIRDOWNBROKEN.up = {
      transferTo: 'DARKSTAIRDOWN',
      arrowX: 995,
      arrowY: 733,
    };

    return (
      <NavigationButtons
        name={name}
        HUNT_MODE={HUNT_MODE}
        currentLocation={maps.LONGSTRAIGHTTUNNEL}
        width={width}
        height={height}
        status={'hunting'}
        setStatus={setStatus}
        startCountdown={false}
        setStartCountdown={setStartCountdown}
        foundKitchenCupboard={foundKitchenCupboard}
        perfectQuizScore={perfectQuizScore}
        setFoundKitchenCupboard={setFoundKitchenCupboard}
        leaderboardName={leaderboardName || name}
        isCheatRun={isCheatRun}
        startTime={startTime}
        startComputerOpen={startComputerOpen}
        startLeaderboardOpen={startLeaderboardOpen}
        sessionClickCount={sessionClickCount}
        onDesktopOpen={finishClickTracking}
      />
    );
  } else {
    return <div>Something done broke</div>;
  }
}

export default App;
