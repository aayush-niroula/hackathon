// src/EnhancedShuffle.tsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import shuffleSound from '../../sound/shuffle.mp3';
import successSound from '../../sound/success.mp3';
import { AnimatePresence } from 'framer-motion';

interface Registration {
  name: string;
  semester: string; // Should be either "First" or "Third"
}

const EnhancedShuffle = () => {
    const [registrations] = useState<Registration[]>([

        { name: 'Alice Johnson', semester: 'First' },
    
        { name: 'Bob Smith', semester: 'Third' },
    
        { name: 'Charlie Brown', semester: 'First' },
    
        { name: 'Diana Prince', semester: 'Third' },
    
        { name: 'Ethan Hunt', semester: 'First' },
    
        { name: 'Fiona Gallagher', semester: 'Third' },
    
        { name: 'George Costanza', semester: 'First' },
    
        { name: 'Hannah Baker', semester: 'Third' },
    
        { name: 'Ian Malcolm', semester: 'First' },
    
        { name: 'Jane Doe', semester: 'Third' },
    
        { name: 'Kevin Hart', semester: 'First' },
    
        { name: 'Laura Croft', semester: 'Third' },
    
        { name: 'Michael Scott', semester: 'First' },
    
        { name: 'Nina Simone', semester: 'Third' },
    
        { name: 'Oscar Isaac', semester: 'First' },
    
        { name: 'Paula Patton', semester: 'Third' },
    
        { name: 'Quentin Tarantino', semester: 'First' },
    
        { name: 'Rachel Green', semester: 'Third' },
    
        { name: 'Steve Rogers', semester: 'First' },
    
        { name: 'Tina Fey', semester: 'Third' },
    
        { name: 'Uma Thurman', semester: 'First' },
    
      ]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const teamsRef = useRef<HTMLDivElement>(null);

  const [playShuffle] = useSound(shuffleSound);
  const [playSuccess] = useSound(successSound);

  const shuffleArray = (array: string[]) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const handleShuffle = () => {
    playShuffle();
    setIsShuffling(true);
    setShowConfetti(false);

    setTimeout(() => {
      const firstSem = shuffleArray(
        registrations.filter((r) => r.semester === 'First').map((r) => r.name)
      );
      const thirdSem = shuffleArray(
        registrations.filter((r) => r.semester === 'Third').map((r) => r.name)
      );

      const newTeams: string[][] = [];
      while (firstSem.length >= 2 && thirdSem.length >= 2) {
        newTeams.push([
          firstSem.pop() || '',
          firstSem.pop() || '',
          thirdSem.pop() || '',
          thirdSem.pop() || '',
        ]);
      }

      // Handle remaining members
      const leftovers = [...firstSem, ...thirdSem];
      if (leftovers.length > 0) {
        newTeams.push(leftovers);
      }

      setTeams(newTeams);
      playSuccess();
      setShowConfetti(true);
      setIsShuffling(false);
      teamsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {showConfetti && <Confetti recycle={false} />} 

      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={handleShuffle}
        disabled={registrations.length < 4}
        className="mt-6 bg-blue-500 text-white py-3 px-6 rounded shadow-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Teams
      </motion.button>

      <div ref={teamsRef} className="mt-10">
        <AnimatePresence>
          {isShuffling && (
            <motion.div
              className="text-center text-xl font-bold text-purple-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            >
              Shuffling Teams...
            </motion.div>
          )}

          {!isShuffling &&
            teams.map((team, index) => (
              <motion.div
                key={index}
                className="p-6 mb-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border-l-4 border-blue-500"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <h3 className="text-xl font-bold text-center mb-2">🚀 Team {index + 1}</h3>
                <ul className="list-disc pl-5">
                  {team.map((member, idx) => (
                    <li key={idx} className="text-lg">{member}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedShuffle;
