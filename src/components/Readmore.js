import React, { useState } from "react";
import "./readmore.css";

function ReadMore({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="read-more-container">
      <p className={`text ${isExpanded ? "expanded" : "collapsed"}`}>
        {text || "ไม่มีข้อความ"}
      </p>
      <button onClick={toggleReadMore} className="read-more-button">
        {isExpanded ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"}
      </button>
    </div>
  );
}

export default ReadMore;
