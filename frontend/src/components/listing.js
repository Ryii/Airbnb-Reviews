import React, { useState, useEffect } from "react";
import ListingDataService from "../services/listing-data-service";
import { useParams } from "react-router-dom";
import Spinner from "./spinner";
import ReviewModal from "./review-modal";

const Listing = props => {
  let { id } = useParams();

  const initialListingState = {
    id: null,
    name: "",
    address: {},
    property_type: "",
    userReviews: [],
    price: {$numberDecimal: 0},
    images: {},
    description: ""
  };

  const months = {1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"May", 6:"Jun", 7:"Jul", 8:"Aug", 9:"Sep", 10:"Oct", 11:"Nov", 12:"Dec"}
  const currencies = {"Australia":"AUD", "Brazil":"BRL", "Canada":"CAD", "China":"RMB", "Hong Kong":"HKD",
                      "Portugal": "EUR", "Spain": "EUR", "Turkey": "TRY", "United States": "USD"}
  const symbols = {"Australia":"$", "Brazil":"$", "Canada":"$", "China":"¥", "Hong Kong":"$",
                      "Portugal": "€", "Spain": "€", "Turkey": "₺", "United States": "$"}

  const [listing, setListing] = useState(initialListingState);
  const [readMore, setReadMore] = useState(false);

  const getListing = id => {
    ListingDataService.get(id)
      .then(response => {
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

  const limitCharacters = (str, limit = 320) => {
    return str.length > limit ? `${str.slice(0, limit)}... ` : str;
  }

  const toggleShow = () => {
    if (readMore) {setReadMore(false)}
    else {setReadMore(true)};
  }

  return (
    <div>
      {listing ? (
        <div>
          {listing.name === "" ? 
            <Spinner /> : 
            <div>
              <div className="d-flex">
                <div className="pt-1">
                  <img src={listing.images.picture_url} alt="&nbsp;(No Preview)" width="250" height="250" style={{borderRadius: "3%"}}></img>
                </div>
                <div className="pl-4">
                  <h4 className="mt-2">{listing.name}</h4>
                  <h5 className="mt-3 text-danger">{symbols[listing.address.country]}{parseInt(listing.price.$numberDecimal)} {currencies[listing.address.country]}/night</h5>
                  <p className="mt-3">
                    <strong>Area: </strong>{listing.address.suburb}, {listing.address.street}<br/>
                    <strong>Property Type: </strong>{listing.property_type}
                  </p>
                  <hr style={{borderWidth: "2px", marginTop: "18px", marginBottom: "18px"}}></hr>
                  <p className="mt-2 mb-2">
                    {readMore 
                      ? listing.description.split('.').slice(0, listing.description.split('.').length - 1).join('.') + ". "
                      : limitCharacters(listing.description)
                    }
                    {listing.description.length > 320 && readMore ? <span className="read-more" onClick={toggleShow}>Read Less</span> : "" }
                    {listing.description.length > 320 && !readMore ? <span className="read-more" onClick={toggleShow}>Read More</span> : "" }
                  </p>
                </div>
              </div>

              <hr style={{borderWidth: "2px", marginTop: "16px"}}></hr>

              <div className="d-flex mt-2 mb-3 align-items-center">
                <h4 className="m-0 pr-4"> Reviews </h4>
                {/* <Link to={"/listings/" + id + "/user-review"} className="btn btn-primary  ml-auto">
                  Add Review
                </Link> */}
                <div className="ml-auto">
                  <ReviewModal user={props.user} action="Add Review" getListing={getListing} id={id} />
                </div>
              </div>

              <div className="row">
                {listing.userReviews.length > 0 ? (
                listing.userReviews.map((userReview, index) => {
                  return (
                    <div className="col-lg-4 pb-1" key={index}>
                      <div className="card">
                        <div className="card-body" style={{padding: "12px"}}>
                          <p className="card-text">
                            "{userReview.text}"<br/>
                          </p>
                          <hr></hr>
                          <p className="card-text">
                            <strong>User: </strong>{userReview.name}<br/>
                            <strong>Date Posted: </strong>
                            {/* {months[userReview.date.split('-')[1]]} {userReview.date.split('T')[0].split('-')[2]}, {userReview.date.split('-')[0]} */}
                            {userReview.date.split(" ")[1]+" "+userReview.date.split(" ")[2] + ", " + userReview.date.split(" ")[3]}
                          </p>
                          {props.user && props.user.id === userReview.user_id &&
                              <div className="row d-flex justify-content-center">
                                {/* <Link to={`/listings/` + id + "/user-review"}
                                  state= {{
                                    currentUserReview: userReview
                                  }}
                                className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link> */}
                                <ReviewModal
                                  user={props.user}
                                  action="Edit"
                                  state= {{ currentUserReview: userReview }}
                                  getListing={getListing}
                                  id={id}
                                />
                                <a onClick={() => deleteUserReview(userReview._id, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Delete</a>
                              </div>                   
                          }
                        </div>
                      </div>
                    </div>
                  );
                })
                ) : (
                <div className="col-sm-4">
                  <p className="font-italic">No reviews yet.</p>
                </div>
                )}
              </div>
            </div>
          }
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