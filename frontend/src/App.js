import React from 'react'
import { Routes, Route, Link, useParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import AddUserReview from './components/add-user-review'
import Listing from './components/listing'
import ListingsList from './components/listings-list'
import Login from './components/login'

function App() {
  const [user, setUser] = React.useState(null);

  async function login(user = null) {
    setUser(user);
  }

  async function logout() {
    setUser(null);
  }

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/listings" className="navbar-brand">
          Airbnb Listings and Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/listings"} className="nav-link">
              All Listings
            </Link>
          </li>
          <li className="nav-item" >
            { user ? (
              <a onClick={logout} className="nav-link" style={{cursor:'pointer'}}>
                Logout {user.name}
              </a>
            ) : (            
            <Link to={"/login"} className="nav-link">
              Login
            </Link>
            )}

          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path="/" element={<ListingsList />} />
          <Route exact path="/listings" element={<ListingsList />} />
          <Route 
            path="/listings/:id/user-review"
            element={<AddUserReview user={user}/>}
          />
          <Route 
            path="/listings/:id"
            element={<Listing user={user}/>}
          />
          <Route 
            path="/login"
            element={<Login login={login}/>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
