import React, { useState, useEffect } from "react";
import ListingDataService from "../services/listing-data-service";
import { Link } from "react-router-dom";
import Pagination from "./pagination";

let PageSize = 20;

const ListingsList = props => {
  const [listings, setListings] = useState([]);
  const [searchName, setSearchName ] = useState("");
  // const [searchZip, setSearchZip ] = useState("");
  const [searchCountry, setSearchCountry ] = useState("");
  const [countries, setCountries] = useState(["All Countries"]);
  const [searchPropertyType, setSearchPropertyType ] = useState("");
  const [propertyTypes, setPropertyTypes] = useState(["All Property Types"]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    retrieveListings();
    retrieveCountries();
    retrievePropertyTypes();
  }, []);

  const changePage = (page) => {
    ListingDataService.getAll(page)
      .then(response => {
        setListings(response.data.listings);
        setCurrentPage(page);
        window.scrollTo(0, 0);
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

  // const onChangeSearchZip = e => {
  //   const searchZip = e.target.value;
  //   setSearchZip(searchZip);
  // };

  const onChangeSearchCountry = e => {
    const searchCountry = e.target.value;
    setSearchCountry(searchCountry);
  };

  const onChangeSearchPropertyType = e => {
    const searchPropertyType = e.target.value;
    setSearchPropertyType(searchPropertyType);
  };

  const retrieveListings = (currentPage) => {
    ListingDataService.getAll(currentPage)
      .then(response => {
        setListings(response.data.listings);
        setTotalResults(response.data.total_results);
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

  const refreshList = () => {
    retrieveListings(currentPage);
  };

  const find = (query, by) => {
    ListingDataService.find(query, by)
      .then(response => {
        console.log(response.data);
        setListings(response.data.listings);
        setTotalResults(response.data.total_results);
        resetPage();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    find(searchName, "name")
  };

  const findByCountry = () => {
    if (searchCountry === "All Countries") {
      refreshList();
    } else {
      find(searchCountry, "country")
    }
  };

  const findByPropertyType = () => {
    if (searchPropertyType === "All Property Types") {
      refreshList();
    } else {
      find(searchPropertyType, "property_type")
    }
  };

  return (
    <div>
      {isLoading ? "Loading" : ""}
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        {/* <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={onChangeSearchZip}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div> */}
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchCountry}>
             {countries.map(country => {
               return (
                 <option value={country}> {country.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCountry}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <select onChange={onChangeSearchPropertyType}>
             {propertyTypes.map(property_type => {
               return (
                 <option value={property_type}> {property_type.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByPropertyType}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        {listings.map((listing) => {
          const address = `${listing.address.suburb}, ${listing.address.street}`;
          return (
            <div className="col-lg-4 pb-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{listing.name}</h5>
                  <div>
                    <img src={listing.images.picture_url} alt="&nbsp;(No Preview)" width="200" height="200"></img>
                  </div>
                  <p className="card-text">
                    <strong>Area: </strong>{address}<br/>
                    <strong>Property Type: </strong>{listing.property_type}
                  </p>
                  <div className="row">
                  <Link to={"/listings/"+listing._id} className="btn btn-primary col-lg-5 mx-1 mb-1">
                    View Reviews
                  </Link>
                  <a target="_blank" rel="noreferrer" href={"https://www.google.com/maps/?q=" + listing.address.location.coordinates[1] + ","
                    + listing.address.location.coordinates[0]} className="btn btn-primary col-lg-5 mx-1 mb-1">
                      View Map
                  </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-center mt-2">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={totalResults}
          pageSize={PageSize}
          onPageChange={page => changePage(page)}
        />
      </div>
    </div>
  );
};

export default ListingsList;