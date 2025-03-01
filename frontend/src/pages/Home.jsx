import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar"; // Navigation Bar
import Problem from "../Problem"; // Problem Component
import "./Home.css"; // External CSS
import {Link, useNavigate} from "react-router-dom"
import Homeproblem from "./Homeproblem";
import Cookies from 'js-cookie';
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
  const [filters, setFilters] = useState({ district: "", constituency: "", searchId: "",startDate:"" ,village:""});
  const navigate=useNavigate();
  const togglePanel = () => {
    setShowPanel(!showPanel); // Toggle visibility
  };
  useEffect(() => {
    const user=Cookies.get("email");
    if(user=="saik57908@gmail.com"){
      navigate("/dashboard");
    }
    if(user== null|| user==""){
      navigate("/signin")
    }
    const fetchProblems = async () => {
      try {
        const response = await axios.get("https://connect-aawd.onrender.com/api/problem/getallproblems");
        let filres=[];
        response.data.map((eachitem)=>{
          if(eachitem.problemvisibility=="public"){
            filres.push(eachitem);
          }
        });
        setProblems(filres);
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
  function openNav() {
    document.getElementById("sideMenu")
      .style.width = "300px";
    document.getElementById("contentArea")
      .style.marginLeft = "300px";
  }
  
  function closeNav() {
    document.getElementById("sideMenu")
      .style.width = "0";
    document.getElementById("contentArea")
      .style.marginLeft = "0";
  }
  
  function showContent(content) {
    document.getElementById("contentTitle")
      .textContent = content + " page";
      
    closeNav();
  }
  // const filteredProblems = problems.filter((problem) => {
  //   const { district, constituency, searchId,title,startDate} = filters;
  //   const problemDate = new Date(problem.createdAt);
  //   console.log("problem:",problemDate);
  //   console.log(startDate);
  //   const isInDateRange = (!startDate || problemDate == new Date(startDate))
  //   return (
  //     (!district || problem.district === district) &&
  //     (!constituency || problem.constituency === constituency) &&
  //     (!title || problem.title.includes(title))&&
  //     isInDateRange
  //   );
  // });
  const filteredProblems = problems.filter((problem) => {
    const { district, constituency, title, startDate, endDate,village } = filters;
    
    // Create Date objects for the problem's created date and the filter start date
    const problemDate = new Date(problem.createdAt);
    
    // Normalize both dates to 'YYYY-MM-DD' to remove time component for comparison
    const normalizedProblemDate = problemDate.toISOString().split('T')[0];  // "YYYY-MM-DD"
    const normalizedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : null;
    
    console.log("Problem Date:", normalizedProblemDate);
    console.log("Start Date:", normalizedStartDate);
    
    // Check if the problem's date is within the selected start date
    const isInDateRange = !normalizedStartDate || normalizedProblemDate == normalizedStartDate;
  
    return (
      (!district || problem.district === district) &&
      (!constituency || problem.constituency === constituency) &&
      (!title || problem.title.toLowerCase().includes(title.toLowerCase())) &&
      isInDateRange &&
      (!village || (problem.village ? problem.village.toLowerCase().includes(village.toLowerCase()) : ""))
    );
  });
  filteredProblems.reverse();
  const handleLogout=()=>{
    navigate("/signin");
    Cookies.remove("email");
  }
  return (
    <div className="home-container">
      <div id="sideMenu" className="sideMenu">
        <a className="close" onClick={closeNav}>X</a>
        <div className="filters" id="filters1">
            <select className="district1" name="district" value={filters.district} onChange={handleDistrictChange}>
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <select className="constituency1" name="constituency" value={filters.constituency} onChange={handleFilterChange}>
              <option value="">Select Constituency</option>
              {constituencyList.map((constituency) => (
                <option key={constituency} value={constituency}>
                  {constituency}
                </option>
              ))}
            </select>
            <input
              className="village1"
              name="village"
              type="text"
              placeholder="    Search by Village"
              value={filters.village}
              onChange={handleFilterChange}
            />
            <input
              className="tit1"
              type="text"
              name="title"
              placeholder="    Search by title"
              value={filters.title}
              onChange={handleFilterChange}
            />
            <input
              className="date1"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              placeholder="Start Date"
            />
        </div>
      </div>
      <header className="home-header">
        <div className="nav-links">
          <span onClick={openNav}><img  className="search" height={20} width={20} src="https://cdn-icons-png.flaticon.com/128/18598/18598801.png"/></span>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/help">Filter</Link>
          <Link to="/post">Post</Link>
          <Link onClick={()=>{window.location.replace("https://sritridevtechnologiespvt.netlify.app/");}}>Portfolio</Link>
          <Link><span onClick={handleLogout} className="logoutmobile">Logout</span></Link>
        </div>
        <div className="filters">
          <select className="district" name="district" value={filters.district} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <select className="constituency" name="constituency" value={filters.constituency} onChange={handleFilterChange}>
            <option value="">Select Constituency</option>
            {constituencyList.map((constituency) => (
              <option key={constituency} value={constituency}>
                {constituency}
              </option>
            ))}
          </select>
          <input
            className="village"
            name="village"
            type="text"
            placeholder="Search by Village"
            value={filters.village}
            onChange={handleFilterChange}

          />
          <input
            className="tit"
            type="text"
            name="title"
            placeholder="Search by title"
            value={filters.title}
            onChange={handleFilterChange}
          />
          <input
            className="date"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder="Start Date"
          />
        </div>
        <div>
          <span onClick={handleLogout} className="logout">Logout</span>
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

