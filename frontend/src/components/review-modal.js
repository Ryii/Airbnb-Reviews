import React, { useState } from "react";
import ListingDataService from "../services/listing-data-service";
import { useParams } from "react-router-dom";

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import AlertSymbol from '../images/Alert.jpg'


const ReviewModal = props => {
  let { id } = useParams();
  let state = props.state;

  let initialReviewState = "";
  let editing = false;

  if (state && state.currentUserReview) {
    editing = true;
    initialReviewState = state.currentUserReview.text
  }

  const [userReview, setUserReview] = useState(initialReviewState);

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
          props.getListing(props.id);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      ListingDataService.createUserReview(data)
        .then(response => {
          props.getListing(props.id);
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const clearText = () => {
    if (!editing) {
      setUserReview("");
    }
  }

  return (
    <React.Fragment>
      {!props.user ? 
        <Popup
          trigger={(props.action == "Edit" ? <button className="btn btn-primary col-lg-5 mx-1 mb-1"> Edit </button> : <button type="button" className="btn btn-primary"> Add Review </button>)}
          modal
          contentStyle={{maxWidth: "700px", padding: "0px", borderRadius: "8px"}}
        >
          {close => (
            <div className="modal-reviews px-3 py-2">
              <div className="d-flex align-items-center">
                <img border="0" alt="Not Found" src={AlertSymbol} width="25px" height="25px"/>
                <p className="m-0 pl-2">User must be logged in to post review.</p>
                <button type="button" className="close ml-auto" style={{lineHeight: "none", fontSize: "xx-large", marginBottom: "1px", marginTop: "-1px"}} onClick={close}>&times;</button>
              </div>
            </div>
          )}
        </Popup> 
        : 
        <Popup
          trigger={(props.action == "Edit" ? <button className="btn btn-primary col-lg-5 mx-1 mb-1"> Edit </button> : <button type="button" className="btn btn-primary" onClick={clearText}> Add Review </button>)}
          modal
          closeOnDocumentClick={false}
          contentStyle={{maxWidth: "700px", padding: "0px", borderRadius: "8px"}}
          onOpen={clearText}
        >
          {close => (
            <div className="modal-reviews px-3">
              <div className="modal-header d-flex align-items-center">
                <h4 className="m-0">{ editing ? "Edit" : "Create" } Review</h4>
                <button type="button" className="close ml-auto" style={{lineHeight: "none", fontSize: "xx-large", marginBottom: "1px", marginTop: "-1px"}} onClick={() => {
                    setUserReview(initialReviewState);
                    close();
                  }}>&times;</button>
              </div>
              <div className="modal-content mb-2">
                <textarea
                  className="form-control" 
                  id="review"
                  rows="7"
                  required
                  name="review"
                  value={userReview}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions ml-auto">
                <button className="my-btn mr-2" onClick={() => {
                  setUserReview(initialReviewState);
                  close();
                }}>Cancel</button>
                <button
                  className="btn btn-success"
                  disabled={!userReview}
                  onClick={() => {
                    setUserReview(initialReviewState);
                    saveUserReview();
                    close();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </Popup>
      }
        
    </React.Fragment>
  )
};


// Using Bootstrap 5

const OldReviewModal = props => {
  let { id } = useParams();
  // let { state } = useLocation();
  let state = props.state;

  let initialReviewState = ""

  let editing = false;

  const [userReview, setUserReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  if (state && state.currentUserReview) {
    editing = true;
    initialReviewState = state.currentUserReview.text
  }

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
  
  return (
    <React.Fragment>
      { props.msg === "Edit" ? 
        <button type="button" className="btn btn-primary col-lg-5 mx-1 mb-1"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          { props.msg } + { editing.toString() }
        </button>
        :
        (!props.user 
          ? 
          <button type="button" className="btn btn-primary shadow-none" data-bs-toggle="modal" data-bs-target="#notLoggedInBackdrop" style={{boxShadow: "none"}}>
            { props.msg }
          </button> 
          :
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={clearText}>
            { props.msg }
          </button>
        )
      }

      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" style={{paddingRight: "0px"}}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center">
              <h4 className="modal-title fs-5" id="staticBackdropLabel"> Post Review</h4>
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

      <div className="modal fade" id="notLoggedInBackdrop" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="notLoggedInBackdropLabel" aria-hidden="true" style={{paddingRight: "0px"}}>
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