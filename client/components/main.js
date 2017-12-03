import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout, getMap, getSpots, getLots } from '../store'
import {Navbar, NavItem, MenuItem, NavDropdown, Nav} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
const Main = (props) => {
  const { children, handleClick, isLoggedIn } = props;

  return (
    <div>
      {/* <h1>Check</h1> */}
      {
        isLoggedIn
        ? <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">
                  <img alt="Brand" style={{height: '5vh'}} src="/public/images/Parq_Logo.png" />
                </a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                {/* The navbar will show these NavLinks after you log in */}
                <LinkContainer to='/home'><NavItem>Home</NavItem></LinkContainer>
                {/* <LinkContainer to={`/profile/${1}`} replace> */}
                <NavItem>My Account</NavItem></LinkContainer>
                <NavItem  onClick={handleClick}>Logout</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
            : null //Will auto load from auth-form.js
        }
      {children}
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch, ownProps) => {
  return {
    handleClick() {
      dispatch(getMap({}))
      dispatch(getLots([]));
      dispatch(getSpots([]));
      dispatch(logout(ownProps.history));
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}