import React, { useState } from 'react';
import axios from 'axios';
import './ProblemDetails.css'; // Import the CSS file for styling

const ProblemDetails = ({ problems }) => {
  const [idFilter, setIdFilter] = useState('');
  const [problemStatus, setProblemStatus] = useState(
    problems.reduce((acc, problem) => {
      acc[problem.problemId] = problem.status; // Initializing status state
      return acc;
    }, {})
  );

  // Function to handle status updates locally
  const updateStatus = (problemId, newStatus) => {
    setProblemStatus((prevStatus) => ({
      ...prevStatus,
      [problemId]: newStatus,
    }));
  };

  // Function to save the updated status to the backend
  const saveStatus = async (problemId) => {
    try {
      const updatedStatus = problemStatus[problemId];
      const response = await axios.post('https://connect-aawd.onrender.com/api/problem/updatestatus', {
        problemId,
        status: updatedStatus,
      });
      alert(`Status for Problem ID ${problemId} saved successfully.`);
      console.log('Response:', response.data);
    } catch (error) {
      alert(`Failed to save status for Problem ID ${problemId}.`);
      console.error('Error:', error);
    }
  };

  // Filter problems based on the ID entered in the search box
  const filteredProblems = idFilter
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
                  className="action-button yellow"
                  onClick={() => updateStatus(problem.problemId, 'Action Taken')}
                >
                  Action Taken
                </button>
                <button
                  className="action-button green"
                  onClick={() => updateStatus(problem.problemId, 'Resolved')}
                >
                  Problem Resolved
                </button>
                <button
                  className="action-button blue"
                  onClick={() => saveStatus(problem.problemId)}
                >
                  Save
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
};

export default ProblemDetails;
