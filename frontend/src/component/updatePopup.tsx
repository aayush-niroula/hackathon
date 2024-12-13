import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/usersSlice';
import axios from 'axios';

interface User {
   _id: string;
    name: string;
    email: string;
    semester: string;
    role: string;
  }

interface UpdateModalProps {
  user: User;
  onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ user, onClose }) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:8000/api/v1/user/edit/${user._id}`, formData);
      dispatch(updateUser(response.data)); // Update state with the API response
      onClose();
    } catch (err) {
      setError('Failed to update user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Edit User</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Semester</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-3 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
