import React from "react";
import "../styles.css";

const Spinner = () => {

  return (
    <div class="spinner-container">
      <div class="spinner-grow text-danger spinner" role="status">
          <span class="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner;