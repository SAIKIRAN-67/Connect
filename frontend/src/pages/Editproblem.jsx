import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./EditProblem.css";
import { storage } from '../firebase.js';
import {ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const EditProblem = () => {
    const [files,setFiles]=useState([]);
  const [formData, setFormData] = useState({
    problemId:"",
    title: "",
    description: "",
    district: "",
    constituency: "",
    mobilenumber:"",
  });

  useEffect(() => {
    const cookieValue = Cookies.get("editProblemDetails");
    if (cookieValue) {
      try {
        const problemDetails = JSON.parse(cookieValue);
        console.log(problemDetails);
        setFormData(problemDetails);
      } catch (error) {
        console.error("Invalid JSON in Cookies:", error);
      }
    } else {
      console.error("No problem details found in Cookies.");
    }
  }, []);

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
    const uploadedFileUrls=await uploadFilesToFirebase(files);
    formData["images"]=uploadedFileUrls;
    console.log("igg:",uploadedFileUrls);
      const response=await axios.post("http://localhost:3000/api/problem/editdetails", formData);
      console.log(response);
      Cookies.remove("editProblemDetails");

    } catch (error) {
      console.error("Error updating problem:", error);
    }
  };

  return (
    <div className="edit-problem-container">
      <h2>Edit Problem</h2>
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
          <input
            type="text"
            id="district"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="constituency">Constituency</label>
          <input
            type="text"
            id="constituency"
            name="constituency"
            value={formData.constituency}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Mobile Number</label>
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
  <label htmlFor="category">Images</label>
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
        </div>
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProblem;
