import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import { auth } from '../store'

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div id="auth">
      <form onSubmit={handleSubmit} name={name}>
        <div className="form-group">
          <label htmlFor='email'><small>Email</small></label>
          <input className="form-control" name='email' type='text' />
        </div>
        <div className="form-group">
          <label htmlFor='psw'><small>Password</small></label>
          {/* <input name='password' type='password' /> */}
          <input className="form-control" type="password" id="psw" name="psw" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required />
        </div>
        <div className="form-group">
          {/* <button type='submit'>{displayName}</button> */}
          <input id="form-submit" className="btn btn-default" type='submit' value={displayName} />
          <a id="auth-google" href='/auth/google'>Login with Google</a>
        </div>
        {error && error.response && <div className="form-group alert alert-danger"> {error.response.data} </div>}
        {/* <div className="form-group">
          <a href='/auth/google'>Login with Google</a>
        </div> */}
      </form>
      {/* <a href='/auth/google'>Login with Google</a> */}
    </div>
  )
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
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
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName, ownProps.history))
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
