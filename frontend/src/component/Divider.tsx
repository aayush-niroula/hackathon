import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import { Shuffle, RefreshCcw, Users, Star, Award } from 'lucide-react';
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

const DivideTeams = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shufflingParticipants, setShufflingParticipants] = useState<Participant[]>([]);

  const teamsRef = useRef<HTMLDivElement>(null);
  const [playShuffle] = useSound('/sound/shuffle.mp3');
  const [playSuccess] = useSound('/sound/success.mp3');

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

  const shuffleTeams = () => {
    playShuffle();
    setIsShuffling(true);
    setShowConfetti(false);

    // Create a copy of participants for shuffling animation
    const shufflingCopy = [...participants];
    setShufflingParticipants(shufflingCopy);

    // Simulate realistic shuffling with multiple stages
    const shufflingStages = [
      { duration: 500, intensity: 0.2 },
      { duration: 800, intensity: 0.4 },
      { duration: 1200, intensity: 0.6 },
      { duration: 1500, intensity: 0.8 }
    ];

    let currentStage = 0;

    const animateShuffling = () => {
      if (currentStage < shufflingStages.length) {
        const stage = shufflingStages[currentStage];
        
        // Shuffle participants with varying intensity
        const shuffledParticipants = shufflingCopy.sort(() => 
          Math.random() < stage.intensity ? -1 : 1
        );
        
        setShufflingParticipants([...shuffledParticipants]);
        
        currentStage++;
        setTimeout(animateShuffling, stage.duration);
      } else {
        // Final team formation
        setTimeout(formFinalTeams, 500);
      }
    };

    // Start the shuffling animation
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

    // Team formation logic (same as before)
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
    playSuccess();
    setShowConfetti(true);
    setIsShuffling(false);
    teamsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const teamStats = useMemo(() => {
    const totalParticipants = participants.length;
    const firstSemesterCount = participants.filter((p) => p.semester === 'First').length;
    const thirdSemesterCount = participants.filter((p) => p.semester === 'Third').length;

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
    <div className="min-h-screen bg-gray-100 text-gray-900 p-10 flex flex-col items-center overflow-hidden">
      {showConfetti && <Confetti recycle={false} />}
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <h1 className="text-5xl font-extrabold mb-8 animate-pulse text-center flex items-center justify-center gap-4 text-indigo-600">
          <Star className="text-yellow-500 w-12 h-12" />
          Hackathon Team Shuffler
          <Award className="text-green-500 w-12 h-12" />
        </h1>

        {/* Participant Overview Section (unchanged) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 bg-white shadow-lg rounded-2xl p-6 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2 text-gray-900">
            <Users className="w-6 h-6" /> Participant Overview
          </h2>
          <div className="flex justify-center gap-8">
            <div className="bg-purple-600 p-4 rounded-xl shadow-lg transition hover:scale-105">
              <p className="text-3xl font-bold">{teamStats.totalParticipants}</p>
              <p className="text-sm">Total Participants</p>
            </div>
            <div className="bg-blue-600 p-4 rounded-xl shadow-lg transition hover:scale-105">
              <p className="text-3xl font-bold">{teamStats.firstSemesterCount}</p>
              <p className="text-sm">First Semester</p>
            </div>
            <div className="bg-green-600 p-4 rounded-xl shadow-lg transition hover:scale-105">
              <p className="text-3xl font-bold">{teamStats.thirdSemesterCount}</p>
              <p className="text-sm">Third Semester</p>
            </div>
          </div>
        </motion.div>

        {/* Shuffle Button (unchanged) */}
        <div className="flex justify-center mb-8">
          <motion.button
            onClick={shuffleTeams}
            disabled={isShuffling}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold 
              ${isShuffling 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'}
              text-white transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-indigo-300
            `}
          >
            {isShuffling ? (
              <>
                <RefreshCcw className="animate-spin" /> Shuffling...
              </>
            ) : (
              <>
                <Shuffle /> Shuffle Teams
              </>
            )}
          </motion.button>
        </div>

        {/* Shuffling Animation */}
        {isShuffling && shufflingParticipants.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8"
          >
            {shufflingParticipants.map((participant, index) => (
              <motion.div
                key={participant._id}
                initial={{ 
                  opacity: 0, 
                  x: Math.random() * 100 - 50, 
                  y: Math.random() * 100 - 50,
                  rotate: Math.random() * 20 - 10
                }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  y: 0,
                  rotate: [
                    Math.random() * 10 - 5, 
                    Math.random() * 10 - 5, 
                    0
                  ]
                }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300
                }}
                className="bg-white shadow-md rounded-lg p-3 text-center"
              >
                <p className="font-semibold">{participant.name}</p>
                <p className="text-sm text-gray-500">{participant.semester}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Display Teams (unchanged) */}
        {teams.length > 0 && (
          <AnimatePresence>
            <motion.div 
              ref={teamsRef}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {teams.map((team) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white shadow-xl rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Team {team.id}
                  </h3>
                  <ul className="space-y-2">
                    {team.members.map((member) => (
                      <li 
                        key={member._id} 
                        className="flex justify-between items-center bg-gray-200 p-2 rounded-lg"
                      >
                        <span>{member.name}</span>
                        <span className="text-sm text-gray-500">{member.semester}</span>
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

export default DivideTeams;