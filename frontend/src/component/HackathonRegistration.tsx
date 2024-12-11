import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Users, Code } from 'lucide-react';

const HackathonRegistration = () => {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Event date (adjust as needed)
  const eventDate = new Date('2024-08-15T00:00:00');

  // Registration modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamDetails, setTeamDetails] = useState({
    teamName: '',
    teamLeader: '',
    teamMembers: ['', '', ''],
    projectIdea: ''
  });

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle team details input
  const handleInputChange = (e:any, index = -1) => {
    const { name, value } = e.target;
    
    if (name === 'teamMembers') {
      const newTeamMembers = [...teamDetails.teamMembers];
      newTeamMembers[index] = value;
      setTeamDetails(prev => ({
        ...prev,
        teamMembers: newTeamMembers
      }));
    } else {
      setTeamDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Submit registration
  const handleSubmit = (e:any) => {
    e.preventDefault();
    // TODO: Add actual submission logic
    console.log('Team Registration Details:', teamDetails);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Code className="text-purple-600" size={32} />
          <h1 className="text-2xl font-bold text-gray-800">TechHack 2024</h1>
        </div>
        <nav className="space-x-4">
          <a href="#about" className="text-gray-600 hover:text-purple-600">About</a>
          <a href="#prizes" className="text-gray-600 hover:text-purple-600">Prizes</a>
          <a href="#rules" className="text-gray-600 hover:text-purple-600">Rules</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Hero Content */}
        <div className="space-y-6">
          <h2 className="text-5xl font-extrabold text-gray-900">
            Innovate. Create. Transform.
          </h2>
          <p className="text-xl text-gray-600">
            Join our annual hackathon and turn your wildest tech ideas into reality. 
            Collaborate, innovate, and win amazing prizes!
          </p>

          {/* Countdown */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="text-purple-600" />
              <h3 className="text-xl font-semibold">Event Countdown</h3>
            </div>
            <div className="flex justify-between">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <div className="text-4xl font-bold text-purple-600">{value}</div>
                  <div className="text-sm text-gray-500">{unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold 
            hover:bg-purple-700 transition transform hover:scale-105 flex items-center space-x-2"
          >
            <span>Register Your Team</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Right Side: Illustration */}
        <div className="hidden md:flex justify-center items-center">
          <img 
            src="/api/placeholder/500/500" 
            alt="Hackathon Illustration" 
            className="rounded-xl shadow-2xl"
          />
        </div>
      </main>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center space-x-3">
              <Users className="text-purple-600" />
              <span>Team Registration</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">Team Name</label>
                <input
                  type="text"
                  name="teamName"
                  value={teamDetails.teamName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Team Leader Name</label>
                <input
                  type="text"
                  name="teamLeader"
                  value={teamDetails.teamLeader}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Team Members</label>
                {teamDetails.teamMembers.map((member, index) => (
                  <input
                    key={index}
                    type="text"
                    name="teamMembers"
                    value={member}
                    onChange={(e) => handleInputChange(e, index)}
                    placeholder={`Member ${index + 1} Name`}
                    className="w-full p-3 border rounded-lg mb-2"
                  />
                ))}
              </div>
              <div>
                <label className="block mb-2">Project Idea</label>
                <textarea
                  name="projectIdea"
                  value={teamDetails.projectIdea}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="Briefly describe your project concept"
                  required
                ></textarea>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-grow bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700"
                >
                  Submit Registration
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow bg-gray-200 text-gray-700 p-4 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white py-6 px-6 text-center">
        <p className="text-gray-600">
          © 2024 TechHack Hackathon. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HackathonRegistration;