import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './component/Final';
import AdminPanel from './component/AdminPanel';
import DivideTeams from './component/Divider';
import Timer from './component/Demo';
import Panel from './component/Admin';
import ViewUsersPanel from './component/ViewUser';
import ViewTeam from './component/AllTeams';
import TeamManagement from './component/Teammanagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterForm />} />
        <Route path="/admin/codequest" element={<AdminPanel/>}/>
        <Route path="/admin/divide" element={<DivideTeams/>}/>
        <Route path="/admin/timer" element={<Timer/>}/>
        <Route path="/admin/panel" element={<Panel/>}/>
        <Route path="/admin/viewuser" element={<ViewUsersPanel/>}/>
        <Route path="/admin/viewallteams" element={<ViewTeam/>}/>
        <Route path="/admin/manageteams" element={<TeamManagement/>}/>
      </Routes>
    </Router>
  );
}

export default App;
