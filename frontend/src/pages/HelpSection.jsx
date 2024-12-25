import React from "react";
import "./HelpSection.css";

const HelpSection = ({ title,id, phone,category,district,details }) => {
  return (
    <div className="help-section-wrapper">
      <h2 className="help-title">{title}</h2>
      <p className="help-detail">
        id: <span className="help-highlight">{id}</span>
      </p>
      <p className="help-detail">
        Phone: <span className="help-highlight">{details=="Yes"?phone:"Not Available"}</span>
      </p>
      <p className="help-detail">
        Category: <span className="help-highlight">{category}</span>
      </p>
      <p className="help-detail">
        District:<span className="help-highlight">{district}</span>
      </p>
    </div>
  );
};

export default HelpSection;
