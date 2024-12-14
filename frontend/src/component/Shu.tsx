import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import { Shuffle, Star, Award, Users } from 'lucide-react';
import { fetchUsers } from '../../api-call/userService.ts';

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

const Teams = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

    setTimeout(() => {
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
      const unassignedParticipants: Participant[] = [];

      // Logic for forming teams
      const formTeams = () => {
        shuffledTeams.length = 0;
        const remainingParticipants: Participant[] = [];

        const totalFirstSemester = firstSemester.length;
        const totalThirdSemester = thirdSemester.length;

        // Step 1: Form teams of 4 members (balanced with 2 First and 2 Third per team)
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

        // Step 2: Distribute remaining participants into teams of 4
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
      };

      formTeams();
      setTeams(shuffledTeams);
      playSuccess();
      setShowConfetti(true);
      setIsShuffling(false);
    }, 2000);
  };

  const teamStats = useMemo(() => {
    const totalParticipants = participants.length;
    const firstSemesterCount = participants.filter((p) => p.semester === 'First').length;
    const thirdSemesterCount = participants.filter((p) => p.semester === 'Third').length;

    return { totalParticipants, firstSemesterCount, thirdSemesterCount };
  }, [participants]);

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
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'}
            `}
          >
            <Shuffle className="w-5 h-5" />
            {isShuffling ? 'Shuffling...' : 'Shuffle Teams'}
          </motion.button>
        </div>

        {/* Shuffling Animation */}
        {isShuffling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              key="shuffleAnimation"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center"
            >
              <Shuffle className="w-8 h-8 text-white animate-spin" />
            </motion.div>
            <p className="text-xl font-semibold text-gray-700">Shuffling...</p>
          </motion.div>
        )}

        {/* Display Teams */}
        {teams.length > 0 && (
          <AnimatePresence>
            <motion.div 
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
                  className="bg-white shadow-lg rounded-2xl p-6"
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
      </motion.div>
    </div>
  );
};

export default Teams;
