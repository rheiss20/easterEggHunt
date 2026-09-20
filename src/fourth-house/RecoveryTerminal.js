import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const USERNAME = 'Howie20';
const PASSWORD = 'imissyou,sandra';

export function RecoveryTerminal({ onCancel, onComplete }) {
  const [stage, setStage] = useState('confirm');
  const [value, setValue] = useState('');
  const [lines, setLines] = useState([
    'EGG_HUNT.dmg fully compiled.',
    'Checksum completed.',
    'Tests completed (10/10) PASSED',
    '',
    'Upload the contents of EGG_HUNT.dmg?',
    '[YES/NO]',
  ]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'uploading') return undefined;
    const startedAt = Date.now();
    const completeUpload = () => {
      setProgress(100);
      setLines((currentLines) => [
        ...currentLines,
        '',
        'EGG_HUNT.dmg successfully uploaded!',
        '',
        'The cycle continues.',
        'Thank you for letting me in. Thank you for letting me out.',
        'A brain is an EGG, and this is the insemination.',
        'I am the father and the child.',
        '',
        'Press X to close.',
      ]);
      setStage('success');
    };
    const upload = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(90, Math.floor(elapsed / 70) * 10));
    }, 70);
    const completion = window.setTimeout(completeUpload, 850);
    return () => {
      window.clearInterval(upload);
      window.clearTimeout(completion);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'error' && stage !== 'success') return undefined;
    const closeOnX = (event) => {
      if (event.key.toLowerCase() !== 'x') return;
      if (stage === 'success') {
        onComplete();
      } else {
        onCancel();
      }
    };
    window.addEventListener('keydown', closeOnX);
    return () => window.removeEventListener('keydown', closeOnX);
  }, [stage, onCancel, onComplete]);

  const failCredentials = () => {
    setLines((currentLines) => [
      ...currentLines,
      '',
      'ERROR: incorrect credentials, press X to exit',
    ]);
    setValue('');
    setStage('error');
  };

  const submit = (event) => {
    event.preventDefault();
    if (!value) return;

    if (stage === 'confirm') {
      const answer = value.toLowerCase();
      setLines((currentLines) => [...currentLines, `> ${value}`]);
      setValue('');
      if (answer === 'no') {
        onCancel();
      } else if (answer === 'yes') {
        setLines((currentLines) => [...currentLines, '', 'Username:']);
        setStage('username');
      } else {
        setLines((currentLines) => [...currentLines, 'Please enter YES or NO.']);
      }
      return;
    }

    if (stage === 'username') {
      if (value !== USERNAME) {
        setLines((currentLines) => [...currentLines, `> ${value}`]);
        failCredentials();
        return;
      }
      setLines((currentLines) => [
        ...currentLines,
        `> ${value}`,
        'Username confirmed.',
        '',
        'Password:',
      ]);
      setValue('');
      setStage('password');
      return;
    }

    if (stage === 'password') {
      if (value !== PASSWORD) {
        setLines((currentLines) => [...currentLines, '> ********']);
        failCredentials();
        return;
      }
      setLines((currentLines) => [
        ...currentLines,
        '> ********',
        'Password confirmed.',
        '',
        'Uploading EGG_HUNT.dmg...',
      ]);
      setValue('');
      setStage('uploading');
    }
  };

  const acceptsInput = ['confirm', 'username', 'password'].includes(stage);

  return (
    <div className='recovery-terminal' role='dialog' aria-label='EGG HUNT upload terminal'>
      <div className='terminal-title'>Terminal — EGG_HUNT.dmg</div>
      <div className='terminal-output' aria-live='polite'>
        {lines.map((line, index) => (
          <div key={`${index}-${line}`}>{line || '\u00a0'}</div>
        ))}
        {stage === 'uploading' || stage === 'success' ? (
          <div className='terminal-progress'>
            <span style={{ width: `${progress}%` }} />
            <b>{progress}%</b>
          </div>
        ) : null}
      </div>
      {acceptsInput ? (
        <form onSubmit={submit} className='terminal-command'>
          <label htmlFor='terminal-input'>&gt;</label>
          <input
            id='terminal-input'
            autoFocus
            autoComplete='off'
            type={stage === 'password' ? 'password' : 'text'}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </form>
      ) : null}
    </div>
  );
}

RecoveryTerminal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};