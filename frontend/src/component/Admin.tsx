import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import eventLogo from '../../images/images.png';

const buttonVariants = {
  hover: {
    scale: 1.1,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    transition: { duration: 0.3, yoyo: Infinity },
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}
      >
        <img src={eventLogo} alt="Event Logo" style={{ width: '80px', marginRight: '15px' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Aims Code Quest 2.0 - Admin Panel</h1>
      </motion.div>

      {/* Buttons Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '350px' }}>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={() => handleNavigate('/admin/codequest')}
          style={buttonStyle}
        >
          Manage CodeQuest
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={() => handleNavigate('/admin/divide')}
          style={buttonStyle}
        >
          Divide Teams
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={() => handleNavigate('/admin/timer')}
          style={buttonStyle}
        >
          Timer Control
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={() => handleNavigate('/admin/viewuser')}
          style={buttonStyle}
        >
          View Users
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={() => handleNavigate('/admin/viewallteams')}
          style={buttonStyle}
        >
          View All Teams
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          onClick={() => handleNavigate('/admin/manageteams')}
          style={buttonStyle}
        >
          Manage Teams
        </motion.button>
      </div>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#58a6ff',
  border: 'none',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '1.2rem',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  width: '100%',
};

export default Panel;
