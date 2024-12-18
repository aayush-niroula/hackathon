import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import {
Shuffle, Users, Star, Award, Zap,
Layers, Crosshair, Cpu, Sparkles, BadgeCheck,
Hourglass
} from 'lucide-react';
import { fetchUsers } from '../../api-call/userService.ts';
import axios from 'axios';

type Participant = {
_id: string;
name: string;
email: string;
semester: 'First' | 'Third';
};

type Team = {
id: number;
members: Participant[];
};

const EnhancedRevealTeams = () => {
const [participants, setParticipants] = useState<Participant[]>([]);
const [teams, setTeams] = useState<Team[]>([]);
const [isShuffling, setIsShuffling] = useState(false);
const [showConfetti, setShowConfetti] = useState(false);
const [shufflingParticipants, setShufflingParticipants] = useState<Participant[]>([]);
const [shuffleStage, setShuffleStage] = useState(0);
const [countdown, setCountdown] = useState(10);
const [isCountdownActive, setIsCountdownActive] = useState(false);

const teamsRef = useRef<HTMLDivElement>(null);
const audioRef = useRef<HTMLAudioElement>(null);
const successAudioRef = useRef<HTMLAudioElement>(null);
const countdownAudioRef = useRef<HTMLAudioElement>(null);
const finalAudioRef = useRef<HTMLAudioElement>(null);

// Fetch participants data
useEffect(() => {
const loadUsers = async () => {
try {
const fetchedUsers = await fetchUsers();
setParticipants(fetchedUsers);
} catch (err) {
console.error('Error loading users:', err);
}
};
loadUsers();
}, []);

// Countdown logic
useEffect(() => {
let countdownInterval: NodeJS.Timeout;

if (isCountdownActive && countdown > 0) {
  // Play countdown audio
  playSound(countdownAudioRef);

  countdownInterval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(countdownInterval);
        setIsCountdownActive(false);
        startTeamShuffle();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
}

return () => {
  if (countdownInterval) clearInterval(countdownInterval);
};
}, [isCountdownActive, countdown]);

const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
if (audioRef.current) {
audioRef.current.currentTime = 0;
audioRef.current.play().catch(error => {
console.warn('Audio play failed:', error);
});
}
};

const startCountdown = () => {
setIsShuffling(true);
setIsCountdownActive(true);
setCountdown(10);
};

const startTeamShuffle = () => {
playSound(audioRef);
setShowConfetti(false);
setShuffleStage(0);

const shufflingCopy = [...participants];
setShufflingParticipants(shufflingCopy);

const shufflingStages = [
  { duration: 800, intensity: 0.3, icon: Zap },
  { duration: 1200, intensity: 0.6, icon: Layers },
  { duration: 1600, intensity: 0.8, icon: Crosshair },
  { duration: 2000, intensity: 1, icon: Cpu }
];

let currentStage = 0;

const animateShuffling = () => {
  if (currentStage < shufflingStages.length) {
    const stage = shufflingStages[currentStage];

    const shuffledParticipants = shufflingCopy.sort(() => 
      Math.random() < stage.intensity ? -1 : 1
    );

    setShufflingParticipants([...shuffledParticipants]);
    setShuffleStage(currentStage + 1);

    currentStage++;
    setTimeout(animateShuffling, stage.duration);
  } else {
    setTimeout(formFinalTeams, 500);
  }
};

setTimeout(animateShuffling, 300);
};

const formFinalTeams = () => {
function shuffleArray<T>(array: T[]): T[] {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
return array;
}

// Separate participants by semester
const participantsBySemester = participants.reduce<{
  First: Participant[];
  Third: Participant[];
}>((acc, participant) => {
  acc[participant.semester].push(participant);
  return acc;
}, { First: [], Third: [] });

const firstSemester = shuffleArray(participantsBySemester.First);
const thirdSemester = shuffleArray(participantsBySemester.Third);

const shuffledTeams: Team[] = [];
const remainingParticipants: Participant[] = [];

const totalFirstSemester = firstSemester.length;
const totalThirdSemester = thirdSemester.length;

let maxTeams = Math.min(
  Math.floor(totalFirstSemester / 2), 
  Math.floor(totalThirdSemester / 2)
);

// Create balanced teams of 4 members (2 First, 2 Third per team)
for (let i = 0; i < maxTeams; i++) {
  shuffledTeams.push({
    id: i + 1,
    members: [
      firstSemester.pop()!,
      firstSemester.pop()!,
      thirdSemester.pop()!,
      thirdSemester.pop()!,
    ],
  });
}

remainingParticipants.push(...firstSemester, ...thirdSemester);

// Distribute remaining participants
while (remainingParticipants.length > 0) {
  const participant = remainingParticipants.pop()!;

  const teamWithFewestMembers = shuffledTeams.sort(
    (a, b) => a.members.length - b.members.length
  )[0];

  if (teamWithFewestMembers.members.length < 4) {
    teamWithFewestMembers.members.push(participant);
  } else {
    shuffledTeams.push({
      id: shuffledTeams.length + 1,
      members: [participant],
    });
  }
}

// Reset shuffling state and show final teams
setTeams(shuffledTeams);
setShufflingParticipants([]);

// Play final success sound
playSound(finalAudioRef);

setShowConfetti(true);
setIsShuffling(false);
teamsRef.current?.scrollIntoView({ behavior: 'smooth' });
};

const teamStats = useMemo(() => {
const totalParticipants = participants.length;
const firstSemesterCount = participants.filter((p) => p.semester === 'First').length;
const thirdSemesterCount = participants.filter((p) => p.semester === 'Third').length;

1
return { totalParticipants, firstSemesterCount, thirdSemesterCount };
}, [participants]);

const saveTeams = async () => {
try {
// Prepare the teams data to send in the request
const teamsToSave = teams.map(team => ({
id: team.id,
members: team.members.map(member => ({
name: member.name,
email: member.email,
semester: member.semester
}))
}));

  // Make the Axios request to save the teams
  await axios.post('https://aimscodequest.onrender.com/api/v1/team/save', { teams: teamsToSave });

  // Optionally, show a success message or handle the response
  alert('Teams saved successfully!');
} catch (error) {
  console.error('Error saving teams:', error);
  alert('Failed to save teams');
}
};

return (
<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10 flex flex-col items-center overflow-hidden">
<audio ref={audioRef} src="/sound/shuffle.mp3" />
<audio ref={successAudioRef} src="/sound/success.mp3" />
<audio ref={countdownAudioRef} src="/sound/countdown.mp3" />
<audio ref={finalAudioRef} src="/sound/final-reveal.mp3" />

{showConfetti && <Confetti recycle={false} />}

<motion.div 
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="w-full max-w-6xl"
>
  <h1 className="text-5xl font-extrabold mb-8 animate-pulse text-center flex items-center justify-center gap-4 text-indigo-400">
    <Star className="text-yellow-500 w-12 h-12" />
    Hackathon Team Shuffler
    <Award className="text-green-500 w-12 h-12" />
  </h1>

  {/* Participant Overview Section */}
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
    className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
  >
    <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2 text-white">
      <Users className="w-6 h-6" /> Participant Overview
    </h2>
    <div className="flex justify-center gap-8">
      <div className="bg-purple-600/50 p-4 rounded-xl shadow-lg backdrop-blur-md transition hover:scale-105">
        <p className="text-3xl font-bold">{teamStats.totalParticipants}</p>
        <p className="text-sm">Total Participants</p>
      </div>
      <div className="bg-blue-600/50 p-4 rounded-xl shadow-lg backdrop-blur-md transition hover:scale-105">
        <p className="text-3xl font-bold">{teamStats.firstSemesterCount}</p>
        <p className="text-sm">First Semester</p>
      </div>
      <div className="bg-green-600/50 p-4 rounded-xl shadow-lg backdrop-blur-md transition hover:scale-105">
        <p className="text-3xl font-bold">{teamStats.thirdSemesterCount}</p>
        <p className="text-sm">Third Semester</p>
      </div>
    </div>
  </motion.div>

  {/* Countdown and Shuffle Section */}
  {!isShuffling && !teams.length && (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center space-y-6"
    >
      <motion.button
        onClick={startCountdown}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-2xl font-bold flex items-center gap-3 hover:from-purple-700 hover:to-indigo-700 transition-all"
      >
        <Shuffle className="w-8 h-8" /> Reveal Teams
      </motion.button>
    </motion.div>
  )}

  {/* Countdown Overlay */}
  {isCountdownActive && (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center"
    >
      <motion.div
        key={countdown}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Hourglass className="w-32 h-32 text-white mb-8 animate-pulse" />
        <p className="text-9xl font-extrabold text-indigo-400">{countdown}</p>
        <p className="text-2xl mt-4 text-white">Get Ready for Team Reveal!</p>
      </motion.div>
    </motion.div>
  )}

  {/* Shuffling Animation */}
  {isShuffling && shufflingParticipants.length > 0 && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
    >
      {/* Overlay with Shuffling Stage Indicator */}
      <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
        <motion.div
          key={shuffleStage}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-center flex flex-col items-center"
        >
          {shuffleStage === 1 && <Zap className="w-16 h-16 text-white mb-4 animate-pulse" />}
          {shuffleStage === 2 && <Layers className="w-16 h-16 text-white mb-4 animate-pulse" />}
          {shuffleStage === 3 && <Crosshair className="w-16 h-16 text-white mb-4 animate-pulse" />}
          {shuffleStage === 4 && <Cpu className="w-16 h-16 text-white mb-4 animate-pulse" />}

          <p className="text-2xl font-bold text-white">
            Shuffling Stage {shuffleStage}
          </p>
        </motion.div>
      </div>

      {shufflingParticipants.map((participant, index) => (
        <motion.div
          key={participant._id}
          initial={{ 
            opacity: 0, 
            x: Math.random() * 200 - 100, 
            y: Math.random() * 200 - 100,
            rotate: Math.random() * 360
          }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            y: 0,
            rotate: [
              Math.random() * 20 - 10, 
              Math.random() * 20 - 10, 
              0
            ]
          }}
          transition={{ 
            duration: 0.7,
            delay: index * 0.05,
            type: "spring",
            stiffness: 400
          }}
          className="bg-gray-800 border-2 border-indigo-600 shadow-2xl rounded-xl p-4 text-center transform transition hover:scale-105"
        >
          <div className="mb-2">
            <Star className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <p className="font-bold text-lg text-white">{participant.name}</p>
          </div>
          <p className="text-sm text-indigo-300">{participant.semester} Semester</p>
        </motion.div>
      ))}
    </motion.div>
  )}
{teams.length > 0 && (
<AnimatePresence>
<motion.div
ref={teamsRef}
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: "easeOut" }}
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6"
>
{teams.map((team, index) => (
<motion.div
key={team.id}
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
whileHover={{ scale: 1.05 }}
transition={{ duration: 0.6, delay: index * 0.2 }}
className="relative bg-gradient-to-br from-gray-900 to-gray-700 shadow-2xl rounded-3xl overflow-hidden p-8"
>
<div className="absolute -top-6 -right-6">
<Sparkles className="w-12 h-12 text-yellow-400 animate-bounce" />
</div>

      {/* Team Header */}
      <h3 className="text-3xl font-extrabold mb-6 text-center text-white flex items-center justify-center gap-2">
        <BadgeCheck className="text-green-400 w-8 h-8" /> Team {index+1}
      </h3>

      {/* Members List */}
      <ul className="space-y-4">
        {team.members.map((member, idx) => (
          <li
            key={member._id}
            className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-700"
          >
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold">
              {idx + 1}
            </div>
            <div>
              <p className="text-xl font-bold text-white">{member.name}</p>
              <p className="text-sm text-gray-300">{member.semester} Semester</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  ))}
</motion.div>
</AnimatePresence>
)}


{/* Save Teams Button */}
{teams.length > 0 && (
<div className="mt-8 flex justify-center">
<motion.button
onClick={saveTeams}
whileTap={{ scale: 0.95 }}
whileHover={{ scale: 1.05 }}
className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all duration-300 ease-in-out"
>
Save Teams
</motion.button>
</div>
)}

  </motion.div>
</div>
);
};

export default EnhancedRevealTeams;