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
  
    // Create a deep copy for animations
    const shufflingCopy = [...participants];
    setShufflingParticipants(shufflingCopy);
  
    // Simulate dynamic shuffling stages
    const shufflingStages = [
      { duration: 600, intensity: 0.7 },
      { duration: 1000, intensity: 0.5 },
      { duration: 1200, intensity: 0.3 },
    ];
  
    let stageIndex = 0;
  
    const animateShuffling = () => {
      if (stageIndex < shufflingStages.length) {
        const stage = shufflingStages[stageIndex];
        
        // Shuffle with stage intensity
        const shuffled = shufflingCopy.sort(() =>
          Math.random() < stage.intensity ? -1 : 1
        );
  
        setShufflingParticipants([...shuffled]);
  
        stageIndex++;
        setTimeout(animateShuffling, stage.duration);
      } else {
        setTimeout(() => finalizeTeams(shufflingCopy), 800);
      }
    };
  
    setTimeout(animateShuffling, 300);
  };
  

  const finalizeTeams = (shufflingCopy: Participant[]) => {
    const shuffleArray = <T,>(array: T[]): T[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const participantsBySemester = shufflingCopy.reduce<{
      First: Participant[];
      Third: Participant[];
    }>(
      (acc, participant) => {
        acc[participant.semester].push(participant);
        return acc;
      },
      { First: [], Third: [] }
    );

    const firstSemester = shuffleArray(participantsBySemester.First);
    const thirdSemester = shuffleArray(participantsBySemester.Third);

    const teams: Team[] = [];
    const remainingParticipants: Participant[] = [];

    // Step 1: Form balanced teams of 4 members (2 First + 2 Third)
    let teamId = 1;
    while (firstSemester.length >= 2 && thirdSemester.length >= 2) {
      teams.push({
        id: teamId++,
        members: [
          firstSemester.pop()!,
          firstSemester.pop()!,
          thirdSemester.pop()!,
          thirdSemester.pop()!,
        ],
      });
    }

    remainingParticipants.push(...firstSemester, ...thirdSemester);

    // Step 2: Form teams of 3 members if possible
    while (remainingParticipants.length >= 3) {
      teams.push({
        id: teamId++,
        members: [
          remainingParticipants.pop()!,
          remainingParticipants.pop()!,
          remainingParticipants.pop()!,
        ],
      });
    }

    // Step 3: Distribute remaining participants to avoid teams of 2
    if (remainingParticipants.length === 2) {
      const participant1 = remainingParticipants.pop()!;
      const participant2 = remainingParticipants.pop()!;
      teams.sort((a, b) => a.members.length - b.members.length);
      teams[0].members.push(participant1);
      teams[1].members.push(participant2);
    } else if (remainingParticipants.length === 1) {
      const participant = remainingParticipants.pop()!;
      teams.sort((a, b) => a.members.length - b.members.length);
      teams[0].members.push(participant);
    }

    // Finalize the state
    setTeams(teams);
    setShufflingParticipants([]);
    playSuccess();
    setShowConfetti(true);
    setIsShuffling(false);

    teamsRef.current?.scrollIntoView({ behavior: "smooth" });
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
    className="relative flex flex-wrap justify-center gap-8 mb-8"
  >
    {Array.from({ length: Math.ceil(shufflingParticipants.length / 4) }).map((_, teamIndex) => {
      const teamMembers = shufflingParticipants.slice(teamIndex * 4, (teamIndex + 1) * 4);
      const teamNumber = teamIndex + 1;

      return (
        <motion.div
          key={teamNumber}
          initial={{
            opacity: 0,
            scale: 0.8,
            rotateY: 0,
            x: Math.random() * 100 - 50, // Slight random horizontal start
            y: Math.random() * 100 - 50, // Slight random vertical start
          }}
          animate={{
            opacity: 1,
            scale: [0.8, 1.1, 1], // Adds a slight scale bounce
            rotateY: [0, 180, 360], // Spins the card for more effect
            x: 0,
            y: 0, // Settles the card into place
          }}
          transition={{
            duration: 1.2,
            delay: teamIndex * 0.3,
            ease: "easeInOut",
          }}
          className="bg-gray-200 rounded-lg p-4 w-72 text-center transform hover:scale-110 transition-transform"
          style={{
            position: "relative",
            zIndex: teamIndex + 1, // Ensure the teams are layered properly
          }}
        >
          {/* Team Label */}
          <div className="text-lg font-bold text-black mb-4">Team {teamNumber}</div>
          
          {/* Team Members */}
          <div className="space-y-4">
            {teamMembers.map((participant, index) => (
              <motion.div
                key={participant._id}
                initial={{
                  opacity: 0,
                  x: Math.random() * 50 - 25, // Random horizontal start for shuffling
                  y: Math.random() * 50 - 25, // Random vertical start for shuffling
                  scale: 0.8, // Slightly scale down for the initial effect
                  rotate: Math.random() * 360, // Random initial rotation
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: [0.8, 1.2, 1], // Slight scale effect during animation
                  rotate: 0, // Settle to no rotation
                }}
                transition={{
                  duration: 0.8,
                  delay: (index + teamIndex * 0.3) * 0.1, // Cascading delay based on team index
                  ease: "easeInOut",
                }}
                className="bg-white text-gray-800 shadow-md rounded-lg p-2"
              >
                <p className="font-semibold">{participant.name}</p>
                <p className="text-sm text-gray-500">{participant.semester}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    })}
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
              {teams.map((team,index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-200 shadow-xl rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
                    Team {index + 1}
                  </h3>
                  <ul className="space-y-2">
                    {team.members.map((member) => (
                      <li 
                        key={member._id} 
                        className="flex justify-between text-gray-800 items-center bg-white shadow-md p-2 rounded-lg"
                      >
                        <span>{member.name}</span>
                        <span className="text-sm text-blue-500">{member.semester}</span>
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