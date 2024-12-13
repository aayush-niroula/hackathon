import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  deadline: string; // Expecting a date string
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deadline).getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Initial calculation
    calculateTimeLeft();

    // Set up interval to update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(timer);
  }, [deadline]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  if (isExpired) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-red-100 text-red-700 p-4 rounded-lg mb-6"
      >
        Registration is now closed
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex justify-center space-x-4 mb-6"
    >
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div 
          key={unit}
          variants={itemVariants}
          className="bg-blue-100 p-3 rounded-lg shadow-md w-20 text-center"
        >
          <div className="text-3xl font-bold text-blue-700">
            {value.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-blue-600 uppercase">
            {unit}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CountdownTimer;