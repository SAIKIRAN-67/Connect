import React, { useEffect } from 'react';
import './Problem.css';
import ImageSlider from './ImageSlider';

function Problem({ title, description, images, district,status, constituency, problemId, onEdit, onDelete }) {
  useEffect(()=>{
    console.log(problemId,images);
  },[]);
  return (
    <div className="problem-container">
      {/* Image Section */}
      <div className="image-container">
        <ImageSlider images={images} />
      </div>

      {/* Details Section */}
      <div className="problem-details">
        <h3 className="problem-title">{title}</h3>
        <p className="problem-description">{description}</p>

        <div className="problem-info">
          <div>
            <span className="info-label">Problem ID:</span>
            <span className="info-value">{problemId}</span>
          </div>
          <div>
            <span className="info-label">District:</span>
            <span className="info-value">{district}</span>
          </div>
          <div>
            <span className="info-label">Constituency:</span>
            <span className="info-value">{constituency}</span>
          </div>
          <div>
            <span className="info-label">Status:</span>
            <span className="info-value">{status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          <button className="edit-button" onClick={() => onEdit(problemId)}>
            Edit
          </button>
          <button className="delete-button" onClick={() => onDelete(problemId)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Problem;
