import axios from 'axios';

const API_URL = 'https://aimscodequest.onrender.com/api/v1/user/get'; // Replace with your actual API URL

interface User {
  _id: string;
  name: string;
  email: string;
  semester: 'First' | 'Third';
  role: string;
}

interface ApiResponse {
  user: User[];
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    if (response?.data?.user) {
      return response.data.user;
    } else {
      throw new Error('Invalid data format received from API.');
    }
  } catch (error: any) {
    console.error('Error fetching users:', error.message || error);
    throw new Error('Failed to fetch users. Please try again later.');
  }
}
