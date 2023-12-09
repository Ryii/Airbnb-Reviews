import React, { useState } from "react";
import ListingDataService from "../services/listing-data-service";
import { Link, useLocation, useParams } from "react-router-dom";

const AddUserReview = props => {

  let { id } = useParams();
  let { state } = useLocation();

  let initialUserReviewState = ""

  let editing = false;

  if (state && state.currentUserReview) {
    editing = true;
    initialUserReviewState = state.currentUserReview.text
  }

  const [userReview, setUserReview] = useState(initialUserReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    setUserReview(event.target.value);
  };

  const saveUserReview = () => {
    var data = {
      text: userReview,
      name: props.user.name,
      user_id: props.user.id,
      listing_id: id
    };

    if (editing) {
      data.userReview_id = state.currentUserReview._id
      ListingDataService.updateUserReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      ListingDataService.createUserReview(data)
        .then(response => {
          setSubmitted(true);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {props.user ? (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <Link to={"/listings/" + id} className="btn btn-success">
              Back to Listing
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="description">{ editing ? "Edit" : "Create" } User Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={userReview}
                onChange={handleInputChange}
                name="text"
              />
            </div>
            <button onClick={saveUserReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};

export default AddUserReview;