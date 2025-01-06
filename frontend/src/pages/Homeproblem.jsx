import React from 'react'
import ImageSlider from '../ImageSlider';
import "./Homeproblem.css"
const Homeproblem = ({ title, description, images, district, constituency, problemId, onEdit, onDelete,createdAt,village}) => {
    let date=createdAt.substring(0,10);
    return (
        // <div className="problem-container">
        //   <div className='imageholder'>
        //     <img src={images[0]}/>
        //   </div>
        //   <div className="problem-details">
        //     <h3 className="problem-title">{title}</h3>
        //     <p className="problem-description">{description}</p>
    
        //     <div className="problem-info">
        //       <div>
        //         <span className="info-label">District:</span>
        //         <span className="info-value">{district}</span>
        //       </div>
        //       <div>
        //         <span className="info-label">Constituency:</span>
        //         <span className="info-value">{constituency}</span>
        //       </div>
        //       <div>
        //         <span className="info-label">Problem ID:</span>
        //         <span className="info-value">{problemId}</span>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div className="problem-container">
  {/* Left: Image Section */}
  <img src={images[0]} height={300} width={200}/>

  {/* Right: Problem Details Section */}
  <div className="problem-details">
    <h3 className="problem-title">{title}</h3>
    <p className="problem-description">
    {description}
    </p>

    <div className="problem-info">
      <div className="info-item">
        <span className="info-label">Village:</span>
        <span className="info-value">{village?village:""}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Constituency:</span>
        <span className="info-value">{constituency}</span>
      </div>
      <div className="info-item">
        <span className="info-label">District:</span>
        <span className="info-value">{district}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Problem ID:</span>
        <span className="info-value">{problemId}</span>
      </div>
      <div className="info-item">
        <span className="info-label">Created At:</span>
        <span className="info-value">{date?date:""}</span>
      </div>
    </div>
  </div>
</div>
      );
}

export default Homeproblem
