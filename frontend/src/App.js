import React, { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddUserReview from './components/add-user-review'
import Listing from './components/listing'
import ListingsList from './components/listings-list'
import Login from './components/login'
import Footer from './components/footer'
import logo from './images/AirbnbLogo.jpg'


function App() {
  let navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [state, setState] = useState(Date.now());

  async function login(user = null) {
    loginAlert(user.name);
    setUser(user);
  }

  async function logout() {
    setUser(null);
    navigate('/login');
    logoutAlert();
  }

  async function rerender() {
    setState(Date.now());
  }

  const loginAlert = username => toast.success(`Logged in as ${username}.`, {
    position: "top-center",
    autoClose: 1200,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored",
  });

  const logoutAlert = () => toast.error(`Logged out.`, {
    position: "top-center",
    autoClose: 1200,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "colored",
  });

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="colored"
        transition={Slide}
      />

      <nav className="navbar navbar-expand navbar-dark bg-dark"  style={{background: "linear-gradient(to right, #EB2D47, #FF405D)"}}>
        <Link to={"/listings"} onClick={rerender} className="navbar-brand">
          <img border="0" alt="Logo" src={logo} width="250" height="40" />
        </Link>
        <div className="navbar-nav">
          <li className="nav-item">
            <Link to={"/listings"} onClick={rerender} className="my-nav-link">
              All Listings
            </Link>
          </li>
        </div>
        <div className="navbar-nav ml-auto">
          <li className="nav-item ml-auto" >
              { user ? (
                <a onClick={logout} className="my-nav-link" style={{cursor:'pointer'}}>
                  Logout <span style={{color: "white", fontWeight: "bold"}}>{user.name}</span>
                </a>
              ) : (            
              <Link to={"/login"} className="my-nav-link">
                Login
              </Link>
              )}
            </li>
        </div>
      </nav>

      <div className="container pt-3 pb-2 position-relative">
        <Routes>
          <Route exact path="/" element={<ListingsList key={state}/>} />
          <Route exact path="/listings" element={<ListingsList key={state}/>} />
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
