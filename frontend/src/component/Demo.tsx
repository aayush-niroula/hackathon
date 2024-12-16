import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import { 
  PlayIcon, 
  PauseIcon, 
  RefreshCwIcon, 
  Mic as MicrophoneIcon, 
  Code as CodeIcon, 
  Timer as TimerIcon, 
  Bell as BellIcon,
  Zap
} from 'lucide-react';

// Assuming you'll import these sound files
import warnBell from '../../sound/warn-bell.mp3';
import finalBell from '../../sound/final-bell.mp3';
import eventLogo from '../../images/images.png';

interface TimerProps {
  totalTime?: number;
  warningTime?: number;
  presentationTime?: number;
  eventName?: string;
}

const Timer: React.FC<TimerProps> = ({
  totalTime = 480, // 8 minutes total
  warningTime = 240, // 4 minutes warning
  presentationTime = 240, // 4 minutes for presentation
  eventName = 'Aims Code Quest 2.0 Showdown',
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(totalTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stage, setStage] = useState<'presentation' | 'demo'>('presentation');
  const [playWarnBell] = useSound(warnBell, { volume: 0.8 });
  const [playFinalBell] = useSound(finalBell, { volume: 0.8 });
  const [urgency, setUrgency] = useState<boolean>(false);

  useEffect(() => {
    let timerInterval: any;
  
    if (isRunning) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            setIsRunning(false);
  
            if (stage === 'presentation') {
              // Transition to demo stage
              setStage('demo');
              setTimeLeft(presentationTime); // Set demo time to 4 minutes
              setIsRunning(true);
            } else if (stage === 'demo') {
              // Final bell rings after demo ends
              playFinalBell();
            }
          }
  
          // Warning bell for presentation at the 4-minute mark (totalTime / 2)
          if (stage === 'presentation' && prev === warningTime) {
            playWarnBell();
          }
  
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(timerInterval);
  }, [isRunning, stage, presentationTime, warningTime, playWarnBell, playFinalBell]);
  

  useEffect(() => {
    if (timeLeft === warningTime) playWarnBell();
    if (timeLeft === 0) playFinalBell();
  }, [timeLeft, playWarnBell, playFinalBell]);

  const resetTimer = () => {
    setIsRunning(false);
    setStage('presentation');
    setTimeLeft(totalTime);
    setUrgency(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = stage === 'presentation' 
    ? ((totalTime - timeLeft) / totalTime) * 100 
    : ((totalTime - presentationTime - timeLeft) / totalTime) * 100;

  const stageVariants = {
    presentation: { 
      background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800', 
      progressColor: 'bg-gradient-to-r from-blue-500 to-purple-600',
      textColor: 'text-blue-300',
      icon: <MicrophoneIcon className="w-12 h-12 text-blue-400" />,
      urgentBg: 'bg-red-900/50'
    },
    demo: { 
      background: 'bg-gradient-to-br from-green-900 via-teal-900 to-green-800', 
      progressColor: 'bg-gradient-to-r from-green-500 to-teal-600',
      textColor: 'text-green-300',
      icon: <CodeIcon className="w-12 h-12 text-green-400" />,
      urgentBg: 'bg-yellow-900/50'
    }
  };

  return (
    <div 
      className={`
        min-h-screen flex flex-col items-center justify-center 
        ${stageVariants[stage].background} 
        ${urgency ? stageVariants[stage].urgentBg : ''} 
        transition-all duration-300 ease-in-out
        text-white font-sans overflow-hidden
      `}
    >
      {/* Animated Background Effect */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1, 
          type: 'spring', 
          bounce: 0.3 
        }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="relative z-10 w-full max-w-2xl p-6 text-center"
      >
        {/* Event Logo and Title */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <motion.img 
            src={eventLogo} 
            alt="Event Logo" 
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="w-24 h-24 rounded-full shadow-2xl ring-4 ring-white/20 transform hover:scale-110 transition duration-300"
          />
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {eventName}
          </h1>
        </div>

        {/* Stage Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          {stageVariants[stage].icon}
        </motion.div>

        {/* Timer Display */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`
            text-7xl font-bold mb-6 
            ${stageVariants[stage].textColor} 
            ${urgency ? 'animate-pulse' : ''}
          `}
        >
          {formatTime(timeLeft)}
        </motion.div>

        {/* Stage Information */}
        <div className="flex items-center justify-center mb-6 space-x-2 text-2xl text-gray-300">
          <TimerIcon className="w-6 h-6" />
          <span>{stage === 'presentation' ? 'Presentation Stage' : 'Demo Stage'}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-4 mb-8 overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, type: 'tween' }}
            className={`h-full ${stageVariants[stage].progressColor}`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRunning((prev) => !prev)}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg 
              ${isRunning 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
              } 
              text-white font-bold transition-colors duration-300
            `}
          >
            {isRunning ? <PauseIcon /> : <PlayIcon />}
            <span>{isRunning ? 'Pause Timer' : 'Start Timer'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="
              flex items-center space-x-2 px-6 py-3 
              bg-gray-700 hover:bg-gray-600 
              text-white font-bold rounded-lg 
              transition-colors duration-300
            "
          >
            <RefreshCwIcon />
            <span>Reset Timer</span>
          </motion.button>
        </div>

        {/* Instruction Text */}
        <AnimatePresence>
          {!isRunning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex items-center justify-center space-x-2 text-gray-300"
            >
              <BellIcon className="w-5 h-5" />
              <span>Click the button to start your {stage} timer</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bonus Visual Effect */}
        {urgency && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Zap className="w-24 h-24 text-yellow-500 animate-ping" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Timer;