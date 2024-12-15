import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Award, 
  PlusCircle, 
  Trash2, 
  BarChart2, 
  Star 
} from 'lucide-react';
import * as XLSX from 'xlsx';

const HackathonJudgingComponent = () => {
  const [teams, setTeams] = useState([
    { id: 1, teamName: '' }
  ]);

  const criteriaColumns = [
    { 
      key: 'presentation', 
      label: 'Presentation', 
      maxScore: 5,
      description: 'Evaluate the clarity, structure, and effectiveness of the project presentation'
    },
    { 
      key: 'uiux', 
      label: 'UI/UX', 
      maxScore: 5,
      description: 'Assess the user interface design, user experience, and overall aesthetic appeal'
    },
    { 
      key: 'creativity', 
      label: 'Creativity', 
      maxScore: 5,
      description: 'Judge the innovative approach, novel solutions, and unique project concept'
    },
    { 
      key: 'qna', 
      label: 'Q&A', 
      maxScore: 5,
      description: 'Evaluate the team\'s ability to answer questions and demonstrate deep understanding'
    }
  ];

  const addTeam = () => {
    setTeams([
      ...teams, 
      { 
        id: teams.length + 1, 
        teamName: '',
        ...Object.fromEntries(criteriaColumns.map(col => [col.key, 0]))
      }
    ]);
  };

  const removeTeam = (indexToRemove:any) => {
    setTeams(teams.filter((_, index) => index !== indexToRemove));
  };

  const updateTeam = (index:any, field:any, value:any) => {
    const newTeams = [...teams];
    newTeams[index] = { ...newTeams[index], [field]: value };
    setTeams(newTeams);
  };

  const calculateTotalScore = (team:any) => {
    return criteriaColumns.reduce((total, col) => 
      total + (Number(team[col.key]) || 0), 0);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      teams.map(team => ({
        ...team,
        totalScore: calculateTotalScore(team)
      }))
    );
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hackathon Judging');
    
    XLSX.writeFile(workbook, 'hackathon_team_scores.xlsx');
  };

  const teamRankings = useMemo(() => {
    return teams
      .map(team => ({
        ...team,
        totalScore: calculateTotalScore(team)
      }))
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [teams]);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Award className="mr-3 text-yellow-500" />
          Hackathon Judging Dashboard
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={addTeam}
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <PlusCircle className="mr-2" /> Add Team
          </button>
          <button 
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <FileSpreadsheet className="mr-2" /> Export to Excel
          </button>
        </div>
      </div>

      {/* Criteria Explanation Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {criteriaColumns.map((criteria) => (
          <div 
            key={criteria.key} 
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <Star className="mr-3 text-yellow-500" />
              <h2 className="font-semibold text-lg">{criteria.label}</h2>
            </div>
            <p className="text-sm text-gray-600">{criteria.description}</p>
            <div className="mt-2 text-sm font-bold">
              Max Score: {criteria.maxScore}
            </div>
          </div>
        ))}
      </div>

      {/* Judging Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Team Name</th>
              {criteriaColumns.map((col) => (
                <th key={col.key} className="border p-2">
                  {col.label}
                  <span className="block text-xs text-gray-500">
                    (Max {col.maxScore})
                  </span>
                </th>
              ))}
              <th className="border p-2">Total Score</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="border p-2">
                  <input
                    type="text"
                    value={team.teamName}
                    onChange={(e) => updateTeam(index, 'teamName', e.target.value)}
                    className="w-full p-1 border rounded"
                    placeholder="Enter Team Name"
                  />
                </td>
                {criteriaColumns.map((col) => (
                  <td key={col.key} className="border p-2">
                    <input
                      type="number"
                      min="0"
                      max={col.maxScore}
                      value={team[col.key] || 0}
                      onChange={(e) => 
                        updateTeam(
                          index, 
                          col.key, 
                          Math.min(Number(e.target.value), col.maxScore)
                        )
                      }
                      className="w-20 p-1 border rounded text-center"
                    />
                  </td>
                ))}
                <td className="border p-2 font-bold text-center">
                  {calculateTotalScore(team)}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => removeTeam(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded"
                    title="Remove Team"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rankings Section */}
      <div className="bg-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <BarChart2 className="mr-3 text-blue-500" />
          Team Rankings
        </h2>
        <div className="grid gap-4">
          {teamRankings.map((team, index) => (
            <div 
              key={team.id} 
              className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <span className="font-bold mr-3">
                  #{index + 1}
                </span>
                <span className="font-semibold">
                  {team.teamName || 'Unnamed Team'}
                </span>
              </div>
              <div className="text-blue-600 font-bold">
                {team.totalScore} Points
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HackathonJudgingComponent;