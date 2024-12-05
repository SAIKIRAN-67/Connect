import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // For styling
import ProblemDetails from './ProblemDetails.jsx'; // Import the ProblemDetails component

const Dashboard = () => {
  const [problems, setProblems] = useState([]); // Holds all problems
  const [filteredProblems, setFilteredProblems] = useState([]); // Holds filtered problems
  const [districtFilter, setDistrictFilter] = useState(''); // For district filtering
  const [idFilter, setIdFilter] = useState(''); // For ID filtering
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Fetch problems data from the API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/problem/getallproblems");
        setProblems(response.data); // Assuming response.data contains an array of problems
        setFilteredProblems(response.data); // Initialize filtered problems with all data
        setLoading(false);
      } catch (err) {
        setError("Failed to load problems. Please try again later.");
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Filter problems based on district or ID whenever relevant states change
  useEffect(() => {
    let filtered = problems;

    if (districtFilter) {
      filtered = filtered.filter((problem) => problem.district === districtFilter);
    }

    if (idFilter) {
      filtered = filtered.filter((problem) => problem.problemId.includes(idFilter)); // Ensure 'problemId' matches
    }

    setFilteredProblems(filtered);
  }, [districtFilter, idFilter, problems]);

  // Calculate district-wise problem count
  const districtProblemCount = problems.reduce((acc, problem) => {
    acc[problem.district] = (acc[problem.district] || 0) + 1;
    return acc;
  }, {});

  // Render loading or error state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard">
      <h1>District Problems Dashboard</h1>

      <div className="filters">
        {/* Dropdown for district filtering */}
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
        >
          <option value="">All Districts</option>
          {Object.keys(districtProblemCount).map((district) => (
            <option key={district} value={district}>
              {district} ({districtProblemCount[district]})
            </option>
          ))}
        </select>

        {/* Input for ID filtering */}
        <input
          type="text"
          placeholder="Search by Problem ID"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
        />
      </div>

      <div className="problem-list">
        <h2>Problem List</h2>
        {filteredProblems.length > 0 ? (
          // Pass filtered problems to the ProblemDetails component
          <ProblemDetails problems={filteredProblems} />
        ) : (
          <p>No problems found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
