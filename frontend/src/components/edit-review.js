import React, { useState, useEffect } from "react";
import ListingDataService from "../services/listing-data-service";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles.css'

const ReviewModal = props => {
  let { id } = useParams();
  // let { state } = useLocation();
  let state = props.state;
  let navigate = useNavigate();

  let initialReviewState = props.state.currentUserReview.text;

  // let editing = false;

  const [userReview, setUserReview] = useState('test');
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);

  const checkEdit = () => {
    if (state && state.currentUserReview) {
      console.log(userReview);
    }
  }

  useEffect(() => {
    checkEdit()
  }, [])

  console.log('Editing is now ' + editing);

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

  const clearText = () => {
    setUserReview("");
  }

  const setEdit = () => {
    editing = true;
  }

  return (
    <React.Fragment>
      { props.msg === "Edit" ? 
        <button type="button" className="btn btn-primary col-lg-5 mx-1 mb-1"  data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
          { props.msg } + { editing.toString() }
        </button>
        :
        (!props.user 
          ? 
          <button type="button" className="btn btn-primary shadow-none" data-bs-toggle="modal" data-bs-target="#notLoggedInBackdrop2" style={{boxShadow: "none"}}>
            { props.msg }
          </button> 
          :
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop2" onClick={clearText}>
            { props.msg }
          </button>
        )
      }

      <div>
        <h>{ editing ? "yes" : "no" }</h>
      </div>

      <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{paddingRight: "0px"}}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
              <h4 className="modal-title fs-5" id="staticBackdropLabel2">{ editing.toString() } Post Review</h4>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" style={{lineHeight: "none", fontSize: "xx-large"}}><span aria-hidden="true">&times;</span></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                id="review"
                rows="6"
                cols="60"
                required
                name="review"
                value={userReview}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={saveUserReview}>Submit</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="notLoggedInBackdrop2" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="notLoggedInBackdropLabel" aria-hidden="true" style={{paddingRight: "0px"}}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
            <p className="m-0 p-0">User must be logged in to post review.</p>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" style={{lineHeight: "none", fontSize: "xx-large"}}><span aria-hidden="true">&times;</span></button>
            </div>
            {/* <div class="modal-body m-auto">
            <Link to={"/listings/" + id} className="btn btn-danger mr-2">
              Back
            </Link>
            <Link to={"/listings"} className="btn btn-danger">
              All Listings
            </Link>
            </div> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ReviewModal;