import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, Users, Clock, Grid, FileText, Settings, Award, ChevronRight 
} from 'lucide-react';
import eventLogo from '../../images/images.png';

const ADMIN_ROUTES = [
  { 
    title: 'Manage CodeQuest', 
    path: '/admin/codequest', 
    icon: Code,
    description: 'Manage Participants',
    bgColor: 'bg-blue-600',
  },
  { 
    title: 'Divide Teams', 
    path: '/admin/divide', 
    icon: Grid,
    description: 'Divide Teams',
    bgColor: 'bg-green-600',
  },
  { 
    title: 'Reveal Teams', 
    path: '/admin/revealteams', 
    icon: Grid,
    description: 'Split Teams',
    bgColor: 'bg-slate-950',
  },
  { 
    title: 'Squad Reveal', 
    path: '/admin/enhancedrevealteams', 
    icon: Grid,
    description: 'Split Teams',
    bgColor: 'bg-gray-950',
  },
  { 
    title: 'Timer Control', 
    path: '/admin/timer', 
    icon: Clock,
    description: 'Timer',
    bgColor: 'bg-purple-600',
  },
  { 
    title: 'Add User', 
    path: '/admin/adduser', 
    icon: Clock,
    description: 'Adding User',
    bgColor: 'bg-slate-950',
  },
  { 
    title: 'View Users', 
    path: '/admin/viewuser', 
    icon: Users,
    description: 'View Participant',
    bgColor: 'bg-indigo-600',
  },
  { 
    title: 'View All Teams', 
    path: '/admin/viewallteams', 
    icon: Grid,
    description: 'View Teams',
    bgColor: 'bg-teal-600',
  },
  { 
    title: 'Manage Teams', 
    path: '/admin/manageteams', 
    icon: Settings,
    description: 'Manage Teams',
    bgColor: 'bg-rose-600',
  },
  { 
    title: 'Judge Criteria', 
    path: '/admin/judgecriteria', 
    icon: FileText,
    description: 'View Marking',
    bgColor: 'bg-amber-600',
  },
  { 
    title: 'Hackathon Judging', 
    path: '/admin/scoretable', 
    icon: Award,
    description: 'Manage Score',
    bgColor: 'bg-cyan-600',
  },
];

const Panel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center"
      >
        <img 
          src={eventLogo} 
          alt="Event Logo" 
          className="w-24 h-24 mb-4 rounded-full shadow-lg"
        />
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Aims Code Quest 2.0
        </h1>
        <p className="text-xl text-gray-400 mt-2">
          Admin Control Center
        </p>
      </motion.div>

      {/* Admin Routes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {ADMIN_ROUTES.map(({ title, path, icon: Icon, description, bgColor }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              type: 'spring', 
              stiffness: 300 
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(path)}
            className={`
              ${bgColor} 
              rounded-2xl p-6 cursor-pointer 
              transform transition-all duration-300 
              hover:shadow-2xl group
              flex flex-col justify-between
              relative overflow-hidden
            `}
          >
            <div className="flex justify-between items-center mb-4">
              <Icon 
                className="text-white opacity-80 group-hover:opacity-100 transition-opacity" 
                size={32} 
              />
              <ChevronRight 
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4" 
                size={24} 
              />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {title}
              </h3>
              <p className="text-sm text-white text-opacity-70">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Panel;