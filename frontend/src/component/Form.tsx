// src/components/RegistrationForm.tsx
import React, { useState } from 'react';

interface Props {
onRegister: (data: { name: string; semester: string }) => void;
}

const RegistrationForm = ({ onRegister }: Props) => {
const [name, setName] = useState('');
const [semester, setSemester] = useState('');

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (name && semester) {
onRegister({ name, semester });
setName('');
setSemester('');
}
};

return (
<form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
<input
type="text"
placeholder="Name"
value={name}
onChange={(e) => setName(e.target.value)}
className="w-full p-2 mb-4 border rounded"
required
/>
<select
value={semester}
onChange={(e) => setSemester(e.target.value)}
className="w-full p-2 mb-4 border rounded"
required
>
<option value="" disabled>Select Semester</option>
<option value="First">First Semester</option>
<option value="Third">Third Semester</option>
</select>
<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
Register
</button>
</form>
);
};

export default RegistrationForm;
