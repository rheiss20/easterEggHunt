import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { EggDoom } from './EggDoom';
import { RecoveryTerminal } from './RecoveryTerminal';
import {
  formatLeaderboardTime,
  getLeaderboardIndex,
  getLeaderboard,
  isPlausibleCompletionTime,
  LEADERBOARD_PAGE_SIZE,
  submitLeaderboardTime,
} from './leaderboard';
import './computer-desktop.css';

const desktopItems = [
  { id: 'photos', icon: 'PH', label: 'House Photos' },
  { id: 'notes', icon: 'DN', label: 'Dev Notes' },
  { id: 'trash', icon: 'TR', label: 'Trash' },
];

const housePhotos = [
  'first_house/living_room_closet.jpg',
  'first_house/kitchen.jpg',
  'first_house/living_room_closed.jpg',
  'first_house/my_door.jpg',
  'first_house/kitchen_corner.jpg',
  'first_house/laundry_hall.jpg',
  'first_house/bathroom.jpg',
  'first_house/bedroom_corner_closed.jpg',
  'first_house/living_room_open.jpg',
  'first_house/bedroom.jpg',
  'first_house/bedroom_corner_open.jpg',
  'first_house/bedroom_closet.jpg',
  'second_house/light/bedroom_corner_2finished.jpg',
  'second_house/light/hallway_2_finished.jpg',
  'second_house/light/bedroom_2_finished.jpg',
  'second_house/light/light_switch_corner_finished.jpg',
  'second_house/light/fridge_corner_finished.jpg',
  'second_house/light/living_room_2_finished.jpg',
  'second_house/light/bathroom_2_finished.jpg',
  'second_house/light/living_room_reverse_finished.jpg',
  'second_house/light/side_room_finished.jpg',
  'second_house/light/kitchen_2_finished.jpg',
  'third_house/third_house_1.jpg',
  'third_house/third_house_3.jpg',
  'third_house/third_house_4.jpg',
  'third_house/third_house_5.jpg',
  'third_house/third_house_6.jpg',
  'third_house/third_house_8.jpg',
  'third_house/third_house_9.jpg',
  'fourth_house/instant_living_room.jpg',
  'fourth_house/instant_kitchen.jpg',
  'fourth_house/instant_bedroom.jpg',
  'fourth_house/instant_dining_room.jpg',
];

const windowContent = {
  photos: {
    title: 'House Photos',
    body: (
      <div className='desktop-photo-roll'>
        {housePhotos.map((photo) => (
          <figure key={photo}>
            <img src={`images/${photo}`} alt='' loading='lazy' />
            <figcaption>{photo.split('/').pop()}</figcaption>
          </figure>
        ))}
      </div>
    ),
  },
};

export function ComputerDesktop({
  onClose,
  canPlayShellHouse,
  foundKitchenCupboard,
  perfectQuizScore,
  playerName,
  startTime,
  isCheatRun,
  startLeaderboardOpen,
  sessionClickCount,
}) {
  const [activeWindow, setActiveWindow] = useState(null);
  const [shellHouseWon, setShellHouseWon] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [theEnd, setTheEnd] = useState(startLeaderboardOpen);
  const [leaderboard, setLeaderboard] = useState(getLeaderboard);
  const [submittedTime, setSubmittedTime] = useState(null);
  const [leaderboardPage, setLeaderboardPage] = useState(0);
  const [submissionError, setSubmissionError] = useState('');
  const now = new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
  useEffect(() => {
    alert(`Session clicks: ${sessionClickCount}`);
  }, [sessionClickCount]);
  const availableItems = [
    ...desktopItems.slice(0, 2),
    ...(canPlayShellHouse
      ? [{ id: 'game', icon: 'SH', label: 'Shell House' }]
      : []),
    ...(shellHouseWon
      ? [{ id: 'recovered', icon: 'RF', label: 'Recovered Files' }]
      : []),
    desktopItems[2],
  ];

  if (theEnd) {
    const submitTime = () => {
      if (isCheatRun || submittedTime !== null) return;
      const totalTime = Date.now() - startTime;
      if (!isPlausibleCompletionTime(totalTime)) {
        setSubmissionError('Run could not be verified. Please complete a full run.');
        return;
      }
      const nextLeaderboard = submitLeaderboardTime(playerName, totalTime);
      const personalBestIndex = getLeaderboardIndex(nextLeaderboard, playerName);
      setLeaderboard(nextLeaderboard);
      setLeaderboardPage(
        Math.max(0, Math.floor(personalBestIndex / LEADERBOARD_PAGE_SIZE)),
      );
      setSubmittedTime(totalTime);
    };
    const totalPages = Math.max(
      1,
      Math.ceil(leaderboard.length / LEADERBOARD_PAGE_SIZE),
    );
    const currentPage = Math.min(leaderboardPage, totalPages - 1);
    const pageStart = currentPage * LEADERBOARD_PAGE_SIZE;
    const visibleEntries = leaderboard.slice(
      pageStart,
      pageStart + LEADERBOARD_PAGE_SIZE,
    );

    return (
      <section className='the-end-screen' aria-label='The End'>
        <h1>THE END</h1>
        <div className='leaderboard-panel'>
          <h2>Leaderboard</h2>
          <ol start={pageStart + 1}>
            {visibleEntries.map((entry, index) => (
              <li key={`${entry.name}-${entry.time}-${index}`}>
                <span>{entry.name}</span>
                <time>{formatLeaderboardTime(entry.time)}</time>
              </li>
            ))}
          </ol>
          <nav className='leaderboard-pagination' aria-label='Leaderboard pages'>
            <button
              type='button'
              aria-label='First leaderboard page'
              onClick={() => setLeaderboardPage(0)}
              disabled={currentPage === 0}
            >«</button>
            <button
              type='button'
              aria-label='Previous leaderboard page'
              onClick={() => setLeaderboardPage(currentPage - 1)}
              disabled={currentPage === 0}
            >‹</button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button
              type='button'
              aria-label='Next leaderboard page'
              onClick={() => setLeaderboardPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >›</button>
            <button
              type='button'
              aria-label='Last leaderboard page'
              onClick={() => setLeaderboardPage(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
            >»</button>
          </nav>
          {submissionError ? (
            <p className='leaderboard-error'>{submissionError}</p>
          ) : null}
          {isCheatRun ? (
            <p>Cheat runs cannot be submitted.</p>
          ) : (
            <button
              type='button'
              onClick={submitTime}
              disabled={submittedTime !== null}
            >
              {submittedTime === null
                ? 'Submit Your Time To The Leaderboard'
                : `Submitted: ${formatLeaderboardTime(submittedTime)}`}
            </button>
          )}
        </div>
      </section>
    );
  }

  const getWindow = () => {
    if (activeWindow === 'trash') {
      return {
        title: 'Trash',
        body: (
          <div className='trash-folder'>
            <button type='button' onClick={() => setActiveWindow('video')}>
              <span>MOV</span>LAST_WALKTHROUGH.mov
            </button>
          </div>
        ),
      };
    }
    if (activeWindow === 'video') {
      return {
        title: 'LAST_WALKTHROUGH.mov',
        body: (
          <div className='desktop-video-player'>
            <video controls autoPlay src='videos/LAST_WALKTHROUGH.mov'>
              Your browser does not support embedded video.
            </video>
            <span>LAST_WALKTHROUGH.mov</span>
          </div>
        ),
      };
    }
    if (activeWindow === 'notes') {
      return {
        title: 'Dev Notes',
        body: (
          <div className='desktop-note dev-notes-file'>
            <h3>Still to do before making the ending:</h3>
            {!foundKitchenCupboard ? <p>- Remember where I put the knife</p> : null}
            {!perfectQuizScore ? <p>- Implement perfectQuizScore function</p> : null}
            {sessionClickCount >= 450 ? (
              <p>- Reduce needed clicks to &lt; 450 (current clicks {sessionClickCount})</p>
            ) : null}
            {foundKitchenCupboard && perfectQuizScore && sessionClickCount < 450 ? (
              <p>Nothing left on the list.</p>
            ) : null}
          </div>
        ),
      };
    }
    if (activeWindow === 'game') {
      return { title: 'Shell House', body: <EggDoom onWin={() => setShellHouseWon(true)} /> };
    }
    if (activeWindow === 'recovered') {
      return {
        title: 'Recovered Files',
        body: (
          <div className='recovered-folder'>
            <button type='button' onClick={() => setActiveWindow('journal')}>
              <span>TXT</span>JOURNAL.txt
            </button>
            <button type='button' onClick={() => setTerminalOpen(true)}>
              <span>DMG</span>EGG_HUNT.dmg
            </button>
          </div>
        ),
      };
    }
    if (activeWindow === 'journal') {
      return {
        title: 'JOURNAL.txt',
        body: (
          <pre className='journal-file'>{`JOURNAL.txt

This is placeholder journal text. Replace this section when the final journal is ready.

For now, just click on the DMG to finish this. 

Username: Howie20
Password: imissyou,sandra`}</pre>
        ),
      };
    }
    return windowContent[activeWindow];
  };
  const activeContent = activeWindow ? getWindow() : null;

  return (
    <section className='computer-desktop' aria-label='Basement computer'>
      <header className='desktop-menu-bar'>
        <button type='button' className='desktop-apple' aria-label='Apple menu'>
          ●
        </button>
        <strong>Finder</strong>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Go</span>
        <time>{now}</time>
        <button type='button' className='desktop-exit' onClick={onClose}>
          Exit computer
        </button>
      </header>

      <div className='desktop-icons'>
        {availableItems.map((item) => (
          <button
            type='button'
            className='desktop-icon'
            key={item.id}
            onDoubleClick={() => setActiveWindow(item.id)}
            onClick={() => setActiveWindow(item.id)}
          >
            <span aria-hidden='true'>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {activeWindow ? (
        <article
          className={`desktop-window${activeWindow === 'game' ? ' desktop-game-window' : ''}${activeWindow === 'photos' ? ' desktop-photos-window' : ''}`}
        >
          <div className='desktop-window-bar'>
            <button
              type='button'
              aria-label='Close window'
              onClick={() => setActiveWindow(null)}
            />
            <span>{activeContent.title}</span>
          </div>
          <div className='desktop-window-content'>
            {activeContent.body}
          </div>
        </article>
      ) : null}

      {terminalOpen ? (
        <RecoveryTerminal
          onCancel={() => setTerminalOpen(false)}
          onComplete={() => setTheEnd(true)}
        />
      ) : null}
    </section>
  );
}

ComputerDesktop.propTypes = {
  onClose: PropTypes.func.isRequired,
  canPlayShellHouse: PropTypes.bool.isRequired,
  foundKitchenCupboard: PropTypes.bool.isRequired,
  perfectQuizScore: PropTypes.bool.isRequired,
  playerName: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  isCheatRun: PropTypes.bool.isRequired,
  startLeaderboardOpen: PropTypes.bool.isRequired,
  sessionClickCount: PropTypes.number.isRequired,
};