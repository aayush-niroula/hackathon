import { Group } from "../model/team.model.js";
// Register a new team
const registerTeam = async (req, res) => {
    try {
        const { teamId, members } = req.body;

        if (!teamId || !members || members.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Team ID and members are required",
            });
        }

        const team = new Group({ teamId, members });
        await team.save();

        return res.status(200).json({
            success: true,
            message: "Team registered successfully",
            team,
        });
    } catch (error) {
        console.error(error);

        // Handle duplicate teamId error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate team ID detected. A team with this ID already exists.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            error: error.message,
        });
    }
};

// Get all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await Group.find();

        if (!teams || teams.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No teams found",
            });
        }

        return res.status(200).json({
            success: true,
            teams,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Edit team route (backend)
const editTeam = async (req, res) => {
    try {
      const { id } = req.params; // Team ID from URL
      const { teamId, name, members } = req.body; // Data to update
      console.log(req.body)
      // Validation
      if (!teamId || !name || !members || members.length === 0) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }
  
      // Update the team
      const updatedTeam = await Group.findByIdAndUpdate(id, { teamId, name, members }, { new: true });
  
      if (!updatedTeam) {
        return res.status(404).json({ message: 'Team not found.' });
      }
  
      return res.status(200).json({ message: 'Team updated successfully', team: updatedTeam });
    } catch (err) {
        console.log(err)
      return res.status(500).json({ message: 'Server error' });
    }
  };
  

// Delete a team
const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Team ID is required",
            });
        }

        const team = await Group.findByIdAndDelete(id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Team deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const saveTeams = async (req, res) => {
    try {
      const { teams } = req.body;
  
      // Validate if teams data exists
      if (!teams || teams.length === 0) {
        return res.status(400).json({ message: "No teams data provided" });
      }
  
      // Save each team
      await Group.insertMany(teams);
  
      res.status(200).json({ message: "Teams saved successfully" });
    } catch (error) {
      console.error("Error saving teams:", error);
      res.status(500).json({ message: "Failed to save teams", error: error.message });
    }
  };

export { registerTeam, getAllTeams, editTeam, deleteTeam,saveTeams };
