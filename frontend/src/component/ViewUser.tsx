import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchUsers } from '../../api-call/userService';
import { addUsers } from '../../store/usersSlice';
import { motion } from 'framer-motion'; // Import framer-motion

interface User {
  _id: string;
  name: string;
  email: string;
  semester: 'First' | 'Third';
}

export default function ViewUsersPanel() {
  const dispatch = useDispatch();
  const users = useSelector((store: RootState) => store.user.users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        dispatch(addUsers(fetchedUsers));
        setError(null); // Clear any existing error
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logo and Title Section with Flexbox */}
      <motion.div
        className="flex items-center justify-center mb-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src="/images.png" alt="AIMS Code Quest 2.0 Logo" className="w-32 h-32 object-contain" />
        <motion.h1
          className="text-4xl font-bold text-blue-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          AIMS Code Quest 2.0 - Registered Users
        </motion.h1>
      </motion.div>

      {/* Total Registered Users */}
      <motion.div
        className="text-center mb-4 text-xl font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {users.length > 0 ? (
          <p>Total Registered Users: <span className="font-bold text-blue-600">{users.length}</span></p>
        ) : (
          <p>No users registered yet.</p>
        )}
      </motion.div>

      {loading && <div className="text-center">Loading users...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {!loading && users.length === 0 && !error && (
        <div className="text-center text-gray-500">No registered users found.</div>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white shadow-md rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">SN</th> {/* Serial Number Column */}
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Semester</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {users.map((user: User, index) => (
                <motion.tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <UserRow user={user} index={index + 1} /> {/* Pass Serial Number (index + 1) */}
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
}

function UserRow({ user, index }: { user: User, index: number }) {
  return (
    <>
      <td className="py-3 px-4">{index}</td> {/* Display the Serial Number */}
      <td className="py-3 px-4">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.semester}</td>
    </>
  );
}
