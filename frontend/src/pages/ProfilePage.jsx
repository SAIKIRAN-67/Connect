import React, { useState, useEffect } from "react";
import axios from "axios";
import Problem from "../Problem";
import Cookies from "js-cookie";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import ProblemDetails from "./ProblemDetails";
import Profileproblem from "./Profileproblem";
function ProfilePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  // Fetch user problems from the API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/problem/getuserproblems",
          { email: Cookies.get("email") }
        );
        console.log("rese:",response);
        setProblems(response.data); // Assuming response.data contains an array of problems
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, []);

  const handleProfileImageChange = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await axios.post("http://localhost:3000/api/problem/deleteproblem", {
        problemId,
      });
      setProblems(problems.filter((problem) => problem.problemId !== problemId));
      alert("Problem deleted successfully!");
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const handleEditProblem = (problem) => {
    Cookies.set("editProblemDetails", JSON.stringify(problem), { expires: 1 });
    navigate("/edit");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-image-container">
          {profileImage ? (
            <img className="profile-image" src={profileImage} alt="Profile" />
          ) : (
            <img
              className="profile-image"
              src="https://via.placeholder.com/120"
              alt="Placeholder"
            />
          )}
        </div>

        <div>
          <h2 className="username">John Doe</h2>
          <input
            type="file"
            accept="image/*"
            id="profile-upload"
            className="profile-upload-input"
            onChange={handleProfileImageChange}
          />
          <label htmlFor="profile-upload" className="upload-button">
            Update
          </label>
        </div>
      </div>

      <div className="posts-section">
        <h2>Your Problems</h2>
        <div className="problems-grid">
          <Profileproblem problems={problems}/>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
