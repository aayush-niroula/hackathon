import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Users2Icon, 
  MailIcon, 
  BookOpenIcon,
  EditIcon,
  Trash2Icon,
  XIcon
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
  name: string;
  members: Member[];
  __v: number;
}

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://aimscodequest.onrender.com/api/v1/team/get');
        setTeams(response.data.teams);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch teams.');
        setLoading(false);
        toast.error('Unable to load teams');
      }
    };
    fetchTeams();
  }, []);

  const handleDelete = async (teamId: string, id: number) => {
    try {
      await axios.delete(`https://aimscodequest.onrender.com/api/v1/team/delete/${teamId}`);
      toast.success('Team deleted successfully');
      setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete the team');
    }
  };

  const handleEdit = (team: Team) => {
    setEditingTeam({ ...team });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditingTeam(null);
    setShowModal(false);
  };

  const handleSaveEdit = async () => {
    if (editingTeam) {
      try {
        const updatedTeam = await axios.put(
          `https://aimscodequest.onrender.com/api/v1/team/edit/${editingTeam._id}`,
          {
            teamId: editingTeam.id,
            name: editingTeam.name,
            members: editingTeam.members,
          }
        );
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === editingTeam.id ? updatedTeam.data.team : team
          )
        );
        toast.success('Team updated successfully');
        setShowModal(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to update the team');
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <svg 
            className="animate-spin h-10 w-10 text-indigo-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-2xl font-semibold text-indigo-600">Loading Teams...</p>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-red-500 text-center"
        >
          {error}
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map((team) => (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-indigo-600 text-center mb-4">
              {team.name || `Team ${team.id}`}
            </h2>
            <div className="space-y-4">
              {team.members.map((member) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 p-4 rounded-lg flex justify-between items-center shadow-sm hover:bg-indigo-50 transition-all duration-300"
                >
                  <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-2">
                      <Users2Icon className="w-5 h-5 text-indigo-600" />
                      <span className="text-lg font-semibold text-gray-800">
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <BookOpenIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-500">{member.semester}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MailIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-indigo-600">{member.email}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEdit(team)}
                className="px-4 py-2 flex items-center text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-300"
              >
                <EditIcon className="w-4 h-4 mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(team._id, team.id)}
                className="px-4 py-2 flex items-center text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
              >
                <Trash2Icon className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-indigo-800 text-center mb-12">
          Team Management
        </h1>
        {renderContent()}

        {/* Edit Modal */}
        {showModal && editingTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative"
            >
              <button 
                onClick={handleModalClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <XIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">
                Edit Team {editingTeam.id}
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) =>
                    setEditingTeam({ ...editingTeam, name: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {editingTeam.members.map((member, index) => (
                  <div key={member._id} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-md font-semibold text-gray-700 mb-3">
                      Member {index + 1}
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => {
                          const updatedMembers = [...editingTeam.members];
                          updatedMembers[index].name = e.target.value;
                          setEditingTeam({ ...editingTeam, members: updatedMembers });
                        }}
                        className="p-2 border border-gray-300 rounded-md w-full"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={member.email}
                        onChange={(e) => {
                          const updatedMembers = [...editingTeam.members];
                          updatedMembers[index].email = e.target.value;
                          setEditingTeam({ ...editingTeam, members: updatedMembers });
                        }}
                        className="p-2 border border-gray-300 rounded-md w-full"
                      />
                      <select
                        value={member.semester}
                        onChange={(e) => {
                          const updatedMembers = [...editingTeam.members];
                          updatedMembers[index].semester = e.target.value;
                          setEditingTeam({ ...editingTeam, members: updatedMembers });
                        }}
                        className="p-2 border border-gray-300 rounded-md w-full"
                      >
                        <option value="First">First</option>
                        <option value="Third">Third</option>
                        <option value="Second">Second</option>
                        <option value="Fourth">Fourth</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamManagement;
