import React, { useState, useEffect } from "react";
import HelpSection from "./HelpSection";
import "./Help.css";
import axios from "axios";
import Cookies from 'js-cookie';
import { useNavigate, useNavigation } from "react-router-dom";
import { Link } from "react-router-dom";
const Help = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ id: "", district: "", category: "" });
  const navigate=useNavigate();
  useEffect(() => {
    const user=Cookies.get("email");
        if(user== null|| user==""){
          navigate("/signin")
        }
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://connect-aawd.onrender.com/api/problem/getallproblems"
        );
        setProblems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load problems. Please try again later.");
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = problems.filter((item) => {
    return (
      (filters.id ? String(item.problemId) === filters.id : true) && // Ensure both are strings
      (filters.district
        ? item.district?.toLowerCase().includes(filters.district.toLowerCase())
        : true) &&
      (filters.category
        ? item.category?.toLowerCase().includes(filters.category.toLowerCase())
        : true)
    );
  });
  
  const handleLogout=()=>{
      Cookies.remove("email");
      navigate("/signin");
    }
  return (
    <div className="help-page">
      {/* <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/help">Help</Link>
        <Link to="/post">Post</Link>
        <Link><span onClick={handleLogout} className="logoutmobile">Logout</span></Link>
      </div> */}
      <h1 className="help-page-title">Filter Page</h1>

      {/* Filters */}
      <div className="filter-section">
        {/* <input
          type="text"
          name="id"
          placeholder="Filter by ID"
          value={filters.id}
          onChange={handleFilterChange}
          className="filter-input"
        /> */}
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select a Category</option>
          <option value="Student">Student</option>
          <option value="Community">Community</option>
          <option value="Personal">Personal</option>
          <option value="Health">Health</option>
          
        </select>
        <select
          name="district"
          value={filters.district}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Select a District</option>
          <option value="Sri Sathya Sai">Sri Sathya Sai</option>
          <option value="Annamayya">Annamayya</option>
          <option value="Anantapur">Anantapur</option>
          <option value="Srikakulam">Srikakulam</option>
          <option value="Vizianagaram">Vizianagaram</option>
          <option value="Parvathipuram Manyam">Parvathipuram Manyam</option>
          <option value="Visakhapatnam">Visakhapatnam</option>
          <option value="Anakapalli">Anakapalli</option>
          <option value="Kakinada">Kakinada</option>
          <option value="Alluri Sitharama Raju">Alluri Sitharama Raju</option>
          <option value="Konaseema">Konaseema</option>
          <option value="West Godavari">West Godavari</option>
          <option value="Eluru">Eluru</option>
          <option value="Krishna">Krishna</option>
          <option value="NTR">NTR</option>
          <option value="Palnadu">Palnadu</option>
          <option value="Prakasam">Prakasam</option>
          <option value="Nellore">Nellore</option>
          <option value="Tirupati">Tirupati</option>
          <option value="Kadapa">Kadapa</option>
          <option value="Nandyal">Nandyal</option>
          <option value="Kurnool">Kurnool</option>
          <option value="Chittoor">Chittoor</option>
        </select>
      </div>

      {/* Help Sections */}
      <div className="help-section-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredData.length > 0 ? (
          filteredData.map((item) => (
            <HelpSection
              key={item.problemId}
              title={item.title}
              id={item.problemId}
              phone={item.mobilenumber}
              category={item.category}
              district={item.district}
              details={item.details?item.details:""}
            />
          ))
        ) : (
          <p>No problems match the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Help;
