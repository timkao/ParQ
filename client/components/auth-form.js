import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { auth } from '../store'
import { Link } from 'react-router-dom'
import LoginLogo from './LoginLogo';


/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error, handleFocus, handleBlur, handleKeyup } = props

  console.log('displayname:',displayName)
  return (
  <div>
    <LoginLogo />
    <div id="auth" className="flat-form">
      <ul className="tabs">
        <li>
          <Link to="/login" className={displayName === 'Login' ? 'active' : null}>Login</Link>
        </li>
        <li>
          <Link to="/signup" className={displayName === 'Sign Up' ? 'active' : null}>Sign Up</Link>
        </li>
      </ul>
      <div id="login" className="form-action show">

        {displayName === 'Login'
          ? <h1>Welcome Back</h1>
          : <h1>Become a Member</h1>}
        <form onSubmit={handleSubmit} name={name}>
          <ul>
            <li>
            <input name='email' type="email" placeholder="Email" required />
            </li>
            <li>
              {displayName == 'Sign Up' ?
               <input type="password" id="psw" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" onFocus={handleFocus} onBlur={handleBlur} onKeyUp={handleKeyup} placeholder="Password" required />
                : <input className="form-control" type="password" id="psw" name="password" placeholder="Password" required />
               }
            </li>
            <li>
              <input id="form-submit" className="btn btn-default" type='submit' value={displayName} />
              <a href='/auth/google' id="auth-google" className="loginBtn loginBtn--google">Login with Google</a>
            </li>
          {error && error.response && <div className="form-group alert alert-danger"> {error.response.data} </div>}
          </ul>
        </form>
      </div>
      <div id="message">
        <h3>Password must contain the following:</h3>
        <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
        <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
        <p id="number" className="invalid">A <b>number</b></p>
        <p id="length" className="invalid">Minimum <b>8 characters</b></p>
      </div>
    </div>
  </div>
  )
}

const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = (dispatch, ownProps) => {
  // pending question to prof...
  /*
    Following two lines get the element but when i use them to update elements
    they do not work...
    const message = document.getElementById('message');
    const letter = document.getElementById("letter");
  */

  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName, ownProps.history))
    },
    handleFocus(evt) {
      evt.preventDefault();
      document.getElementById("message").style.display = "block";
    },
    handleBlur(evt) {
      evt.preventDefault();
      document.getElementById("message").style.display = "none";
    },
    handleKeyup(evt) {
      evt.preventDefault();
      // validate lower case
      const lowerCaseLetters = /[a-z]/g;
      if (evt.target.value.match(lowerCaseLetters)) {
        document.getElementById('letter').classList.remove("invalid");
        document.getElementById('letter').classList.add("valid");
      } else {
        document.getElementById('letter').classList.remove("valid");
        document.getElementById('letter').classList.add("invalid");
      }
      // validate upper case
      const upperCaseLetters = /[A-Z]/g;
      if (evt.target.value.match(upperCaseLetters)) {
        document.getElementById('capital').classList.remove("invalid");
        document.getElementById('capital').classList.add("valid");
      } else {
        document.getElementById('capital').classList.remove("valid");
        document.getElementById('capital').classList.add("invalid");
      }
      // Validate numbers
      const numbers = /[0-9]/g;
      if (evt.target.value.match(numbers)) {
        document.getElementById('number').classList.remove("invalid");
        document.getElementById('number').classList.add("valid");
      } else {
        document.getElementById('number').classList.remove("valid");
        document.getElementById('number').classList.add("invalid");
      }
      // Validate length
      if (evt.target.value.length >= 8) {
        document.getElementById('length').classList.remove("invalid");
        document.getElementById('length').classList.add("valid");
      } else {
        document.getElementById('length').classList.remove("valid");
        document.getElementById('length').classList.add("invalid");
      }
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
