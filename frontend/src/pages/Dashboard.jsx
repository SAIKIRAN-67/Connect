import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // For styling
import ProblemDetails from './ProblemDetails.jsx'; // Import the ProblemDetails component
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [problems, setProblems] = useState([]); // Holds all problems
  const [filteredProblems, setFilteredProblems] = useState([]); // Holds filtered problems
  const [districtFilter, setDistrictFilter] = useState(''); // For district filtering
  const [idFilter, setIdFilter] = useState(''); // For ID filtering
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state
  const [privacyFilter,setPrivacyFilter]=useState('');
  const user=Cookies.get("email");
  const navigate=useNavigate();
  if(user== null|| user=="" ||user!="saik57908@gmail.com"){
    navigate("/signin")
  }
  const logout=()=>{
    navigate("/signin");
    Cookies.remove("email");
  }
  // Fetch problems data from the API
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("https://connect-aawd.onrender.com/api/problem/getallproblems");
        setProblems(response.data); // Assuming response.data contains an array of problems
        setFilteredProblems(response.data.reverse()); // Initialize filtered problems with all data
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
    if(privacyFilter){
      filtered=filtered.filter((problem)=>problem.problemvisibility==privacyFilter)
    }
    if (idFilter) {
      filtered = filtered.filter((problem) => problem.problemId.includes(idFilter)); // Ensure 'problemId' matches
    }
    filtered.reverse();
    setFilteredProblems(filtered.reverse());
    
  }, [districtFilter, idFilter, problems,privacyFilter

  ]);

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
        <select
          value={privacyFilter}
          onChange={(e) => setPrivacyFilter(e.target.value)}
        >
          <option value="">All Problems</option>
          <option key={"public"} value="public">Public</option>
          <option key={"Higher Officials"} value="Higher Officials">Private</option>
        </select>

        {/* Input for ID filtering */}
        <input
          type="text"
          placeholder="Search by Problem ID"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
        />
        <button onClick={logout} className='out'>Logout</button>
        
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
