import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import useSound from 'use-sound';
import {participants} from "../../team.ts";
import { Shuffle, RefreshCcw, Users, Star, Award } from 'lucide-react';

type Participant = {
  id: string;
  name: string;
  email: string;
  semester: 'First' | 'Third';
};

type Team = {
  id: number;
  members: Participant[];
};

const ShuffleTeams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const teamsRef = useRef<HTMLDivElement>(null);
  
    const [playShuffle] = useSound('/sound/shuffle.mp3');
    const [playSuccess] = useSound('/sound/success.mp3');
  
    const shuffleTeams = () => {
      playShuffle();
      setIsShuffling(true);
      setShowConfetti(false);
  
      setTimeout(() => {
        // Shuffle helper function
        function shuffleArray<T>(array: T[]): T[] {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }
  
        // Separate and shuffle participants by semester
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
  
        // Intelligent team formation
        const formTeams = () => {
          // Reset arrays
          shuffledTeams.length = 0;
          unassignedParticipants.length = 0;
  
          // Determine optimal team formation
          const totalFirstSemester = firstSemester.length;
          const totalThirdSemester = thirdSemester.length;
  
          // Calculate maximum possible teams with 4 members
          const maxTeams = Math.min(
            Math.floor(totalFirstSemester / 2),
            Math.floor(totalThirdSemester / 2)
          );
  
          // Team formation strategy
          for (let i = 0; i < maxTeams; i++) {
            // Ensure we have enough participants
            if (firstSemester.length >= 2 && thirdSemester.length >= 2) {
              const teamMembers: Participant[] = [
                firstSemester.pop()!,
                firstSemester.pop()!,
                thirdSemester.pop()!,
                thirdSemester.pop()!
              ];
  
              shuffledTeams.push({
                id: i + 1,
                members: teamMembers
              });
            }
          }
  
          // Handle remaining participants
          unassignedParticipants.push(
            ...firstSemester,
            ...thirdSemester
          );
  
          // Intelligent redistribution of remaining participants
          const redistributeRemainingMembers = () => {
            // Sort teams by current member count (ascending)
            shuffledTeams.sort((a, b) => a.members.length - b.members.length);
  
            // Redistribute until no more can be added or no more unassigned members
            while (unassignedParticipants.length > 0) {
              const teamWithFewestMembers = shuffledTeams[0];
  
              // Only add if team won't exceed 5 members
              if (teamWithFewestMembers.members.length < 5) {
                const memberToAdd = unassignedParticipants.shift()!;
                teamWithFewestMembers.members.push(memberToAdd);
  
                // Re-sort teams
                shuffledTeams.sort((a, b) => a.members.length - b.members.length);
              } else {
                // If no teams can accept more members, break
                break;
              }
            }
          };
  
          redistributeRemainingMembers();
        };
        formTeams();
        setTeams(shuffledTeams);
        playSuccess();
        setShowConfetti(true);
        setIsShuffling(false);
        teamsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 2000);
    };
  
    const teamStats = useMemo(() => {
      const totalParticipants = participants.length;
      const firstSemesterCount = participants.filter((p) => p.semester === 'First').length;
      const thirdSemesterCount = participants.filter((p) => p.semester === 'Third').length;
  
      return { totalParticipants, firstSemesterCount, thirdSemesterCount };
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10 flex flex-col items-center overflow-hidden">
      {showConfetti && <Confetti recycle={false} />}
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <h1 className="text-5xl font-extrabold mb-8 animate-pulse text-center flex items-center justify-center gap-4">
          <Star className="text-yellow-400 w-12 h-12" />
          Hackathon Team Shuffler
          <Award className="text-green-400 w-12 h-12" />
        </h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center justify-center gap-2">
            <Users className="w-6 h-6" /> Participant Overview
          </h2>
          <div className="flex justify-center gap-8">
            <div className="bg-purple-600/50 p-4 rounded-xl shadow-lg transition hover:scale-105">
              <p className="text-3xl font-bold">{teamStats.totalParticipants}</p>
              <p className="text-sm">Total Participants</p>
            </div>
            <div className="bg-blue-600/50 p-4 rounded-xl shadow-lg transition hover:scale-105">
              <p className="text-3xl font-bold">{teamStats.firstSemesterCount}</p>
              <p className="text-sm">First Semester</p>
            </div>
            <div className="bg-green-600/50 p-4 rounded-xl shadow-lg transition hover:scale-105">
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
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}
              text-white transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-4 focus:ring-purple-300
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
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl"
                >
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Team {team.id}
                  </h3>
                  <ul className="space-y-2">
                    {team.members.map((member) => (
                      <li 
                        key={member.id} 
                        className="flex justify-between items-center bg-gray-800/50 p-2 rounded-lg"
                      >
                        <span>{member.name}</span>
                        <span className="text-sm text-gray-400">{member.semester}</span>
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

export default ShuffleTeams;
