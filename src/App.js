import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import "./App.css";
import initializeAuthentication from "./Firebase/firebase.initialize";

initializeAuthentication();

function App() {
  // full name state
  const [userName, setUserName] = useState("");
  // email state
  const [email, setEmail] = useState("");
  // password state
  const [password, setPassword] = useState("");
  // password error state below 6 characters
  const [error, setError] = useState("");
  // check-box toggle handler
  const [login, setLogin] = useState(false);

  // full name handler
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  // email handler
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // password handler
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // toggle login handler for the check-box on UI
  const toggleLogin = (e) => {
    setLogin(e.target.checked);
  };

  // default imported auth
  const auth = getAuth();

  // on submit handler to avoid auto page reload on clicking the form's input button
  const handleRegister = (e) => {
    e.preventDefault();
    console.log(email, password);

    // password checker regular expression
    if (password.length < 8) {
      setError("Minimum 8 characters!");
      return;
    }
    if (password.length > 20) {
      setError("Maximum 20 characters!");
      return;
    }
    if (password.search(/[A-Z]/) < 0) {
      setError("At least one uppercase character!");
      return;
    }
    if (password.search(/[a-z]/) < 0) {
      setError("At least one lowercase character!");
      return;
    }
    if (password.search(/[0-9]/) < 0) {
      setError("At least one digit!");
      return;
    }
    if (password.search(/[!@#\$%\^&\*_]/) < 0) {
      setError("At least one special character from -[ ! @ # $ % ^ & * _ ]!");
      return;
    }

    // login or register condition
    login ? loginProcess(email, password) : createNewUser(email, password);
  };

  // registration setup
  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        setError("");
        emailVerification();
        setFullName();
      })
      // fix error
      .catch(() => {
        setError("This Email Already Has Been Used!");
      });
  };

  // login setup
  const loginProcess = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res.user;
        console.log(user);
        setError("");
      })
      .catch(() => {
        const errorMessage = "User not found!";
        setError(errorMessage);
      });
  };

  // user name store on firebase
  const setFullName = () => {
    updateProfile(auth.currentUser, { displayName: userName }).then(
      (res) => {}
    );
  };

  // user's email verification
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser).then((res) => {
      console.log(res);
    });
  };

  // password reset on click handler
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then((res) => {
        console.log(res);
      })
      .catch(() => {
        const errorMessage = "Missing Email!";
        setError(errorMessage);
      });
  };
  return (
    <div className="p-5 mt-5 mx-5 bg-color">
      <div className="container mt-3">
        {/* on submit handler inside the form */}
        <form onSubmit={handleRegister}>
          <h1 className="text-center mb-5">
            Please {login ? "Login" : "Register"}
          </h1>
          {!login && (
            <div className="row mb-3">
              <label htmlFor="inputName1" className="col-sm-2 col-form-label">
                Full Name:
              </label>
              <div className="col-sm-10">
                <input
                  onBlur={handleUserName}
                  type="text"
                  className="form-control"
                  id="inputName1"
                  placeholder="Write your name (English)"
                  required
                />
              </div>
            </div>
          )}
          <div className="row mb-3">
            <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">
              Email:
            </label>
            <div className="col-sm-10">
              {/* using on blur handler */}
              <input
                onBlur={handleEmail}
                type="email"
                className="form-control"
                id="inputEmail3"
                placeholder="Write a valid email address"
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">
              Password:
            </label>
            <div className="col-sm-10">
              {/* using on blur handler */}
              <input
                onBlur={handlePassword}
                type="password"
                className="form-control"
                id="inputPassword3"
                placeholder="Create a password (Should be hard!)"
                required
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-10 offset-sm-2">
              <div className="form-check">
                {/* check-box dynamic with on change handler */}
                <input
                  onChange={toggleLogin}
                  className="form-check-input"
                  type="checkbox"
                  id="gridCheck1"
                />
                <label className="form-check-label" htmlFor="gridCheck1">
                  Already Registered
                </label>
              </div>
            </div>
          </div>
          {/* show error message on UI */}
          <div className="row text-danger mx-0 mb-3">{error}</div>
          <button type="submit" className="btn btn-dark">
            {login ? "Login" : "Register"}
          </button>
          {/* reset password button handler */}
          <button
            onClick={handlePasswordReset}
            type="submit"
            className="btn btn-success mx-3"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
