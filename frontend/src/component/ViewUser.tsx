import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchUsers } from '../../api-call/userService';
import { addUsers } from '../../store/usersSlice';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';

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
  const [sortedUsers, setSortedUsers] = useState<User[]>(users);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        dispatch(addUsers(fetchedUsers));
        setSortedUsers(fetchedUsers); // Set the users in sorted state
        setError(null);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [dispatch]);

  const handleSort = (key: 'name' | 'semester') => {
    const sorted = [...sortedUsers].sort((a, b) => {
      if (key === 'name') {
        return a.name.localeCompare(b.name); // Alphabetical sort
      }
      return a.semester.localeCompare(b.semester); // Semester-wise sort
    });
    setSortedUsers(sorted);
  };


  const exportToPDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.text('AIMS Code Quest 2.0 - Registered Users', 20, 20);
  
    // Add total users
    doc.setFontSize(12);
    doc.text(`Total Users: ${sortedUsers.length}`, 20, 30);
  
    // Table Header
    const headers = ['SN', 'Name', 'Email', 'Semester'];
    const columnWidth = [20, 80, 90, 50]; // Set column width for alignment
    let y = 40;
  
    // Draw table headers
    headers.forEach((header, index) => {
      doc.text(header, 20 + columnWidth.slice(0, index).reduce((a, b) => a + b, 0), y);
    });
  
    // Draw table rows with user data
    y += 10; // Space after headers
    sortedUsers.forEach((user, index) => {
      const rowY = y + index * 10;
      doc.text(`${index + 1}`, 20, rowY);
      doc.text(user.name, 20 + columnWidth[0], rowY);
      doc.text(user.email, 20 + columnWidth[0] + columnWidth[1], rowY);
      doc.text(user.semester, 20 + columnWidth[0] + columnWidth[1] + columnWidth[2], rowY);
    });
  
    // Save PDF
    doc.save('users.pdf');
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Sorting buttons */}
      <div className="text-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => handleSort('name')}
        >
          Sort Alphabetically
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => handleSort('semester')}
        >
          Sort by Semester
        </button>
      </div>

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
                <th className="py-3 px-4 text-left">SN</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Semester</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {sortedUsers.map((user: User, index) => (
                <motion.tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <UserRow user={user} index={index + 1} />
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}

      {/* Export PDF button */}
      <div className="text-center mt-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={exportToPDF}
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}

function UserRow({ user, index }: { user: User, index: number }) {
  return (
    <>
      <td className="py-3 px-4">{index}</td>
      <td className="py-3 px-4">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.semester}</td>
    </>
  );
}
