import React from 'react'
import axios from 'axios';
import "./Profileproblem.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Profileproblem = ({problems}) => {
  var [filteredProblems,setFilteredProblems]=useState([]);
  const [idFilter, setIdFilter] = useState('');
  const navigate=useNavigate();
  const handleDeleteProblem = async (problemId) => {
    try {
      await axios.post("https://connect-aawd.onrender.com/api/problem/deleteproblem", {
        problemId,
      });
      setFilteredProblems(problems.filter((problem) => problem.problemId !== problemId));
      alert("Problem deleted successfully!");
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const handleEditProblem=async(problemId)=>{
    try {
      Cookies.set('problemId',problemId, { expires: 7 });
      navigate("/edit");
    } catch (error) {
      
    }
  }
  filteredProblems = idFilter
    ? problems.filter((problem) => problem.problemId.includes(idFilter))
    : problems;
  return (
    <div className="problem-details-container">

      {filteredProblems.length > 0 ? (
        <div className="problem-grid">
          {filteredProblems.map((problem, index) => (
            <div key={index} className="problem-card">
              <div className="problem-card-header">
                <h3>{problem.title}</h3>
                <p>
                  <strong>Problem ID:</strong> {problem.problemId}
                </p>
              </div>
              <div className="problem-card-body">
                <p>
                  <strong>Description:</strong> {problem.description}
                </p>
                <p>
                  <strong>District:</strong> {problem.district}
                </p>
                <p>
                  <strong>Constituency:</strong> {problem.constituency}
                </p>
                <p>
                  <strong>Status:</strong> {problem.status}
                </p>
              </div>
              <div className="problem-card-footer">
                <p>
                  <strong>Email:</strong> {problem.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {problem.mobilenumber}
                </p>
                <p>
                  <strong>Visibility:</strong> {problem.problemvisibility}
                </p>
              </div>

              {problem.images && problem.images.length > 0 && (
                <div className="problem-images">
                  <h4>Images:</h4>
                  <div className="image-grid">
                    {problem.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Problem ${index + 1}`}
                        className="problem-image"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="problem-actions">
                
                <button
                  className="action-button green"
                  onClick={() => handleEditProblem(problem.problemId)}
                >
                  Edit
                </button>
                <button
                  className="action-button blue"
                  onClick={() => handleDeleteProblem(problem.problemId)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No problems found with the given ID.</p>
      )}
    </div>
  );
}

export default Profileproblem
