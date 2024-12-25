import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./EditProblem.css";
import { storage } from '../firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProblem = () => {
  const constituencies={
    'Anantapur':["Rayadurg","Uravakonda","Guntakal","Tadipatri","Singanamala","Anantapur Urban","Kalyandurg","Raptadu"],
    'Sri Sathya Sai':["Madakasira","Hindupur","Penukonda","Puttaparthi","Dharmavaram","Kadiri"],
    'Annamayya':["Thamballapalle","Pileru","Madanapalle","Kodur","Rayachoti","Rajampet"],
    'Srikakulam':["Ichchapuram","Palasa","Tekkali","Pathapatnam","Srikakulam","Amdalavalasa","Etcherla","Narasannapeta"],
    'Vizianagaram':["Rajam","Bobbili","Cheepurupalli","Gajapathinagaram","Nellimarla","Vizianagaram","Srungavarapukota"],
    'Parvathipuram Manyam':["Palakonda","Kurupam","Parvathipuram","Salur"],
    'Visakhapatnam':["Bhimili","	Visakhapatnam East","Visakhapatnam South","Visakhapatnam North","	Visakhapatnam West","Gajuwaka"],
    'Anakapalli':["Chodavaram","Madugula","Anakapalle","Pendurthi","Elamanchili","Payakaraopet"],
    'Kakinada':["Tuni","Prathipadu","Pithapuram","Kakinada Rural","Peddapuram","Jaggampeta","Kakinada City"],
    'Alluri Sitharama Raju':["Araku Valley","Paderu","	Rampachodavaram",""],
    'East Godavari':["Anaparthy","Rajanagaram","Rajahmundry City","Rajahmundry Rural","Kovvur","Nidadavole","Gopalapuram"],
    'Konaseema':["Amalapuram","Razole","Gannavaram","Kothapeta","	Mandapeta"],
    'West Godavari':["Palakollu","Narasapuram","Bhimavaram","Undi","Tanuku","Tadepalligudem"],
    'Eluru':["Unguturu","Denduluru","Eluru","Kaikalur","Chintalapudi","Polavaram","Nuzvid"],
    'Krishna':["Pedana","Machilipatnam","Avanigadda","Pamarru","Gannavaram","Gudivada","Penamaluru"],
    "NTR":["Vijayawada West","Vijayawada Central","Vijayawada East","Mylavaram","Nandigama","Jaggayyapeta"],
    'Palnadu':["Pedakurapadu","Chilakaluripet","Narasaraopet","Sattenapalle","Vinukonda","Gurajala","Macherla"],
    'Prakasam':["Yerragondapalem","Darsi","Markapuram","Giddalur","Kanigiri","Santhanuthalapadu","Ongole"],
    'Nellore':["Kavali",'Atmakur',"Kovur","Nellore City","Nellore Rural","Sarvepalli","Udayagiri","Kandukur"],
    'Tirupati':["Gudur","Sullurpeta","Venkatagiri","Chandragiri","Tirupati","Srikalahasti","Sathyavedu"],
    'Kadapa':["Badvel","Pulivendla","Kamalapuram","Jammalamadugu","Proddatur","Mydukur","Kadapa",""],
    'Nandyal':["Srisailam","Panyam","Nandyal","Banaganapalle","Dhone"],
    'Kurnool':["Kodumur","Yemmiganur","Mantralayam","Adoni","Alur","Kurnool"],
    'Chittoor':["Punganur","Nagari","Gangadhara Nellore","Chittoor","Puthalapattu","Palamaner","Kuppam"]
  }
  const districts = Object.keys(constituencies);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    problemId: "",
    title: "",
    description: "",
    district: "",
    constituency: "",
    mobilenumber: "",
    images: [],
    details:""
  });
  const [responseMessage, setResponseMessage] = useState(""); // To store response message after submission
  const [responseType, setResponseType] = useState(""); // To store message type: 'success' or 'error'
  const navigate = useNavigate(); // Hook for navigation
  const [selectedDistrict,setSelectedDistrict]=useState(formData.district);
  useEffect(() => {
    const fetchData = async () => {
      const cookieValue = Cookies.get("problemId");
      console.log(cookieValue);
      if (cookieValue) {
        try {
          const response = await axios.post("https://connect-aawd.onrender.com/api/problem/getproblem", { problemId: cookieValue });
          const problem = response.data;  // assuming the response contains the problem data
          console.log(problem);
          
          // Set the form data with the fetched problem details
          setFormData({
            problemId: problem.problemId || "",  // Use the correct field names from your backend
            title: problem.title || "",
            description: problem.description || "",
            district: problem.district || "",
            constituency: problem.constituency || "",
            mobilenumber: problem.mobilenumber || "",
            images: problem.images || [],
            details:problem.details  // Assuming images are an array of URLs
          });
        } catch (error) {
          console.error("Invalid JSON in Cookies:", error);
        }
      } else {
        console.error("No problem details found in Cookies.");
      }
    };
    
    fetchData(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run only on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadFilesToFirebase = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `problems/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedFileUrls = await uploadFilesToFirebase(files);
      formData["images"] = uploadedFileUrls;
      console.log("Uploaded Images:", uploadedFileUrls);

      // Send the updated form data to the backend
      const response = await axios.post("https://connect-aawd.onrender.com/api/problem/editdetails", formData);
      console.log(response);

      // If the backend responds with a success message, clear the form and show success
      if (response.data.message) {
        setResponseMessage("Problem updated successfully!");
        setResponseType("success"); // Set the response type to success
        setFormData({ // Clear the form data
          problemId: "",
          title: "",
          description: "",
          district: "",
          constituency: "",
          mobilenumber: "",
          images: [],
          deatils:"",
        });
        Cookies.remove("problemId");
        

        // Redirect to profile page after a brief delay for smooth user experience
        setTimeout(() => {
          navigate("/profile"); // Replace "/profile" with the actual route to the profile page
        }, 2000); // Redirect after 2 seconds
      } else {
        setResponseMessage("Error updating problem.");
        setResponseType("error"); // Set the response type to error
      }
    } catch (error) {
      console.error("Error updating problem:", error);
      setResponseMessage("Error updating problem.");
      setResponseType("error"); // Set the response type to error
    }
  };

  return (
    <div className="edit-problem-container">
      <h2>Edit Problem</h2>
      
      {/* Display response message */}
      {responseMessage && (
        <p className={`response-message ${responseType}`}>
          {responseMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="edit-problem-form">
        {/* Input fields for editing */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
        <label htmlFor="district">District</label>
        <select
          id="district"
          name="district"
          value={formData.district}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>Select a district</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>
              {district}
            </option>
          ))}
        </select>
          {/* <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            required
          /> */}
        </div>
        <div className="form-group">
          <label htmlFor="constituency">Constituency</label>
          <select
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleInputChange}
            required
            
          >
            <option value="" disabled>
              Select a constituency
            </option>
            {formData.district &&
              constituencies[formData.district]?.map((constituency, index) => (
                <option key={index} value={constituency}>
                  {constituency}
                </option>
              ))}
          </select>
          {/* <input
            type="text"
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleInputChange}
            required
          /> */}
        </div>
        <div className="form-group">
          <label htmlFor="mobilenumber">Mobile Number</label>
          <input
            type="number"
            id="mobilenumber"
            name="mobilenumber"
            value={formData.mobilenumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Images</label>
          {formData.images && formData.images.length > 0 ? (
            <img height={100} width={100} src={formData.images[0]} alt="Preview" />
          ) : (
            <p>No image available</p>
          )}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*,video/*"
            onChange={handleFileChange}
            required
            multiple
          />
        </div>
        <div className="form-group">
          <select
            id="details"
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select
            </option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default EditProblem;
