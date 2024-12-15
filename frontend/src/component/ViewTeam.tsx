import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// Define interfaces for strict typing
interface Member {
  _id: string;
  name: string;
  email: string;
  semester: string;
}

interface Team {
  _id: string;
  id: number;
  teamName: string;
  members: Member[];
  __v: number;
}

const TeamCard = () => {
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
      }
    };
    fetchTeams();
  }, []);

  // Delete function for a specific team
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

  // Open the modal for editing
  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setShowModal(true);
  };

  // Close the modal
  const handleModalClose = () => {
    setEditingTeam(null);
    setShowModal(false);
  };

  // Handle save of edits (update team and members)
  const handleSaveEdit = async () => {
    if (editingTeam) {
      try {
        const updatedTeam = await axios.put(
          `https://aimscodequest.onrender.com/api/v1/team/edit/${editingTeam._id}`,
          {
            teamId: editingTeam.id,
            name: editingTeam.teamName,
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

  return (
    <div className="p-8 min-h-screen bg-gray-100 flex justify-center items-center">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl font-semibold text-indigo-600"
        >
          Loading Teams...
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl text-red-500"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && teams.length > 0 && (
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
                Team {team.id}
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
                      <span className="text-lg font-semibold text-gray-800">
                        {member.name}
                      </span>
                      <span className="text-sm text-gray-500">{member.semester}</span>
                    </div>
                    <span className="text-sm text-indigo-600">{member.email}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(team)}
                  className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team._id, team.id)}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingTeam && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Edit Team {editingTeam.id}</h2>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600">Team Name</label>
              <input
                type="text"
                value={editingTeam.teamName}
                onChange={(e) =>
                  setEditingTeam({ ...editingTeam, teamName: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-md w-full mt-2"
              />
            </div>

            <div className="space-y-4">
              {editingTeam.members.map((member, index) => (
                <div key={member._id} className="flex flex-col mb-4">
                  <label className="text-sm font-semibold text-gray-600">Member {index + 1}</label>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => {
                      const updatedMembers = [...editingTeam.members];
                      updatedMembers[index].name = e.target.value;
                      setEditingTeam({ ...editingTeam, members: updatedMembers });
                    }}
                    className="p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={member.email}
                    onChange={(e) => {
                      const updatedMembers = [...editingTeam.members];
                      updatedMembers[index].email = e.target.value;
                      setEditingTeam({ ...editingTeam, members: updatedMembers });
                    }}
                    className="p-2 mt-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={member.semester}
                    onChange={(e) => {
                      const updatedMembers = [...editingTeam.members];
                      updatedMembers[index].semester = e.target.value;
                      setEditingTeam({ ...editingTeam, members: updatedMembers });
                    }}
                    className="p-2 mt-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCard;
