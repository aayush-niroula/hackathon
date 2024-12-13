import { motion, AnimatePresence } from 'framer-motion';

interface TeamProps {
teams: string[][];
isShuffling: boolean;
}

const shuffleVariants = {
hidden: { opacity: 0, scale: 0.5, rotate: -45 },
visible: { opacity: 1, scale: 1, rotate: 0 },
};

const TeamsDisplay = ({ teams, isShuffling }: TeamProps) => {
return (
<div className="max-w-4xl mx-auto mt-10">
<h3 className="text-2xl font-bold mb-4 text-center">Generated Teams</h3>

  {isShuffling && (
    <motion.div
      className="text-center mb-6 text-xl font-semibold"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
    >
      Shuffling Teams...
    </motion.div>
  )}

  <AnimatePresence>
    {!isShuffling &&
      teams.map((team, index) => (
        <motion.div
          key={index}
          className="p-4 mb-6 bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-lg shadow-xl"
          variants={shuffleVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        >
          <h4 className="text-xl font-semibold mb-2 text-center">🚀 Team {index + 1}</h4>
          <ul className="list-disc pl-5">
            {team.map((member, idx) => (
              <li key={idx} className="text-lg mb-1">{member}</li>
            ))}
          </ul>
        </motion.div>
      ))}
  </AnimatePresence>
</div>

);
};

export default TeamsDisplay;