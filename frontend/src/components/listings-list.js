import React, { useState, useEffect } from "react";
import ListingDataService from "../services/listing-data-service";
import { Link } from "react-router-dom";

import Pagination from "./pagination";
import Spinner from "./spinner";
import notFound from '../images/NotFound.png'

let PageSize = 20;

const ListingsList = () => {
  const [listings, setListings] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [searchCountry, setSearchCountry ] = useState("All Countries");
  const [countries, setCountries] = useState(["All Countries"]);
  const [searchPropertyType, setSearchPropertyType ] = useState("All Property Types");
  const [propertyTypes, setPropertyTypes] = useState(["All Property Types"]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const currencies = {"Australia":"AUD", "Brazil":"BRL", "Canada":"CAD", "China":"RMB", "Hong Kong":"HKD",
                    "Portugal": "EUR", "Spain": "EUR", "Turkey": "TRY", "United States": "USD"}

  const symbols = {"Australia":"$", "Brazil":"$", "Canada":"$", "China":"¥", "Hong Kong":"$",
                    "Portugal": "€", "Spain": "€", "Turkey": "₺", "United States": "$"}
                    
  useEffect(() => {
    retrieveListings();
    retrieveCountries();
    retrievePropertyTypes();
  }, []);

  const changePage = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    ListingDataService.getAll(page)
      .then(response => {
        setListings(response.data.listings);
        console.log(response.data.listings);
        window.scrollTo(0, 0);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const resetPage = () => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }

  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  };

  const onChangeSearchCountry = e => {
    const searchCountry = e.target.value;
    setSearchCountry(searchCountry);
  };

  const onChangeSearchPropertyType = e => {
    const searchPropertyType = e.target.value;
    setSearchPropertyType(searchPropertyType);
  };

  const retrieveListings = (currentPage) => {
    setIsLoading(true);
    ListingDataService.getAll(currentPage)
      .then(response => {
        setListings(response.data.listings);
        setTotalResults(response.data.total_results);
        setIsLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCountries = () => {
    ListingDataService.getCountries()
      .then(response => {
        setCountries(["All Countries"].concat(response.data));
      })
      .catch(e => {
        console.log(e)
      })
  }

  const retrievePropertyTypes = () => {
    ListingDataService.getPropertyTypes()
      .then(response => {
        setPropertyTypes(["All Property Types"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  // const refreshList = () => {
  //   retrieveListings(currentPage);
  // };

  const search = e => {
    e.preventDefault();
    document.activeElement.blur();
    setIsSearching(true);

    ListingDataService.find(searchName, searchCountry, searchPropertyType)
      .then(response => {
        setIsSearching(false);
        setListings(response.data.listings);
        setTotalResults(response.data.total_results);
        resetPage();
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <React.Fragment>
      {isLoading ? 
        <Spinner />
        :
        <div>
          <div className="row pb-1">
            <div className="input-group col-lg-4">
              <form className="d-flex w-100" onSubmit={search}>
                <input
                  type="search"
                  id="text"
                  className="form-control shadow-none rounded-0"
                  placeholder="Search by name"
                  value={searchName}
                  onChange={onChangeSearchName}
                  style={{borderRadius: "5% 0% 0% 5%"}}
                />
                <button
                  className="btn btn-outline-secondary rounded-right"
                  type="submit"
                  onSubmit={search}
                  style={{borderRadius: "0% 5% 5% 0%"}}
                >
                  Search
                </button>
              </form>
            </div>
            <div className="input-group col-lg-4">
              <select id="country" autoComplete="off" onChange={onChangeSearchCountry} style={{paddingLeft: "0.4rem", paddingRight: "0.3rem"}}>
                {countries.map(country => {
                  return (
                    <option value={country} key={country}> {country.substr(0, 25)} </option>
                  )
                })}
              </select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={search}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="input-group col-lg-4">
              <select id="property_type" autoComplete="off" onChange={onChangeSearchPropertyType} style={{paddingLeft: "0.35rem", paddingRight: "0.2rem"}}>
                {propertyTypes.map(property_type => {
                  return (
                    <option value={property_type} key={property_type}> {property_type.substr(0, 20)} </option>
                  )
                })}
              </select>
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={search}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          { isSearching ? 
            <Spinner />
          : 
            <div className="row mt-3 mb-3 pb-5 d-flex justify-content-center">
              {listings.length > 0 ? (
                listings.map((listing) => {
                  const address = listing.address.suburb ? `${listing.address.suburb}, ${listing.address.street}` : `${listing.address.street}`;
                  return (
                    <div className="col-lg-4 pb-3" key={listing._id}>
                      <div className="card h-100">
                        <div className="card-body d-flex flex-column" style={{paddingBottom: "10px"}}>
                          <div className="mb-3" style={{minHeight: "200px"}}>
                            <img src={listing.images.picture_url} alt="&nbsp;(No Preview)" width="200" height="200" style={{borderRadius: "3%"}}></img>
                          </div>
                          <h5 className="card-title">{listing.name}</h5>
                          <h6 className="text-danger">{symbols[listing.address.country]}{parseInt(listing.price.$numberDecimal)} {currencies[listing.address.country]}</h6>
                          <p className="card-text pt-1 mb-1">
                            <strong>Area: </strong>{address}<br/>
                            <strong>Property Type: </strong>{listing.property_type}
                          </p>
                          <div className="row pl-2 mt-auto">
                            <Link to={"/listings/"+listing._id} className="btn btn-danger col-lg-5 mx-1 mb-1 mr-2">
                              View Reviews
                            </Link>
                            <a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/?q=" + listing.address.location.coordinates[1] + ","
                              + listing.address.location.coordinates[0]} 
                              className="btn btn-danger col-lg-5 mx-1 mb-1 align-items-center justify-content-center d-flex">
                                View Map
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{marginTop: "15%", textAlign: "center"}}>
                  <img border="0" alt="Logo" src={notFound} width="160" height="150" />
                  <p className="pl-2 pt-3">No matching results.</p>
                </div>
              )}
            </div>
          }
        </div>
      }

      { isSearching ? 
        ""
        : 
        <div className="pagination-bar">
          <div className="d-flex justify-content-center mt-2">
            <Pagination
              currentPage={currentPage}
              totalCount={totalResults}
              pageSize={PageSize}
              onPageChange={page => changePage(page)}
            />
          </div>
        </div>

      }
      
    </React.Fragment>
  );
};

export default ListingsList;