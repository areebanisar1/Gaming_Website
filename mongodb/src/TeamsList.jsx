import React, { useEffect, useState } from "react";
import "./TeamLists.css"; // Import the CSS file
import axios from "axios";
import Mainheader from "./Mainheader";

function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/teams")
      .then((response) => {
        console.log(response.data);
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setError("Error fetching teams");
      });
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="team-list-container">
      <Mainheader />
      <h1>Teams List</h1>
      <div className="team-list">
        {teams.map((team) => (
          <div className="team-card" key={team._id}>
            <h2 className="member-name">{team.fullname}</h2>
            <p className="member-email">{team.email}</p>
            <p className="member-role">{team.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamsList;
