import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar"; // Navigation Bar
import Problem from "../Problem"; // Problem Component
import "./Home.css"; // External CSS
import {Link} from "react-router-dom"
import Homeproblem from "./Homeproblem";
const constituencies = {
  'Anantapur': ["Rayadurg", "Uravakonda", "Guntakal", "Tadipatri", "Singanamala", "Anantapur Urban", "Kalyandurg", "Raptadu"],
  'Sri Sathya Sai': ["Madakasira", "Hindupur", "Penukonda", "Puttaparthi", "Dharmavaram", "Kadiri"],
  'Annamayya': ["Thamballapalle", "Pileru", "Madanapalle", "Kodur", "Rayachoti", "Rajampet"],
  'Srikakulam': ["Ichchapuram", "Palasa", "Tekkali", "Pathapatnam", "Srikakulam", "Amdalavalasa", "Etcherla", "Narasannapeta"],
  'Vizianagaram': ["Rajam", "Bobbili", "Cheepurupalli", "Gajapathinagaram", "Nellimarla", "Vizianagaram", "Srungavarapukota"],
  'Parvathipuram Manyam': ["Palakonda", "Kurupam", "Parvathipuram", "Salur"],
  'Visakhapatnam': ["Bhimili", "Visakhapatnam East", "Visakhapatnam South", "Visakhapatnam North", "Visakhapatnam West", "Gajuwaka"],
  'Anakapalli': ["Chodavaram", "Madugula", "Anakapalle", "Pendurthi", "Elamanchili", "Payakaraopet"],
  'Kakinada': ["Tuni", "Prathipadu", "Pithapuram", "Kakinada Rural", "Peddapuram", "Jaggampeta", "Kakinada City"],
  'Alluri Sitharama Raju': ["Araku Valley", "Paderu", "Rampachodavaram"],
  'East Godavari': ["Anaparthy", "Rajanagaram", "Rajahmundry City", "Rajahmundry Rural", "Kovvur", "Nidadavole", "Gopalapuram"],
  'Konaseema': ["Amalapuram", "Razole", "Gannavaram", "Kothapeta", "Mandapeta"],
  'West Godavari': ["Palakollu", "Narasapuram", "Bhimavaram", "Undi", "Tanuku", "Tadepalligudem"],
  'Eluru': ["Unguturu", "Denduluru", "Eluru", "Kaikalur", "Chintalapudi", "Polavaram", "Nuzvid"],
  'Krishna': ["Pedana", "Machilipatnam", "Avanigadda", "Pamarru", "Gannavaram", "Gudivada", "Penamaluru"],
  "NTR": ["Vijayawada West", "Vijayawada Central", "Vijayawada East", "Mylavaram", "Nandigama", "Jaggayyapeta"],
  'Palnadu': ["Pedakurapadu", "Chilakaluripet", "Narasaraopet", "Sattenapalle", "Vinukonda", "Gurajala", "Macherla"],
  'Prakasam': ["Yerragondapalem", "Darsi", "Markapuram", "Giddalur", "Kanigiri", "Santhanuthalapadu", "Ongole"],
  'Nellore': ["Kavali", 'Atmakur', "Kovur", "Nellore City", "Nellore Rural", "Sarvepalli", "Udayagiri", "Kandukur"],
  'Tirupati': ["Gudur", "Sullurpeta", "Venkatagiri", "Chandragiri", "Tirupati", "Srikalahasti", "Sathyavedu"],
  'Kadapa': ["Badvel", "Pulivendla", "Kamalapuram", "Jammalamadugu", "Proddatur", "Mydukur", "Kadapa"],
  'Nandyal': ["Srisailam", "Panyam", "Nandyal", "Banaganapalle", "Dhone"],
  'Kurnool': ["Kodumur", "Yemmiganur", "Mantralayam", "Adoni", "Alur", "Kurnool"],
  'Chittoor': ["Punganur", "Nagari", "Gangadhara Nellore", "Chittoor", "Puthalapattu", "Palamaner", "Kuppam"]
};

function Home() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState(Object.keys(constituencies)); // Dynamically set districts from the object
  const [constituencyList, setConstituencies] = useState([]); // List of constituencies that will be filtered
  const [filters, setFilters] = useState({ district: "", constituency: "", searchId: "" });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/problem/getallproblems");
        setProblems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load problems. Please try again later.");
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFilters((prev) => ({ ...prev, district: selectedDistrict, constituency: "" }));
    setConstituencies(constituencies[selectedDistrict] || []);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProblems = problems.filter((problem) => {
    const { district, constituency, searchId } = filters;
    return (
      (!district || problem.district === district) &&
      (!constituency || problem.constituency === constituency) &&
      (!searchId || problem.problemId.includes(searchId))
    );
  });

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/help">Help</Link>
          <Link to="/post">Post</Link>
        </div>
        <div className="filters">
          <select name="district" value={filters.district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <select name="constituency" value={filters.constituency} onChange={handleFilterChange}>
            <option value="">Select Constituency</option>
            {constituencyList.map((constituency) => (
              <option key={constituency} value={constituency}>
                {constituency}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="searchId"
            placeholder="Search by ID"
            value={filters.searchId}
            onChange={handleFilterChange}
          />
        </div>
      </header>
      <div className="problems">
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="problems-grid">
          {filteredProblems.map((problem) => (
            <Homeproblem key={problem.problemId} {...problem} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default Home;
