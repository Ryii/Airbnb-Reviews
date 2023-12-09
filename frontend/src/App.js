import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

import AddUserReview from './components/add-user-review'
import Listing from './components/listing'
import ListingsList from './components/listings-list'
import Login from './components/login'
import Footer from './components/footer'

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
      <nav className="navbar navbar-expand navbar-dark bg-dark"  style={{background: "linear-gradient(to right, #EB2D47, #FF405D)"}}>
        
        <a href="/listings" className="navbar-brand">
          <img border="0" alt="W3Schools" src="AirbnbLogo.jpg" width="250" height="40" />
        </a>
        <div className="navbar-nav">
          <li className="nav-item">
            <a href="/listings" class="my-nav-link">
              All Listings
            </a>
            {/* <Link to={"/listings"} className="nav-link">
              All Listings
            </Link> */}
          </li>
        </div>
        <div className="navbar-nav ml-auto">
          <li className="nav-item ml-auto" >
              { user ? (
                <a onClick={logout} className="my-nav-link" style={{cursor:'pointer'}}>
                  Logout {user.name}
                </a>
              ) : (            
              <Link to={"/login"} className="my-nav-link">
                Login User
              </Link>
              )}

            </li>
        </div>
      </nav>

      <div className="container pt-3 pb-2 position-relative">
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
      <Footer />
    </div>
  );
}

export default App;
