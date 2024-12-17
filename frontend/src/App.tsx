import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './component/Final';
import AdminPanel from './component/AdminPanel';
// import DivideTeams from './component/Divider';
import Timer from './component/Demo';
import Panel from './component/Admin';
import ViewUsersPanel from './component/ViewUser';
import ViewTeam from './component/AllTeams';
import TeamManagement from './component/Teammanagement';
import Judgecriteria from './component/Judgecriteria';
import HackathonJudgingComponent from './component/Scoretable';
import RevealTeams from './component/FinalDivder';
import DivideTeams from './component/FInalTeamForm';
import AddUser from './component/Adduser';
import EnhancedRevealTeams from './component/EnhancedReveal';
// EnhancedRevealTeams
// DivideTeams
// AddUser

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
        <Route path="/admin/judgecriteria" element={<Judgecriteria/>}/>
        <Route path="/admin/scoretable" element={<HackathonJudgingComponent/>}/>
        <Route path="/admin/revealteams" element={<RevealTeams/>}/>
        <Route path="/admin/enhancedrevealteams" element={<EnhancedRevealTeams/>}/>
        <Route path="/admin/adduser" element={<AddUser/>}/>
      </Routes>
    </Router>
  );
}

export default App;
