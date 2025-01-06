import React, { useState } from "react";
import "./readmore.css";

const ReadMore = ({ text, dangerouslySetInnerHTML }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="read-more-container">
     <p
        style={{ display: isExpanded ? 'block' : '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
      <button onClick={toggleReadMore} className="read-more-button">
        {isExpanded ? "แสดงน้อยลง" : "อ่านเพิ่มเติม"}
      </button>
    </div>
  );
}

export default ReadMore;
