import { Code } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Code className="text-purple-600" size={32} />
        <h1 className="text-2xl font-bold text-gray-800">Aims Code Quest 2.0</h1>
      </div>
      <nav className="space-x-4">
        <a href="#about" className="text-gray-600 hover:text-purple-600">About</a>
        <a href="#prizes" className="text-gray-600 hover:text-purple-600">Prizes</a>
        <a href="#rules" className="text-gray-600 hover:text-purple-600">Rules</a>
      </nav>
    </header>
  );
};

export default Header;