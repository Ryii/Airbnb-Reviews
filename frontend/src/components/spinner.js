import React from "react";
import "../styles.css";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-grow text-danger spinner" role="status">
          <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner;