import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import profileImage from "../images/LoginProfile.jpg"

const Login = props => {

  let navigate = useNavigate();

  const initialUserState = {
    name: "",
    id: "",
  };

  const [user, setUser] = useState(initialUserState);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const login = e => {
    e.preventDefault();
    e.stopPropagation();
    props.login(user)
    navigate('/');
  }

  return (
    <div className="submit-form mx-auto" style={{maxWidth: "400px", marginTop: "5%"}}>
      <div className="auto">
        <div className="mb-4 text-center">
          <img border="0" alt="Profile" src={profileImage} width="90" height="90" className="center"/>
          <h3 className="mt-3 text-danger">User Login</h3>
        </div>
        <div className="form-group pt-2">
          <form onSubmit={login}>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              className="form-control mb-3"
              id="name"
              required
              value={user.name}
              onChange={handleInputChange}
              name="name"
            />

            <label htmlFor="id">Password</label>
            <input
              type="text"
              className="form-control"
              id="id"
              required
              value={user.id}
              onChange={handleInputChange}
              name="id"
            />

            <button onSubmit={login} className="btn btn-success btn-block btn-large" style={{marginTop: "24px"}}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;