import React, { useState, useEffect } from "react";
import ListingDataService from "../services/listing-data-service";
import { Link, useParams } from "react-router-dom";

const Listing = props => {
  let { id } = useParams();

  const initialListingState = {
    id: null,
    name: "",
    address: {},
    property_type: "",
    userReviews: []
  };
  const [listing, setListing] = useState(initialListingState);

  const getListing = id => {
    ListingDataService.get(id)
      .then(response => {
        console.log(response.data);
        setListing(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getListing(id);
  }, [id]);

  const deleteUserReview = (userReviewId, index) => {
    ListingDataService.deleteUserReview(userReviewId, props.user.id)
      .then(response => {
        setListing((prevState) => {
          prevState.userReviews.splice(index, 1)
          return({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {listing ? (
        <div>
          <h5>{listing.name}</h5>
          <p>
            <strong>Property Type: </strong>{listing.property_type}<br/>
            <strong>Area: </strong>{listing.address.suburb}, {listing.address.street}
          </p>
          <Link to={"/listings/" + id + "/user-review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {listing.userReviews.length > 0 ? (
             listing.userReviews.map((userReview, index) => {
               return (
                 <div className="col-lg-4 pb-1" key={index}>
                   <div className="card">
                     <div className="card-body">
                       <p className="card-text">
                         {userReview.text}<br/>
                         <strong>User: </strong>{userReview.name}<br/>
                         <strong>Date: </strong>{userReview.date}
                       </p>
                       {props.user && props.user.id === userReview.user_id &&
                          <div className="row">
                            <a onClick={() => deleteUserReview(userReview._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                            <Link to={`/listings/` + id + "/user-review"}
                              state= {{
                                currentUserReview: userReview
                              }}
                            className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>                   
                       }
                     </div>
                   </div>
                 </div>
               );
             })
            ) : (
            <div className="col-sm-4">
              <p>No reviews yet.</p>
            </div>
            )}

          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>No listing selected.</p>
        </div>
      )}
    </div>
  );
};

export default Listing;