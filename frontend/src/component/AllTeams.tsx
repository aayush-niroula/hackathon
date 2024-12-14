import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users2Icon, 
  MailIcon, 
  BookOpenIcon,
  RefreshCwIcon,
  AlertCircleIcon 
} from 'lucide-react';

interface Member {
  _id: string;
  name: string;
  email: string;
  semester: string;
}

interface Team {
  _id: string;
  id: number;
  teamName?: string;
  members: Member[];
  __v: number;
}

const ViewTeam = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://aimscodequest.onrender.com/api/v1/team/get');
        setTeams(response.data.teams);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch teams. Please check your connection.');
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <RefreshCwIcon className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="text-2xl font-semibold text-indigo-600">Loading Teams...</p>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4 text-red-500"
        >
          <AlertCircleIcon className="w-12 h-12" />
          <p className="text-xl">{error}</p>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-4 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {team.teamName || `Team ${team.id}`}
                </h2>
                <p className="text-sm text-indigo-100">
                  Hackathon Team
                </p>
              </div>
              <Users2Icon className="w-8 h-8" />
            </div>

            <div className="p-6 space-y-4">
              {team.members.map((member) => (
                <div 
                  key={member._id}
                  className="bg-indigo-50 rounded-xl p-4 hover:bg-indigo-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img 
                        src="/images.png" 
                        alt="Team Logo" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Users2Icon className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold text-gray-800">{member.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpenIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{member.semester}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MailIcon className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">{member.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center items-center p-8">
      <div className="w-full max-w-7xl">
        <div className="flex items-center justify-center mb-12 space-x-6">
          <img 
            src="/images.png" 
            alt="Code Quest 2.0 Logo" 
            className="w-24 h-24 rounded-full"
          />
          <h1 className="text-5xl font-bold text-indigo-800">
            Code Quest 2.0
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default ViewTeam;