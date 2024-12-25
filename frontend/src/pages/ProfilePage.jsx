import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Profileproblem from "./Profileproblem";
import "./ProfilePage.css";
import { Link } from "react-router-dom";
function ProfilePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const [email,setEmail]=useState(Cookies.get("email"))
  // Fetch user problems from the API
  useEffect(() => {
    const user=Cookies.get("email");
    if(user== null|| user==""){
      navigate("/signin")
    }
    const fetchProblems = async () => {
      try {
        const response = await axios.post(
          "https://connect-aawd.onrender.com/api/problem/getuserproblems",
          { email: Cookies.get("email") }
        );
        setProblems(response.data); // Assuming response.data contains an array of problems
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    fetchProblems();
  }, [problems]);

  const handleProfileImageChange = (e) => {
    setProfileImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleDeleteProblem = async (problemId) => {
    try {
      await axios.post("https://connect-aawd.onrender.com/api/problem/deleteproblem", {
        problemId,
      });
      setProblems((prevProblems) =>
        prevProblems.filter((problem) => problem.problemId !== problemId)
      );
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
          <h2 className="username">{email}</h2>
          
          <label htmlFor="profile-upload" className="upload-button">
            Update
          </label>
          
        </div>
      </div>

      <div className="posts-section">
        <h2>Your Problems</h2>
        <div className="problems-grid">
          <Profileproblem
            problems={problems}
            onDeleteProblem={handleDeleteProblem}
            onEditProblem={handleEditProblem}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
