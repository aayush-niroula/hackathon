import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './component/Final';
import AdminPanel from './component/AdminPanel';
import ShuffleTeams from './component/ShuffleTest';
import DivideTeams from './component/Divider';
import Teams from './component/Shu';
function App() {
  return (
    <Router>
      <Routes>
        {/* Define the route for the RegisterForm component */}
        <Route path="/" element={<RegisterForm />} />
        <Route path="/admin/codequest" element={<AdminPanel/>}/>
        <Route path="/admin/codeshuffle" element={<ShuffleTeams/>}/>
        <Route path="/admin/divide" element={<DivideTeams/>}/>
        <Route path="/admin/shuffle" element={<Teams/>}/>
      </Routes>
    </Router>
  );
}

export default App;
