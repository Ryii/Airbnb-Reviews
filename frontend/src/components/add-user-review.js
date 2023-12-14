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
          console.log(response.data);
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
            <div>
              <h2></h2>
            </div>
            <div className="form-group">
              <label htmlFor="description"><h4>{ editing ? "Edit" : "Create" } User Review</h4></label>
              <textarea
                className="form-control"
                id="review"
                rows="4"
                cols="50"
                required
                value={userReview}
                onChange={handleInputChange}
                name="review"
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
        <p>User must be logged in to post review.</p>
        <Link to={"/listings/" + id} className="btn btn-danger mr-2">
          Back
        </Link>
        <Link to={"/listings"} className="btn btn-danger">
          All Listings
        </Link>
      </div>
      )}

    </div>
  );
};

export default AddUserReview;