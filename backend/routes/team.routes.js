import { Router } from "express";
import {
  getAllTeams,
  editTeam,
  deleteTeam,
  saveTeams,
} from "../controller/team.controller.js";

const teamRoutes = Router();

// Route to register multiple teams (after shuffling)
teamRoutes.post("/save", saveTeams);

// Route to get all teams
teamRoutes.get("/get", getAllTeams);

// Route to edit a team by ID
teamRoutes.put("/edit/:id", editTeam);

// Route to delete a team by ID
teamRoutes.delete("/delete/:id", deleteTeam);

export default teamRoutes;
