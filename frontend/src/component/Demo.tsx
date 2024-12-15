import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import warnBell from '../../sound/warn-bell.mp3';
import finalBell from '../../sound/final-bell.mp3';
import eventLogo from '../../images/images.png';

interface TimerProps {
  totalTime?: number; // Total time in seconds
  warningTime?: number; // Time for the warning bell
  eventName?: string; // Event title
}

const Timer: React.FC<TimerProps> = ({
  totalTime = 480,
  warningTime = 240,
  eventName = 'Aims Code Quest 2.0',
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(totalTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stage, setStage] = useState<'presentation' | 'demo'>('presentation');
  const [playWarnBell] = useSound(warnBell, { volume: 0.8 });
  const [playFinalBell] = useSound(finalBell, { volume: 0.8 });

  useEffect(() => {
    let timerInterval: any;

    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsRunning(false);
            if (stage === 'presentation') {
              setStage('demo');
              setTimeLeft(totalTime / 2); // Reset timer for demo stage
              setIsRunning(true);
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isRunning, stage, totalTime]);

  useEffect(() => {
    if (timeLeft === warningTime) playWarnBell();
    if (timeLeft === 0) playFinalBell();
  }, [timeLeft, playWarnBell, playFinalBell]);

  const resetTimer = () => {
    setIsRunning(false);
    setStage('presentation');
    setTimeLeft(totalTime);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = (timeLeft / totalTime) * 100;

  return (
    <div
      className="timer-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0d1117',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Event Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}
      >
        <img src={eventLogo} alt="Event Logo" style={{ width: '60px', marginRight: '10px' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{eventName}</h1>
      </motion.div>

      {/* Timer Display */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: '#58a6ff',
        }}
      >
        {formatTime(timeLeft)}
      </motion.div>

      {/* Stage Information */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: '#8b949e',
        }}
      >
        {stage === 'presentation' ? 'Presentation Stage - 4 min' : 'Demo Stage - 4 min'}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        style={{
          width: '80%',
          height: '20px',
          backgroundColor: '#30363d',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          style={{
            height: '100%',
            backgroundColor: stage === 'presentation' ? '#58a6ff' : '#f39c12',
          }}
        />
      </motion.div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isRunning ? '#d9534f' : '#28a745',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          {isRunning ? 'Pause Timer' : 'Start Timer'}
        </button>
        <button
          onClick={resetTimer}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          Reset Timer
        </button>
      </div>

      {/* Instruction Text */}
      <AnimatePresence>
        {!isRunning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '1rem', color: '#8b949e' }}
          >
            Click the button to start your {stage} timer.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timer;
