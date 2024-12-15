import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Users, Clock, Grid, FileText, Settings, Award} from 'lucide-react';  // Importing icons
import eventLogo from '../../images/images.png';

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
    transition: { duration: 0.3, yoyo: Infinity },
  },
  tap: {
    scale: 0.95,
  },
};

const Panel: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0d1117',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        padding: '0 20px',
      }}
    >
      {/* Event Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <img src={eventLogo} alt="Event Logo" style={{ width: '80px', marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center' }}>
          Aims Code Quest 2.0 - Admin Panel
        </h1>
      </motion.div>

      {/* Buttons Section (Using Cards for Navigation) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        {/* Card for each section */}
        {[
          { title: 'Manage CodeQuest', path: '/admin/codequest', icon: <Code size={24} /> },
          { title: 'Divide Teams', path: '/admin/divide', icon: <Grid size={24} /> },
          { title: 'Timer Control', path: '/admin/timer', icon: <Clock size={24} /> },
          { title: 'View Users', path: '/admin/viewuser', icon: <Users size={24} /> },
          { title: 'View All Teams', path: '/admin/viewallteams', icon: <Grid size={24} /> },
          { title: 'Manage Teams', path: '/admin/manageteams', icon: <Settings size={24} /> },
          { title: 'Judge Criteria', path: '/admin/judgecriteria', icon: <FileText size={24} /> },
          { title: 'Hackathon Judging', path: '/admin/scoretable', icon: <Award size={24} /> },
        ].map(({ title, path, icon }, index) => (
          <motion.div
            key={index}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleNavigate(path)}
            style={cardStyle}
          >
            <div style={iconTextContainerStyle}>
              {icon}
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: '#333', marginLeft: '1rem' }}>
                {title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#58a6ff',
  borderRadius: '12px',
  padding: '2rem',
  cursor: 'pointer',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  minHeight: '120px',
  color: '#ffffff',
  textAlign: 'center',
  flexDirection: 'column',
};

const iconTextContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
};

export default Panel;
